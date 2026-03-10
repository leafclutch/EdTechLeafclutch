"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase/client";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.replace("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-(--color-dark) to-[#0f1b3d] p-4">
      <div className="bg-white rounded-xl p-8 w-full max-w-md shadow-2xl">
        <div className="text-center mb-6">
          <Image
            src="/logo.png"
            alt="Leafclutch Technologies"
            width={180}
            height={50}
            className="mx-auto mb-3"
            priority
          />
          <h1 className="font-heading text-[20px] font-bold text-(--color-dark)">
            Admin Panel
          </h1>
          <p className="text-(--color-text) text-[14px] mt-1">
            Sign in to your admin dashboard
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-[13px] p-3 rounded-lg mb-4 border border-red-200">
            <i className="fas fa-exclamation-circle mr-1" /> {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="loginEmail"
              className="block text-[13px] font-semibold text-(--color-dark) mb-1.5"
            >
              Email Address
            </label>
            <input
              type="email"
              id="loginEmail"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@leafclutchtech.com.np"
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[14px] focus:border-(--color-primary) focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="loginPassword"
              className="block text-[13px] font-semibold text-(--color-dark) mb-1.5"
            >
              Password
            </label>
            <input
              type="password"
              id="loginPassword"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full px-4 py-3 rounded-lg border border-(--color-border) text-[14px] focus:border-(--color-primary) focus:ring-2 focus:ring-primary/20 outline-none transition-all"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-(--color-primary) text-white font-heading font-semibold text-[15px] hover:bg-(--color-primary-dark) transition-all disabled:opacity-50"
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin mr-2" />
                Signing in...
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
