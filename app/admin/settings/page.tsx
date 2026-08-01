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
            const { error } = await supabase
                .from("shop_settings")
                .upsert({
                    ...settings,
                    id: 1,
                    updated_at: new Date().toISOString(),
                });

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
        <div style={{ maxWidth: "680px" }}>
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                    Store Business Settings
                </h1>
                <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                    Manage QR Code upload, UPI payment info, logo, theme, and delivery policies.
                </p>
            </div>

            {msg && (
                <div style={{
                    backgroundColor: msg.type === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(255, 68, 68, 0.2)",
                    border: `1px solid ${msg.type === "success" ? "#28a745" : "#ff4444"}`,
                    color: msg.type === "success" ? "#5dd579" : "#ff6b6b",
                    padding: "14px",
                    borderRadius: "10px",
                    fontSize: "14px",
                    marginBottom: "20px",
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

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>Phone Number</label>
                        <input type="text" required value={settings.shop_phone} onChange={(e) => setSettings({ ...settings, shop_phone: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                    </div>
                    <div>
                        <label style={{ display: "block", fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "4px" }}>WhatsApp Number</label>
                        <input type="text" required value={settings.whatsapp_number} onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })} style={{ width: "100%", padding: "12px", backgroundColor: "#202020", border: "1px solid #333", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
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
