"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { ShopSettings } from "@/lib/types";

export default function AdminSettingsPage() {
    const [settings, setSettings] = useState<ShopSettings>({
        id: 1,
        shop_name: "Burger Bhau (Kothariya)",
        restaurant_name: "Burger Bhau (Kothariya)",
        logo_url: "/BURGER-BHAU-logo.webp",
        banner_url: "/BURGER-BHAU-logo.webp",
        theme_color: "#ff8c00",
        gst_number: "",
        shop_phone: "919558941555",
        whatsapp_number: "919558941555",
        address: "Rolex road, Kothariya, Rajkot",
        google_maps_url: "https://maps.google.com/?q=22.2379,70.8121",
        upi_id: "burgerbhau@upi",
        upi_name: "Burger Bhau Fast Food",
        qr_code_url: "/BURGER-BHAU-logo.webp",
        opening_hours: "11:00 AM - 11:00 PM",
        delivery_radius_meters: 400,
        min_order_for_delivery: 500,
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        async function fetchSettings() {
            setLoading(true);
            const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
            if (data) {
                setSettings(data as ShopSettings);
            }
            setLoading(false);
        }
        fetchSettings();
    }, []);

    const handleQrUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingQr(true);
        const publicUrl = await uploadImageToSupabase(file, "qr");
        if (publicUrl) {
            setSettings((prev) => ({ ...prev, qr_code_url: publicUrl }));
            setMsg({ type: "success", text: "QR Code uploaded to Supabase Storage!" });
        } else {
            setMsg({ type: "error", text: "Failed to upload QR image to Supabase Storage." });
        }
        setUploadingQr(false);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMsg(null);

        try {
            const cleanPhones = (settings.additional_phones || []).map((p) => p.trim()).filter(Boolean);
            const cleanWhatsapps = (settings.additional_whatsapps || []).map((w) => w.trim()).filter(Boolean);

            const payload: any = {
                ...settings,
                id: 1,
                additional_phones: cleanPhones,
                additional_whatsapps: cleanWhatsapps,
                updated_at: new Date().toISOString(),
            };

            let { error } = await supabase
                .from("shop_settings")
                .upsert(payload);

            if (error && (error.message.includes("additional_phones") || error.message.includes("additional_whatsapps") || error.message.includes("schema cache"))) {
                delete payload.additional_phones;
                delete payload.additional_whatsapps;
                const retry = await supabase.from("shop_settings").upsert(payload);
                error = retry.error;
                if (!error) {
                    setMsg({
                        type: "success",
                        text: "Store settings updated! Note: Please run the migration SQL script in Supabase to add backup phone lines.",
                    });
                    setSaving(false);
                    return;
                }
            }

            if (error) {
                setMsg({ type: "error", text: error.message });
            } else {
                setMsg({ type: "success", text: "Store settings updated successfully!" });
            }
        } catch (err: any) {
            setMsg({ type: "error", text: err?.message || "Failed to save settings." });
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <p>Loading shop settings...</p>;
    }

    return (
        <div style={{ maxWidth: "720px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    margin: 0,
                    color: "#F0E8C7",
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    letterSpacing: "-0.01em",
                }}>
                    Store Business <span style={{ color: "#ff8c00" }}>Settings</span>
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(240, 232, 199, 0.7)", marginTop: "6px" }}>
                    Manage QR Code upload, UPI payment info, logo, theme, and delivery policies.
                </p>
            </div>

            {msg && (
                <div style={{
                    backgroundColor: msg.type === "success" ? "rgba(34, 197, 94, 0.15)" : "rgba(239, 68, 68, 0.15)",
                    border: `1px solid ${msg.type === "success" ? "#22c55e" : "#ef4444"}`,
                    color: msg.type === "success" ? "#4ade80" : "#fca5a5",
                    padding: "14px 18px",
                    borderRadius: "14px",
                    fontSize: "14px",
                    fontWeight: "600",
                    marginBottom: "20px",
                }}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSave} style={{
                backgroundColor: "rgba(22, 17, 13, 0.85)",
                border: "1px solid rgba(207, 75, 19, 0.25)",
                borderRadius: "20px",
                padding: "28px",
                display: "flex",
                flexDirection: "column",
                gap: "18px",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(16px)",
            }}>

                {/* QR Code Upload Section */}
                <div style={{ backgroundColor: "#202020", border: "1px solid #333", borderRadius: "12px", padding: "16px" }}>
                    <h3 style={{ fontSize: "15px", fontWeight: "700", color: "#ff8c00", marginBottom: "10px" }}>
                        Upload UPI QR Code (Supabase Storage)
                    </h3>
                    <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <img src={settings.qr_code_url} alt="QR Code" style={{ width: "100px", height: "100px", objectFit: "contain", backgroundColor: "#fff", padding: "4px", borderRadius: "8px" }} />
                        <div style={{ flex: 1 }}>
                            <input type="file" accept="image/*" onChange={handleQrUpload} disabled={uploadingQr} style={{ fontSize: "13px", color: "#aaa" }} />
                            <p style={{ fontSize: "12px", color: "#777", marginTop: "6px" }}>{uploadingQr ? "Uploading..." : "Upload QR image file directly to Supabase Storage"}</p>
                        </div>
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Restaurant Name</label>
                        <input type="text" required value={settings.restaurant_name || settings.shop_name} onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value, shop_name: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>GST Number (Optional)</label>
                        <input type="text" value={settings.gst_number || ""} onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })} placeholder="e.g. 24AAAAA0000A1Z5" style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>UPI ID</label>
                        <input type="text" required value={settings.upi_id} onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>UPI Account Name</label>
                        <input type="text" value={settings.upi_name || ""} onChange={(e) => setSettings({ ...settings, upi_name: e.target.value })} placeholder="Burger Bhau Fast Food" style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                </div>

                {/* Phone Numbers Section */}
                <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#ff8c00", margin: 0 }}>
                                Phone Calling Lines (Voice Call)
                            </h3>
                            <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0 0" }}>
                                Primary number will be called first. Add backup phone lines for high order volume.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSettings((prev) => ({
                                ...prev,
                                additional_phones: [...(prev.additional_phones || []), ""],
                            }))}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "rgba(255, 140, 0, 0.15)",
                                border: "1px solid #ff8c00",
                                color: "#ff8c00",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                            }}
                        >
                            + Add Phone Line
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>
                                Primary Phone Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={settings.shop_phone}
                                onChange={(e) => setSettings({ ...settings, shop_phone: e.target.value })}
                                style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                            />
                        </div>

                        {(settings.additional_phones || []).map((num, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#888", marginBottom: "2px" }}>
                                        Backup Phone #{idx + 2}
                                    </label>
                                    <input
                                        type="text"
                                        value={num}
                                        onChange={(e) => {
                                            const updated = [...(settings.additional_phones || [])];
                                            updated[idx] = e.target.value;
                                            setSettings({ ...settings, additional_phones: updated });
                                        }}
                                        placeholder="e.g. 919876543210"
                                        style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (settings.additional_phones || []).filter((_, i) => i !== idx);
                                        setSettings({ ...settings, additional_phones: updated });
                                    }}
                                    style={{
                                        marginTop: "16px",
                                        padding: "8px 12px",
                                        backgroundColor: "rgba(255, 68, 68, 0.15)",
                                        border: "1px solid #ff4444",
                                        color: "#ff6b6b",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Numbers Section */}
                <div style={{ backgroundColor: "#1e1e1e", border: "1px solid #333", borderRadius: "12px", padding: "16px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <div>
                            <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#25d366", margin: 0 }}>
                                WhatsApp Order Lines
                            </h3>
                            <p style={{ fontSize: "12px", color: "#888", margin: "2px 0 0 0" }}>
                                Primary WhatsApp receives instant orders. Add additional lines for store managers or counters.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSettings((prev) => ({
                                ...prev,
                                additional_whatsapps: [...(prev.additional_whatsapps || []), ""],
                            }))}
                            style={{
                                padding: "6px 12px",
                                backgroundColor: "rgba(37, 211, 102, 0.15)",
                                border: "1px solid #25d366",
                                color: "#25d366",
                                borderRadius: "6px",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                            }}
                        >
                            + Add WhatsApp Line
                        </button>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                        <div>
                            <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>
                                Primary WhatsApp Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={settings.whatsapp_number}
                                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                            />
                        </div>

                        {(settings.additional_whatsapps || []).map((num, idx) => (
                            <div key={idx} style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                                <div style={{ flex: 1 }}>
                                    <label style={{ display: "block", fontSize: "11px", fontWeight: "600", color: "#888", marginBottom: "2px" }}>
                                        Additional WhatsApp Line #{idx + 2}
                                    </label>
                                    <input
                                        type="text"
                                        value={num}
                                        onChange={(e) => {
                                            const updated = [...(settings.additional_whatsapps || [])];
                                            updated[idx] = e.target.value;
                                            setSettings({ ...settings, additional_whatsapps: updated });
                                        }}
                                        placeholder="e.g. 919876543210"
                                        style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (settings.additional_whatsapps || []).filter((_, i) => i !== idx);
                                        setSettings({ ...settings, additional_whatsapps: updated });
                                    }}
                                    style={{
                                        marginTop: "16px",
                                        padding: "8px 12px",
                                        backgroundColor: "rgba(255, 68, 68, 0.15)",
                                        border: "1px solid #ff4444",
                                        color: "#ff6b6b",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                        fontSize: "13px",
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Store Address</label>
                    <textarea rows={2} required value={settings.address} onChange={(e) => setSettings({ ...settings, address: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                </div>

                <div>
                    <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Google Maps Embed URL</label>
                    <input type="text" required value={settings.google_maps_url} onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Working Hours</label>
                        <input type="text" required value={settings.opening_hours} onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Max Radius (Meters)</label>
                        <input type="number" required value={settings.delivery_radius_meters} onChange={(e) => setSettings({ ...settings, delivery_radius_meters: Number(e.target.value) })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "12px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Min Order Amount (₹)</label>
                        <input type="number" required value={settings.min_order_for_delivery} onChange={(e) => setSettings({ ...settings, min_order_for_delivery: Number(e.target.value) })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                </div>

                <button type="submit" disabled={saving} style={{ marginTop: "12px", padding: "14px", backgroundColor: "#ff8c00", color: "#000", border: "none", borderRadius: "10px", fontWeight: "800", fontSize: "15px", cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1 }}>
                    {saving ? "Saving Changes..." : "Save Business Settings"}
                </button>
            </form>
        </div>
    );
}
