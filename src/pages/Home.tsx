import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGameSession } from "../hooks/useGameSession";
import { isSupabaseConfigured } from "../lib/supabase";

function SetupGuide() {
  return (
    <div className="bg-white rounded-3xl p-8 max-w-lg w-full shadow-xl text-left">
      <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
        <span>🔧</span> Connect Supabase
      </h2>
      <p className="mb-4 text-gray-600">
        To play across devices, you need a free Supabase account. Here's how:
      </p>
      <ol className="space-y-3 text-sm">
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            1
          </span>
          <span>
            Go to <strong>supabase.com</strong> and create a free account
          </span>
        </li>
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            2
          </span>
          <span>Create a new project</span>
        </li>
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            3
          </span>
          <span>
            Go to <strong>SQL Editor</strong> and run the SQL from{" "}
            <code className="bg-gray-100 px-1 rounded">
              supabase-schema.sql
            </code>
          </span>
        </li>
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            4
          </span>
          <span>
            Copy your <strong>Project URL</strong> and{" "}
            <strong>anon key</strong> from Settings &rarr; API
          </span>
        </li>
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            5
          </span>
          <span>
            Create a <code className="bg-gray-100 px-1 rounded">.env</code>{" "}
            file (copy from{" "}
            <code className="bg-gray-100 px-1 rounded">.env.example</code>) and
            paste your keys
          </span>
        </li>
        <li className="flex gap-2">
          <span className="bg-amber-400 text-black font-bold w-6 h-6 rounded-full flex items-center justify-center shrink-0">
            6
          </span>
          <span>
            Restart the dev server with <code className="bg-gray-100 px-1 rounded">npm run dev</code>
          </span>
        </li>
      </ol>
    </div>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const { loading, error, createSession, joinSession } = useGameSession();
  const [mode, setMode] = useState<"menu" | "create" | "join">("menu");
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  if (!isSupabaseConfigured) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-300 via-orange-300 to-red-300 flex flex-col items-center justify-center p-4">
        <h1 className="text-5xl font-bold mb-2 font-serif">🍔 Burger Game</h1>
        <p className="text-xl mb-8 text-gray-700">
          Almost ready! Just need to set up the database.
        </p>
        <SetupGuide />
      </div>
    );
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    const session = await createSession(name || "Burger Game");
    if (session) {
      navigate(`/order/${session.id}?code=${session.code}`);
    }
  }

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault();
    const session = await joinSession(code);
    if (session) {
      navigate(`/kitchen/${session.id}`);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-300 via-orange-300 to-red-300 flex flex-col items-center justify-center p-4">
      <div className="text-center mb-10">
        <h1 className="text-6xl md:text-8xl font-bold font-serif mb-2 drop-shadow-lg">
          🍔
        </h1>
        <h1 className="text-4xl md:text-6xl font-bold font-serif mb-2 drop-shadow-lg">
          Burger Game
        </h1>
        <p className="text-xl text-gray-700">
          The restaurant game for the whole family!
        </p>
      </div>

      {mode === "menu" && (
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <button
            onClick={() => setMode("create")}
            className="bg-green-500 hover:bg-green-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            🏪 Start Restaurant
          </button>
          <button
            onClick={() => setMode("join")}
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-6 px-8 rounded-2xl text-2xl transition-all hover:scale-105 active:scale-95 shadow-xl"
          >
            👨‍🍳 Join Kitchen
          </button>
        </div>
      )}

      {mode === "create" && (
        <form
          onSubmit={handleCreate}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            🏪 Name Your Restaurant
          </h2>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Blake's Burgers"
            className="w-full border-2 border-amber-300 rounded-xl p-4 text-lg mb-4 focus:border-amber-500 focus:outline-none"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xl transition-all hover:scale-105 active:scale-95"
          >
            {loading ? "Opening..." : "Open for Business!"}
          </button>
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="w-full text-gray-500 mt-3 py-2"
          >
            &larr; Back
          </button>
          {error && (
            <p className="text-red-500 text-center mt-2 font-medium">
              {error}
            </p>
          )}
        </form>
      )}

      {mode === "join" && (
        <form
          onSubmit={handleJoin}
          className="bg-white rounded-3xl p-8 w-full max-w-sm shadow-xl"
        >
          <h2 className="text-2xl font-bold mb-4 text-center">
            👨‍🍳 Enter Kitchen Code
          </h2>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 4))}
            placeholder="4-digit code"
            className="w-full border-2 border-amber-300 rounded-xl p-4 text-3xl text-center tracking-[0.5em] mb-4 focus:border-amber-500 focus:outline-none font-mono"
            maxLength={4}
            inputMode="numeric"
            autoFocus
          />
          <button
            type="submit"
            disabled={loading || code.length !== 4}
            className="w-full bg-blue-500 hover:bg-blue-600 disabled:opacity-50 text-white font-bold py-4 rounded-xl text-xl transition-all hover:scale-105 active:scale-95"
          >
            {loading ? "Joining..." : "Enter Kitchen!"}
          </button>
          <button
            type="button"
            onClick={() => setMode("menu")}
            className="w-full text-gray-500 mt-3 py-2"
          >
            &larr; Back
          </button>
          {error && (
            <p className="text-red-500 text-center mt-2 font-medium">
              {error}
            </p>
          )}
        </form>
      )}
    </div>
  );
}
