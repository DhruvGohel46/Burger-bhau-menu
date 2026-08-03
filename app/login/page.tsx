"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function LoginPage() {
    const router = useRouter();
    const fetchProfile = useAuthStore((s) => s.fetchProfile);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                const profile = await fetchProfile(data.user.id, data.user.email);
                if (profile?.role === "admin") {
                    router.push("/admin");
                } else {
                    router.push("/profile");
                }
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Login failed. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#F0E8C7",
            color: "#060504",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "420px",
                backgroundColor: "rgba(18, 14, 10, 0.76)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: "32px 24px",
                boxShadow: "0 12px 40px rgba(6, 5, 4, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
            }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "8px", color: "#FF9F1C" }}>
                        Welcome Back
                    </h1>
                    <p style={{ fontSize: "14px", color: "#e2e8f0", margin: 0 }}>
                        Log in to manage orders & checkout faster
                    </p>
                </div>

                {errorMsg && (
                    <div style={{
                        backgroundColor: "rgba(255, 68, 68, 0.2)",
                        border: "1px solid #ff4444",
                        color: "#ff6b6b",
                        padding: "10px 14px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        marginBottom: "16px",
                    }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#ffffff", marginBottom: "6px" }}>
                            Email Address *
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="userXXXX@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "8px",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "600",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#ffffff", marginBottom: "6px" }}>
                            Password *
                        </label>
                        <input
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.25)",
                                borderRadius: "8px",
                                color: "#ffffff",
                                fontSize: "15px",
                                fontWeight: "600",
                                outline: "none",
                            }}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            width: "100%",
                            padding: "14px",
                            backgroundColor: "#FF9F1C",
                            color: "#060504",
                            border: "none",
                            borderRadius: "10px",
                            fontSize: "15px",
                            fontWeight: "800",
                            cursor: loading ? "not-allowed" : "pointer",
                            opacity: loading ? 0.7 : 1,
                            marginTop: "8px",
                            boxShadow: "0 6px 20px rgba(255, 159, 28, 0.4)",
                        }}
                    >
                        {loading ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                <div style={{ marginTop: "24px", textAlign: "center", fontSize: "14px", color: "#aaa" }}>
                    Don't have an account?{" "}
                    <Link href="/register" style={{ color: "#FF9F1C", fontWeight: "600", textDecoration: "underline" }}>
                        Create One
                    </Link>
                </div>

                <div style={{ marginTop: "16px", textAlign: "center" }}>
                    <Link href="/" style={{ color: "#888", fontSize: "13px" }}>
                        ← Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}
