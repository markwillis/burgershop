import { useState, useCallback } from "react";
import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { GameSession } from "../types";

function generateCode(): string {
  return Math.floor(1000 + Math.random() * 9000).toString();
}

export function useGameSession() {
  const [session, setSession] = useState<GameSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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

    setSession(data as GameSession);
    return data as GameSession;
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

  return { session, loading, error, createSession, joinSession };
}
