"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
    const router = useRouter();
    const { user, profile, isLoading, signOut, setProfile } = useAuthStore();

    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");

    // Structured Address Fields
    const [houseFlat, setHouseFlat] = useState("");
    const [area, setArea] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("Rajkot");
    const [pincode, setPincode] = useState("360004");

    const [saving, setSaving] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
        } else if (profile) {
            setName(profile.name || "");
            setPhone(profile.phone || "");
            setHouseFlat(profile.house_flat || "");
            setArea(profile.area || "");
            setLandmark(profile.landmark || "");
            setCity(profile.city || "Rajkot");
            setPincode(profile.pincode || "360004");
        }
    }, [user, profile, isLoading, router]);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) return;
        setSaving(true);
        setMsg(null);

        const fullAddress = `${houseFlat}, ${area}, ${landmark ? landmark + ", " : ""}${city} - ${pincode}`;

        try {
            const { error } = await supabase
                .from("profiles")
                .upsert({
                    id: user.id,
                    email: user.email,
                    name,
                    phone,
                    address: fullAddress,
                    house_flat: houseFlat,
                    area,
                    landmark,
                    city,
                    pincode,
                    role: profile?.role || "customer",
                    updated_at: new Date().toISOString(),
                });

            if (error) {
                setMsg({ type: "error", text: error.message });
            } else {
                if (profile) {
                    setProfile({
                        ...profile,
                        name,
                        phone,
                        address: fullAddress,
                        house_flat: houseFlat,
                        area,
                        landmark,
                        city,
                        pincode,
                    });
                }
                setMsg({ type: "success", text: "Profile and delivery address updated successfully!" });
            }
        } catch (err: any) {
            setMsg({ type: "error", text: err?.message || "Failed to update profile." });
        } finally {
            setSaving(false);
        }
    };

    if (isLoading || !user) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading profile...</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f0f0f",
            color: "#fff",
            padding: "24px 16px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{ maxWidth: "600px", margin: "0 auto" }}>
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                    <div>
                        <h1 style={{ fontSize: "24px", fontWeight: "800", color: "#ff8c00" }}>My Account Profile</h1>
                        <p style={{ fontSize: "14px", color: "#aaa" }}>Manage personal details & default delivery address</p>
                    </div>
                    <Link href="/" style={{ padding: "8px 14px", backgroundColor: "#222", color: "#fff", borderRadius: "8px", textDecoration: "none", fontSize: "14px", border: "1px solid #444" }}>
                        ← Menu
                    </Link>
                </div>

                {/* Account Navigation Pill */}
                <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
                    <Link href="/orders" style={{
                        flex: 1,
                        padding: "12px",
                        backgroundColor: "#222",
                        border: "1px solid #333",
                        borderRadius: "10px",
                        textAlign: "center",
                        color: "#ff8c00",
                        fontWeight: "600",
                        textDecoration: "none",
                    }}>
                        📦 View My Orders
                    </Link>
                    {profile?.role === "admin" && (
                        <Link href="/admin" style={{
                            flex: 1,
                            padding: "12px",
                            backgroundColor: "rgba(255, 140, 0, 0.15)",
                            border: "1px solid #ff8c00",
                            borderRadius: "10px",
                            textAlign: "center",
                            color: "#ff8c00",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}>
                            ⚡ Admin Dashboard
                        </Link>
                    )}
                </div>

                {/* Form Card */}
                <div style={{
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "24px",
                    marginBottom: "24px",
                }}>
                    {msg && (
                        <div style={{
                            backgroundColor: msg.type === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(255, 68, 68, 0.2)",
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

                    <form onSubmit={handleSave} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#aaa" }}>
                                Email Address (Read-Only)
                            </label>
                            <input
                                type="email"
                                disabled
                                value={user.email || ""}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "#111",
                                    border: "1px solid #333",
                                    borderRadius: "8px",
                                    color: "#888",
                                    fontSize: "14px",
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                                Full Name *
                            </label>
                            <input
                                type="text"
                                required
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "#262626",
                                    border: "1px solid #444",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", marginBottom: "4px", color: "#ddd" }}>
                                Phone Number *
                            </label>
                            <input
                                type="tel"
                                required
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                                style={{
                                    width: "100%",
                                    padding: "12px",
                                    backgroundColor: "#262626",
                                    border: "1px solid #444",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    fontSize: "14px",
                                    outline: "none",
                                }}
                            />
                        </div>

                        {/* Structured Address Header */}
                        <div style={{ borderTop: "1px solid #333", paddingTop: "14px" }}>
                            <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#ff8c00", marginBottom: "12px" }}>
                                Default Delivery Address
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#aaa" }}>
                                        House / Flat / Building No. *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Flat 302, Sai Residency"
                                        value={houseFlat}
                                        onChange={(e) => setHouseFlat(e.target.value)}
                                        style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                                    />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#aaa" }}>
                                        Area / Street / Society *
                                    </label>
                                    <input
                                        type="text"
                                        required
                                        placeholder="e.g. Rolex Road, Kothariya"
                                        value={area}
                                        onChange={(e) => setArea(e.target.value)}
                                        style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                                    />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#aaa" }}>
                                            Landmark (Optional)
                                        </label>
                                        <input
                                            type="text"
                                            placeholder="e.g. Near Saibaba Temple"
                                            value={landmark}
                                            onChange={(e) => setLandmark(e.target.value)}
                                            style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                                        />
                                    </div>

                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", marginBottom: "4px", color: "#aaa" }}>
                                            City & Pincode
                                        </label>
                                        <div style={{ display: "flex", gap: "6px" }}>
                                            <input
                                                type="text"
                                                required
                                                value={city}
                                                onChange={(e) => setCity(e.target.value)}
                                                style={{ width: "60%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                                            />
                                            <input
                                                type="text"
                                                required
                                                value={pincode}
                                                onChange={(e) => setPincode(e.target.value)}
                                                style={{ width: "40%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "13px" }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                marginTop: "8px",
                                padding: "14px",
                                backgroundColor: "#ff8c00",
                                color: "#000",
                                border: "none",
                                borderRadius: "8px",
                                fontSize: "15px",
                                fontWeight: "700",
                                cursor: saving ? "not-allowed" : "pointer",
                                opacity: saving ? 0.7 : 1,
                            }}
                        >
                            {saving ? "Saving Changes..." : "Save Profile Details"}
                        </button>
                    </form>
                </div>

                {/* Sign Out Button */}
                <button
                    onClick={() => {
                        signOut();
                        router.push("/");
                    }}
                    style={{
                        width: "100%",
                        padding: "14px",
                        backgroundColor: "rgba(255, 68, 68, 0.15)",
                        border: "1px solid #ff4444",
                        color: "#ff6b6b",
                        borderRadius: "12px",
                        fontSize: "15px",
                        fontWeight: "700",
                        cursor: "pointer",
                    }}
                >
                    Sign Out
                </button>
            </div>
        </div>
    );
}
