"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { ShopSettings } from "@/lib/types";
import styles from "./settings.module.css";

export default function AdminSettingsPage() {
    const cleanNumberInput = (val: string): string => {
        if (val === "") return "";
        const numOnly = val.replace(/[^0-9]/g, "");
        if (numOnly === "") return "";
        return numOnly.replace(/^0+(?=\d)/, "");
    };

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
                delivery_radius_meters: Number(settings.delivery_radius_meters) || 0,
                min_order_for_delivery: Number(settings.min_order_for_delivery) || 0,
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
        return <p className={styles.loadingText}>Loading shop settings…</p>;
    }

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Store Business Settings
                </h1>
                <p className={styles.subtitle}>
                    Manage QR Code upload, UPI payment info, logo, theme, and delivery policies.
                </p>
            </div>

            {msg && (
                <div className={`${styles.messageBanner} ${msg.type === "success" ? styles.messageSuccess : styles.messageError}`}>
                    {msg.text}
                </div>
            )}

            <form onSubmit={handleSave} className={styles.form}>

                {/* QR Code Upload Section */}
                <div className={styles.sectionCard}>
                    <h3 className={styles.sectionTitle}>
                        Upload UPI QR Code (Supabase Storage)
                    </h3>
                    <div className={styles.qrRow}>
                        <img src={settings.qr_code_url} alt="QR Code" className={styles.qrImage} />
                        <div className={styles.qrUploadArea}>
                            <input type="file" accept="image/*" onChange={handleQrUpload} disabled={uploadingQr} className={styles.fileInput} />
                            <p className={styles.helperText}>{uploadingQr ? "Uploading…" : "Upload QR image file directly to Supabase Storage"}</p>
                        </div>
                    </div>
                </div>

                <div className={styles.rowTwoCol}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Restaurant Name</label>
                        <input
                            type="text"
                            required
                            value={settings.restaurant_name || settings.shop_name}
                            onChange={(e) => setSettings({ ...settings, restaurant_name: e.target.value, shop_name: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>GST Number (Optional)</label>
                        <input
                            type="text"
                            value={settings.gst_number || ""}
                            onChange={(e) => setSettings({ ...settings, gst_number: e.target.value })}
                            placeholder="e.g. 24AAAAA0000A1Z5"
                            className={styles.input}
                        />
                    </div>
                </div>

                <div className={styles.rowTwoCol}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>UPI ID</label>
                        <input
                            type="text"
                            required
                            value={settings.upi_id}
                            onChange={(e) => setSettings({ ...settings, upi_id: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>UPI Account Name</label>
                        <input
                            type="text"
                            value={settings.upi_name || ""}
                            onChange={(e) => setSettings({ ...settings, upi_name: e.target.value })}
                            placeholder="Burger Bhau Fast Food"
                            className={styles.input}
                        />
                    </div>
                </div>

                {/* Phone Numbers Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3 className={styles.sectionTitle}>
                                Phone Calling Lines (Voice Call)
                            </h3>
                            <p className={styles.sectionDescription}>
                                Primary number will be called first. Add backup phone lines for high order volume.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSettings((prev) => ({
                                ...prev,
                                additional_phones: [...(prev.additional_phones || []), ""],
                            }))}
                            className={styles.addBtnPhone}
                        >
                            + Add Phone Line
                        </button>
                    </div>

                    <div className={styles.repeaterList}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.labelSubtle}>
                                Primary Phone Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={settings.shop_phone}
                                onChange={(e) => setSettings({ ...settings, shop_phone: e.target.value })}
                                className={styles.input}
                            />
                        </div>

                        {(settings.additional_phones || []).map((num, idx) => (
                            <div key={idx} className={styles.repeaterRow}>
                                <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                    <label className={styles.labelSubtle}>
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
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (settings.additional_phones || []).filter((_, i) => i !== idx);
                                        setSettings({ ...settings, additional_phones: updated });
                                    }}
                                    className={styles.removeBtn}
                                    aria-label="Remove phone line"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* WhatsApp Numbers Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3 className={styles.sectionTitleWhatsApp}>
                                WhatsApp Order Lines
                            </h3>
                            <p className={styles.sectionDescription}>
                                Primary WhatsApp receives instant orders. Add additional lines for store managers or counters.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSettings((prev) => ({
                                ...prev,
                                additional_whatsapps: [...(prev.additional_whatsapps || []), ""],
                            }))}
                            className={styles.addBtnWhatsApp}
                        >
                            + Add WhatsApp Line
                        </button>
                    </div>

                    <div className={styles.repeaterList}>
                        <div className={styles.fieldGroup}>
                            <label className={styles.labelSubtle}>
                                Primary WhatsApp Number *
                            </label>
                            <input
                                type="text"
                                required
                                value={settings.whatsapp_number}
                                onChange={(e) => setSettings({ ...settings, whatsapp_number: e.target.value })}
                                className={styles.input}
                            />
                        </div>

                        {(settings.additional_whatsapps || []).map((num, idx) => (
                            <div key={idx} className={styles.repeaterRow}>
                                <div className={styles.fieldGroup} style={{ flex: 1 }}>
                                    <label className={styles.labelSubtle}>
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
                                        className={styles.input}
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => {
                                        const updated = (settings.additional_whatsapps || []).filter((_, i) => i !== idx);
                                        setSettings({ ...settings, additional_whatsapps: updated });
                                    }}
                                    className={styles.removeBtn}
                                    aria-label="Remove WhatsApp line"
                                >
                                    ✕
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Store Address</label>
                    <textarea
                        rows={2}
                        required
                        value={settings.address}
                        onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                        className={styles.textarea}
                    />
                </div>

                <div className={styles.fieldGroup}>
                    <label className={styles.label}>Google Maps Embed URL</label>
                    <input
                        type="text"
                        required
                        value={settings.google_maps_url}
                        onChange={(e) => setSettings({ ...settings, google_maps_url: e.target.value })}
                        className={styles.input}
                    />
                </div>

                <div className={styles.rowThreeCol}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Working Hours</label>
                        <input
                            type="text"
                            required
                            value={settings.opening_hours}
                            onChange={(e) => setSettings({ ...settings, opening_hours: e.target.value })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Max Radius (Meters)</label>
                        <input
                            type="number"
                            required
                            placeholder="0"
                            value={settings.delivery_radius_meters ?? ""}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setSettings({ ...settings, delivery_radius_meters: cleanNumberInput(e.target.value) as any })}
                            className={styles.input}
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Min Order Amount (₹)</label>
                        <input
                            type="number"
                            required
                            placeholder="0"
                            value={settings.min_order_for_delivery ?? ""}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => setSettings({ ...settings, min_order_for_delivery: cleanNumberInput(e.target.value) as any })}
                            className={styles.input}
                        />
                    </div>
                </div>

                <button
                    type="submit"
                    disabled={saving}
                    className={styles.submitBtn}
                >
                    {saving ? "Saving Changes…" : "Save Business Settings"}
                </button>
            </form>
        </div>
    );
}
