"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";

export default function AdminProfilePage() {
    const { user, profile, setProfile } = useAuthStore();
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (profile) {
            setName(profile.name || "");
            setPhone(profile.phone || "");
        }
    }, [profile]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMsg(null);

        const { error } = await supabase
            .from("profiles")
            .upsert({
                id: user.id,
                email: user.email,
                name,
                phone,
                role: "admin",
                updated_at: new Date().toISOString(),
            });

        if (error) {
            setMsg({ type: "error", text: error.message });
        } else {
            if (profile) {
                setProfile({ ...profile, name, phone });
            }
            setMsg({ type: "success", text: "Admin profile updated!" });
        }
        setSaving(false);
    };

    return (
        <div style={{ maxWidth: "560px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                    Admin Account Profile
                </h1>
                <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                    Manage administrator contact details and authentication profile.
                </p>
            </div>

            {msg && (
                <div style={{
                    backgroundColor: msg.type === "success" ? "rgba(40,167,69,0.2)" : "rgba(255,68,68,0.2)",
                    border: `1px solid ${msg.type === "success" ? "#28a745" : "#ff4444"}`,
                    color: msg.type === "success" ? "#5dd579" : "#ff6b6b",
                    padding: "12px",
                    borderRadius: "8px",
                    fontSize: "14px",
                    marginBottom: "16px",
                }}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSave} style={{
                backgroundColor: "#141414",
                border: "1px solid #282828",
                borderRadius: "16px",
                padding: "24px",
                display: "flex",
                flexDirection: "column",
                gap: "16px",
            }}>
                <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#aaa", marginBottom: "4px" }}>Admin Email</label>
                    <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        style={{ width: "100%", padding: "12px", backgroundColor: "#1c1c1c", border: "1px solid #333", borderRadius: "8px", color: "#888" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#ddd", marginBottom: "4px" }}>Display Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "8px", color: "#fff" }}
                    />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", color: "#ddd", marginBottom: "4px" }}>Contact Phone</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #444", borderRadius: "8px", color: "#fff" }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    style={{
                        padding: "14px",
                        backgroundColor: "#ff8c00",
                        color: "#000",
                        border: "none",
                        borderRadius: "8px",
                        fontWeight: "700",
                        fontSize: "15px",
                        cursor: saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Saving..." : "Save Admin Profile"}
                </button>
            </form>
        </div>
    );
}
