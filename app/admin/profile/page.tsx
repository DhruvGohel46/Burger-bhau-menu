"use client";

import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import styles from "./profileAdmin.module.css";

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Admin Account Profile
                </h1>
                <p className={styles.subtitle}>
                    Manage administrator contact details and authentication profile.
                </p>
            </div>

            {msg && (
                <div className={msg.type === "success" ? styles.msgSuccess : styles.msgError}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSave} className={styles.formCard}>
                <div className={styles.field}>
                    <label className={styles.label}>Admin Email</label>
                    <input
                        type="email"
                        disabled
                        value={user?.email || ""}
                        className={styles.inputDisabled}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Display Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <div className={styles.field}>
                    <label className={styles.label}>Contact Phone</label>
                    <input
                        type="tel"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className={styles.input}
                    />
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className={styles.submitBtn}
                >
                    {saving ? "Saving..." : "Save Admin Profile"}
                </button>
            </form>
        </div>
    );
}
