"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function AdminLoginPage() {
    const router = useRouter();
    const fetchProfile = useAuthStore((s) => s.fetchProfile);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleAdminLogin = async (e: React.FormEvent) => {
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
                const userProfile = await fetchProfile(data.user.id, data.user.email);
                if (userProfile?.role === "admin") {
                    router.push("/admin");
                } else {
                    setErrorMsg("Access Denied: You do not have admin permissions.");
                    setLoading(false);
                }
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Login failed.");
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0a0a0a",
            color: "#fff",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{
                width: "100%",
                maxWidth: "400px",
                backgroundColor: "#141414",
                border: "1px solid #2a2a2a",
                borderRadius: "16px",
                padding: "36px 28px",
                boxShadow: "0 20px 40px rgba(0,0,0,0.8)",
            }}>
                <div style={{ textAlign: "center", marginBottom: "28px" }}>
                    <div style={{
                        display: "inline-block",
                        padding: "8px 16px",
                        backgroundColor: "rgba(255, 140, 0, 0.15)",
                        border: "1px solid #ff8c00",
                        borderRadius: "20px",
                        fontSize: "12px",
                        fontWeight: "700",
                        color: "#ff8c00",
                        marginBottom: "12px",
                    }}>
                        ADMINISTRATOR PORTAL
                    </div>
                    <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#fff" }}>
                        Burger Bhau Admin
                    </h1>
                    <p style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>
                        Sign in to manage orders, menu, and store settings.
                    </p>
                </div>

                {errorMsg && (
                    <div style={{
                        backgroundColor: "rgba(255, 68, 68, 0.15)",
                        border: "1px solid #ff4444",
                        color: "#ff6b6b",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "13px",
                        marginBottom: "20px",
                    }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleAdminLogin} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#aaa" }}>
                            Admin Email
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="admin@burgerbhau.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "12px",
                                backgroundColor: "#1e1e1e",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", marginBottom: "6px", color: "#aaa" }}>
                            Password
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
                                backgroundColor: "#1e1e1e",
                                border: "1px solid #333",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
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
                            backgroundColor: "#ff8c00",
                            color: "#000",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "800",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "8px",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Authenticating..." : "Login to Admin Console"}
                    </button>
                </form>
            </div>
        </div>
    );
}
