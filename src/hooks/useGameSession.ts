import { useState, useEffect, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { GameSession } from "../types";

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [sessions, setSessions] = useState<GameSession[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase
      .from("game_sessions")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setSessions(data as GameSession[]);
      });
  }, []);

  const createSession = useCallback(async (name: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured");
      return null;
    }

    setLoading(true);
    setError(null);

    const code = generateCode();

    const { data, error: dbError } = await supabase
      .from("game_sessions")
      .insert({ code, name })
      .select()
      .single();

    setLoading(false);

    if (dbError) {
      setError(dbError.message);
      return null;
    }

    const newSession = data as GameSession;
    setSession(newSession);
    setSessions((prev) => [newSession, ...prev]);
    return newSession;
  }, []);

  const joinSession = useCallback(async (code: string) => {
    if (!isSupabaseConfigured || !supabase) {
      setError("Supabase is not configured");
      return null;
    }

    setLoading(true);
    setError(null);

    const { data, error: dbError } = await supabase
      .from("game_sessions")
      .select()
      .eq("code", code)
      .single();

    setLoading(false);

    if (dbError || !data) {
      setError("Could not find a restaurant with that code. Try again!");
      return null;
    }

    setSession(data as GameSession);
    return data as GameSession;
  }, []);

  const deleteSession = useCallback(async (id: string) => {
    if (!isSupabaseConfigured || !supabase) return;

    await supabase.from("game_sessions").delete().eq("id", id);
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }, []);

  return { session, sessions, loading, error, createSession, joinSession, deleteSession };
}
