"use client"

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

export default function Auth({ onAuth }: { onAuth: (user: User | null) => void }) {
  const [session, setSession] = useState<Session | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      onAuth(session?.user ?? null);
    });
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      onAuth(data.session?.user ?? null);
    });
    return () => {
      listener.subscription.unsubscribe();
    };
  }, [onAuth]);

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    onAuth(null);
  };

  if (session && session.user) {
    return (
      <div className="flex items-center justify-between p-4 bg-gray-100 border-b">
        <span className="text-sm text-gray-700">Logged in as <b>{session.user.email}</b></span>
        <button onClick={handleSignOut} className="ml-4 px-3 py-1 bg-red-500 text-white rounded-lg">Logout</button>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-sm mx-auto">
      <form onSubmit={handleSignIn} className="mb-2">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full mb-2 px-3 py-2 border rounded"
          required
        />
        <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded" disabled={loading}>
          {loading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <form onSubmit={handleSignUp}>
        <button type="submit" className="w-full bg-green-500 text-white py-2 rounded" disabled={loading}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      {error && <div className="text-red-500 mt-2">{error}</div>}
    </div>
  );
} 