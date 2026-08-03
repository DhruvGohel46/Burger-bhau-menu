"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";

export default function RegisterPage() {
    const router = useRouter();
    const fetchProfile = useAuthStore((s) => s.fetchProfile);

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [email, setEmail] = useState("");
    const [address, setAddress] = useState("");
    const [password, setPassword] = useState("");
    const [errorMsg, setErrorMsg] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");
        setLoading(true);

        try {
            const { data, error } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        name,
                        phone,
                        address,
                    },
                },
            });

            if (error) {
                setErrorMsg(error.message);
                setLoading(false);
                return;
            }

            if (data.user) {
                // Try updating profile row created by trigger if session is active
                try {
                    await supabase.from("profiles").upsert({
                        id: data.user.id,
                        email,
                        name,
                        phone,
                        address,
                        role: "customer",
                    });
                } catch {
                    // Trigger automatically handles creation in DB
                }

                await fetchProfile(data.user.id, email);
                router.push("/profile");
            }
        } catch (err: any) {
            setErrorMsg(err?.message || "Registration failed. Please try again.");
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
                maxWidth: "440px",
                backgroundColor: "rgba(18, 14, 10, 0.76)",
                backdropFilter: "blur(20px) saturate(180%)",
                WebkitBackdropFilter: "blur(20px) saturate(180%)",
                border: "1px solid rgba(255, 255, 255, 0.12)",
                borderRadius: "16px",
                padding: "32px 24px",
                boxShadow: "0 12px 40px rgba(6, 5, 4, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
            }}>
                <div style={{ textAlign: "center", marginBottom: "24px" }}>
                    <h1 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px", color: "#CF4B13" }}>
                        Create Account
                    </h1>
                    <p style={{ fontSize: "14px", color: "#aaa" }}>
                        Join Burger Bhau for easy ordering and tracking.
                    </p>
                </div>

                {errorMsg && (
                    <div style={{
                        backgroundColor: "rgba(255, 68, 68, 0.15)",
                        border: "1px solid #ff4444",
                        color: "#ff6b6b",
                        padding: "12px",
                        borderRadius: "8px",
                        fontSize: "14px",
                        marginBottom: "16px",
                    }}>
                        {errorMsg}
                    </div>
                )}

                <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            required
                            placeholder="Alex XXXX"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                            Phone Number
                        </label>
                        <input
                            type="tel"
                            required
                            placeholder="+91 98XXX XXXXX"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            required
                            placeholder="userXXXX@gmail.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                            Delivery Address
                        </label>
                        <textarea
                            required
                            rows={2}
                            placeholder="Street address, house no, landmark"
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
                                borderRadius: "8px",
                                color: "#fff",
                                fontSize: "14px",
                                outline: "none",
                                resize: "vertical",
                            }}
                        />
                    </div>

                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                            Password
                        </label>
                        <input
                            type="password"
                            required
                            minLength={6}
                            placeholder="Minimum 6 characters"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: "100%",
                                padding: "10px 12px",
                                backgroundColor: "rgba(255, 255, 255, 0.08)",
                                border: "1px solid rgba(255, 255, 255, 0.18)",
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
                            backgroundColor: "#CF4B13",
                            color: "#fff",
                            border: "none",
                            borderRadius: "8px",
                            fontSize: "15px",
                            fontWeight: "700",
                            cursor: loading ? "not-allowed" : "pointer",
                            marginTop: "8px",
                            opacity: loading ? 0.7 : 1,
                        }}
                    >
                        {loading ? "Creating Account..." : "Register"}
                    </button>
                </form>

                <div style={{ marginTop: "20px", textAlign: "center", fontSize: "14px", color: "#aaa" }}>
                    Already have an account?{" "}
                    <Link href="/login" style={{ color: "#CF4B13", fontWeight: "600", textDecoration: "underline" }}>
                        Sign In
                    </Link>
                </div>

                <div style={{ marginTop: "12px", textAlign: "center" }}>
                    <Link href="/" style={{ color: "#888", fontSize: "13px" }}>
                        ← Back to Menu
                    </Link>
                </div>
            </div>
        </div>
    );
}
