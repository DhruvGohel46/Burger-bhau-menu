"use client";

import { useEffect, useState, useMemo } from "react";
import { supabase } from "@/lib/supabase";
import { uploadImageToSupabase } from "@/lib/storage";
import { ShopSettings, SpecialHoursConfig } from "@/lib/types";
import {
    STORE,
    getStoreStatus,
    getTodayIstDateStr,
    getTomorrowIstDateStr,
    formatTime12,
} from "@/app/data/storeConfig";
import { MenuItem, getDynamicMenuItems } from "@/app/data/menu";
import styles from "./settings.module.css";

const TIME_PRESETS = [
    { label: "11:30 PM", value: "23:30" },
    { label: "12:00 AM Midnight", value: "00:00" },
    { label: "12:30 AM", value: "00:30" },
    { label: "1:00 AM", value: "01:00" },
    { label: "1:30 AM", value: "01:30" },
    { label: "2:00 AM", value: "02:00" },
    { label: "2:30 AM", value: "02:30" },
    { label: "3:00 AM", value: "03:00" },
];

const OCCASION_PRESETS = [
    "Special Late Night",
    "Festival Rush",
    "Navratri Night",
    "Diwali Night",
    "Weekend Extended",
];

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
        banner_url: "/hero.jpg",
        hero_image_url: "/hero.jpg",
        highlighted_items: STORE.highlightedItems,
        theme_color: "#ff8c00",
        gst_number: "",
        shop_phone: "919558941555",
        whatsapp_number: "919558941555",
        address: "Besides Axis Bank, Surbhi Possible 3, Rolex road, Kothariya, Rajkot",
        google_maps_url: "https://maps.google.com/?q=22.2379,70.8121",
        upi_id: "burgerbhau@upi",
        upi_name: "Burger Bhau Fast Food",
        qr_code_url: "/BURGER-BHAU-logo.webp",
        opening_hours: "11:00 AM - 11:00 PM",
        delivery_radius_meters: 400,
        min_order_for_delivery: 500,
    });

    const [allProducts, setAllProducts] = useState<MenuItem[]>([]);
    const [productFilterCat, setProductFilterCat] = useState<string>("ALL");
    const [productSearch, setProductSearch] = useState<string>("");

    const todayDateStr = useMemo(() => getTodayIstDateStr(), []);
    const tomorrowDateStr = useMemo(() => getTomorrowIstDateStr(), []);

    const [specialHours, setSpecialHours] = useState<SpecialHoursConfig>({
        enabled: false,
        date: todayDateStr,
        close_time: "02:00",
        open_time: "11:00",
        label: "Special Late Night",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingQr, setUploadingQr] = useState(false);
    const [msg, setMsg] = useState<{ type: "success" | "error"; text: string } | null>(null);

    useEffect(() => {
        async function fetchSettingsAndProducts() {
            setLoading(true);
            try {
                const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
                let initialHighlights: string[] = STORE.highlightedItems;
                let initialSpecialHours: SpecialHoursConfig | null = null;

                try {
                    const localSpecial = localStorage.getItem("bb_admin_special_hours");
                    if (localSpecial) {
                        initialSpecialHours = JSON.parse(localSpecial);
                    }
                } catch {
                    // Ignore localStorage read errors
                }

                try {
                    const local = localStorage.getItem("bb_admin_highlighted_items");
                    if (local) {
                        const parsed = JSON.parse(local);
                        if (Array.isArray(parsed) && parsed.length > 0) {
                            initialHighlights = parsed;
                        }
                    }
                } catch {
                    // Ignore localStorage read errors
                }

                if (data) {
                    if (Array.isArray(data.highlighted_items) && data.highlighted_items.length > 0) {
                        initialHighlights = data.highlighted_items;
                    }
                    if (data.special_hours) {
                        initialSpecialHours = data.special_hours;
                    }
                    setSettings({
                        ...(data as ShopSettings),
                        highlighted_items: initialHighlights,
                    });
                } else {
                    setSettings((prev) => ({
                        ...prev,
                        highlighted_items: initialHighlights,
                    }));
                }

                if (initialSpecialHours) {
                    setSpecialHours({
                        enabled: Boolean(initialSpecialHours.enabled),
                        date: initialSpecialHours.date || todayDateStr,
                        close_time: initialSpecialHours.close_time || "02:00",
                        open_time: initialSpecialHours.open_time || "11:00",
                        label: initialSpecialHours.label || "Special Late Night",
                    });
                }
            } catch (err) {
                console.error("Error loading settings:", err);
            }

            try {
                const prods = await getDynamicMenuItems();
                if (prods && prods.length > 0) {
                    setAllProducts(prods);
                }
            } catch (err) {
                console.error("Error loading products:", err);
            }

            setLoading(false);
        }
        fetchSettingsAndProducts();
    }, []);

    const toggleProductHighlight = (productId: string) => {
        setSettings((prev) => {
            const current = prev.highlighted_items || [];
            const exists = current.includes(productId);
            const updated = exists
                ? current.filter((id) => id !== productId)
                : [...current, productId];
            return { ...prev, highlighted_items: updated };
        });
    };

    const resetToDefaultHighlights = () => {
        setSettings((prev) => ({
            ...prev,
            highlighted_items: [...STORE.highlightedItems],
        }));
    };

    const clearAllHighlights = () => {
        setSettings((prev) => ({
            ...prev,
            highlighted_items: [],
        }));
    };

    const categoriesList = useMemo(() => {
        const set = new Set<string>();
        allProducts.forEach((p) => {
            if (p.category) set.add(p.category);
        });
        return Array.from(set);
    }, [allProducts]);

    const filteredProducts = useMemo(() => {
        return allProducts.filter((p) => {
            const matchesCat = productFilterCat === "ALL" || p.category?.toLowerCase() === productFilterCat.toLowerCase();
            const matchesSearch = !productSearch || p.name?.toLowerCase().includes(productSearch.toLowerCase());
            return matchesCat && matchesSearch;
        });
    }, [allProducts, productFilterCat, productSearch]);

    const activeHighlightedItems = useMemo(() => {
        const ids = settings.highlighted_items || [];
        return ids
            .map((id) => allProducts.find((p) => p.id === id))
            .filter((p): p is MenuItem => Boolean(p));
    }, [settings.highlighted_items, allProducts]);

    const simulations = useMemo(() => {
        if (!specialHours.enabled) return null;
        try {
            const [y, m, d] = specialHours.date.split("-").map(Number);
            // 1:00 PM IST is 07:30 UTC
            const dt1pm = new Date(Date.UTC(y, m - 1, d, 7, 30, 0));
            // 11:30 PM IST is 18:00 UTC
            const dt1130pm = new Date(Date.UTC(y, m - 1, d, 18, 0, 0));
            // 1:00 AM next day IST is 19:30 UTC of day D
            const dt1am = new Date(Date.UTC(y, m - 1, d, 19, 30, 0));
            // 2:05 AM next day IST is 20:35 UTC of day D
            const dt205am = new Date(Date.UTC(y, m - 1, d, 20, 35, 0));

            const sim1pm = getStoreStatus(specialHours, dt1pm);
            const sim1130pm = getStoreStatus(specialHours, dt1130pm);
            const sim1am = getStoreStatus(specialHours, dt1am);
            const sim205am = getStoreStatus(specialHours, dt205am);

            const [closeH, closeM] = specialHours.close_time.split(":").map(Number);
            const [openH, openM] = (specialHours.open_time || "11:00").split(":").map(Number);
            const isCrossMidnight = (closeH * 60 + closeM) < (openH * 60 + openM);

            return {
                sim1pm,
                sim1130pm,
                sim1am,
                sim205am,
                isCrossMidnight,
                formattedClose: formatTime12(closeH, closeM),
            };
        } catch {
            return null;
        }
    }, [specialHours]);

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

        // Always persist to localStorage for instant client synchronization
        if (Array.isArray(settings.highlighted_items)) {
            try {
                localStorage.setItem("bb_admin_highlighted_items", JSON.stringify(settings.highlighted_items));
            } catch {
                // Ignore localStorage save errors
            }
        }

        // Persist special hours to localStorage and broadcast event
        try {
            localStorage.setItem("bb_admin_special_hours", JSON.stringify(specialHours));
            window.dispatchEvent(new CustomEvent("bb_special_hours_updated", { detail: specialHours }));
        } catch {
            // Ignore localStorage errors
        }

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
                highlighted_items: settings.highlighted_items || STORE.highlightedItems,
                special_hours: specialHours,
                updated_at: new Date().toISOString(),
            };

            let { error } = await supabase
                .from("shop_settings")
                .upsert(payload);

            if (error && (
                error.message.includes("highlighted_items") ||
                error.message.includes("hero_image_url") ||
                error.message.includes("additional_phones") ||
                error.message.includes("additional_whatsapps") ||
                error.message.includes("special_hours") ||
                error.message.includes("schema cache")
            )) {
                if (error.message.includes("highlighted_items")) {
                    delete payload.highlighted_items;
                }
                if (error.message.includes("hero_image_url")) {
                    delete payload.hero_image_url;
                }
                if (error.message.includes("special_hours")) {
                    delete payload.special_hours;
                }
                delete payload.additional_phones;
                delete payload.additional_whatsapps;
                const retry = await supabase.from("shop_settings").upsert(payload);
                error = retry.error;
                if (!error) {
                    setMsg({
                        type: "success",
                        text: "Store settings updated! Special hours and landing page selections saved locally. Run the migration SQL in Supabase to sync across all browsers.",
                    });
                    setSaving(false);
                    return;
                }
            }

            if (error) {
                setMsg({ type: "error", text: error.message });
            } else {
                setMsg({ type: "success", text: "Store settings and special hours updated successfully!" });
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

                {/* 🍔 Landing Page Featured Food Products Selection Section */}
                <div className={styles.sectionCard}>
                    <div className={styles.sectionHeader}>
                        <div>
                            <h3 className={styles.sectionTitle}>
                                Landing Page Food Products (&quot;Most Loved&quot;)
                            </h3>
                            <p className={styles.sectionDescription}>
                                Choose which food products appear in the &quot;Most Loved in Kothariya&quot; showcase on the homepage. Customers tap these cards to view details and prices.
                            </p>
                        </div>
                    </div>

                    {/* Selection Counter & Quick Actions Toolbar */}
                    <div className={styles.featuredToolbar}>
                        <div className={styles.featuredStatusGroup}>
                            <span className={styles.featuredCountBadge}>
                                <span className={styles.featuredCountBadgeDot} />
                                {(settings.highlighted_items || []).length} items selected
                            </span>
                            <span className={styles.featuredRecText}>
                                (Recommended: 6 to 10 items for optimal showcase)
                            </span>
                        </div>
                        <div className={styles.featuredActionGroup}>
                            <button
                                type="button"
                                onClick={resetToDefaultHighlights}
                                className={styles.featuredResetBtn}
                            >
                                Reset to Default 8 Items
                            </button>
                            <button
                                type="button"
                                onClick={clearAllHighlights}
                                className={styles.featuredResetBtn}
                            >
                                Clear All
                            </button>
                        </div>
                    </div>

                    {/* Active Selected Strip */}
                    {activeHighlightedItems.length > 0 && (
                        <div className={styles.selectedStrip}>
                            <div className={styles.selectedStripHeader}>
                                <span className={styles.selectedStripTitle}>
                                    Active on Landing Page ({activeHighlightedItems.length})
                                </span>
                                <span className={styles.featuredRecText}>Click ✕ to remove</span>
                            </div>
                            <div className={styles.selectedChipsList}>
                                {activeHighlightedItems.map((item, idx) => (
                                    <div key={item.id} className={styles.selectedChip}>
                                        <span className={styles.selectedChipIndex}>{idx + 1}</span>
                                        <img
                                            src={item.image || "/BURGER-BHAU-logo.webp"}
                                            alt={item.name}
                                            className={styles.selectedChipThumb}
                                        />
                                        <span className={styles.selectedChipName}>{item.name}</span>
                                        <button
                                            type="button"
                                            onClick={() => toggleProductHighlight(item.id)}
                                            className={styles.selectedChipRemove}
                                            aria-label={`Remove ${item.name} from landing page`}
                                        >
                                            ✕
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quick Search */}
                    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center", marginBottom: "10px" }}>
                        <input
                            type="text"
                            value={productSearch}
                            onChange={(e) => setProductSearch(e.target.value)}
                            placeholder="Search menu items by name..."
                            className={styles.featuredSearchInput}
                        />
                    </div>

                    {/* Category Filter Pills */}
                    <div className={styles.categoryBar}>
                        <button
                            type="button"
                            onClick={() => setProductFilterCat("ALL")}
                            className={`${styles.categoryPill} ${productFilterCat === "ALL" ? styles.categoryPillActive : ""}`}
                        >
                            All Items ({allProducts.length})
                        </button>
                        {categoriesList.map((cat) => {
                            const count = allProducts.filter((p) => p.category === cat).length;
                            const isActive = productFilterCat.toLowerCase() === cat.toLowerCase();
                            return (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setProductFilterCat(cat)}
                                    className={`${styles.categoryPill} ${isActive ? styles.categoryPillActive : ""}`}
                                >
                                    {cat} ({count})
                                </button>
                            );
                        })}
                    </div>

                    {/* Product Selection Grid */}
                    <div className={styles.productPickGrid}>
                        {filteredProducts.map((product) => {
                            const currentHighlights = settings.highlighted_items || [];
                            const index = currentHighlights.indexOf(product.id);
                            const isSelected = index !== -1;
                            const priceText = product.variants && product.variants.length > 0
                                ? `₹${Math.min(...product.variants.map((v) => v.price))} - ₹${Math.max(...product.variants.map((v) => v.price))}`
                                : `₹${product.price ?? 0}`;

                            return (
                                <button
                                    key={product.id}
                                    type="button"
                                    onClick={() => toggleProductHighlight(product.id)}
                                    className={`${styles.productPickCard} ${isSelected ? styles.productPickCardSelected : ""}`}
                                    aria-pressed={isSelected}
                                >
                                    <div className={styles.productPickTop}>
                                        <img
                                            src={product.image || "/BURGER-BHAU-logo.webp"}
                                            alt={product.name}
                                            className={styles.productPickThumb}
                                        />
                                        <div className={styles.productPickMeta}>
                                            <span className={styles.productPickCategory}>{product.category}</span>
                                            <span className={styles.productPickName}>{product.name}</span>
                                            <span className={styles.productPickPrice}>{priceText}</span>
                                        </div>
                                    </div>
                                    <div className={styles.productPickFooter}>
                                        {isSelected ? (
                                            <span className={styles.productPickStatusBadge}>
                                                ✓ Position #{index + 1}
                                            </span>
                                        ) : (
                                            <span className={styles.productPickActionLabel}>
                                                + Click to Feature
                                            </span>
                                        )}
                                        <span className={styles.productPickActionLabel}>
                                            {isSelected ? "Featured" : "Hidden"}
                                        </span>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

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

                {/* 🌙 Special Late Night & Extended Hours Section */}
                <div className={styles.specialCard}>
                    <div className={styles.specialHeader}>
                        <div className={styles.specialTitleWrap}>
                            <h3 className={styles.specialTitle}>
                                <span>🌙</span> Special Late Night & Extended Hours
                            </h3>
                            <p className={styles.specialDescription}>
                                Extend closing time for today or specific festival/holiday dates. Cross-midnight closing times (e.g. 2:00 AM) are calculated automatically into the next day, so customer visits at 1:00 AM correctly show the shop as OPEN.
                            </p>
                        </div>
                        <button
                            type="button"
                            onClick={() => setSpecialHours((prev) => ({ ...prev, enabled: !prev.enabled }))}
                            className={`${styles.specialToggle} ${specialHours.enabled ? styles.specialToggleActive : styles.specialToggleInactive}`}
                        >
                            <span>{specialHours.enabled ? "● Active Tonight / Selected Date" : "○ Inactive (Regular Hours)"}</span>
                        </button>
                    </div>

                    {specialHours.enabled && (
                        <>
                            <div className={styles.specialFieldGrid}>
                                {/* Date Selection */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Target Date (Asia/Kolkata)</label>
                                    <input
                                        type="date"
                                        value={specialHours.date}
                                        onChange={(e) => setSpecialHours({ ...specialHours, date: e.target.value })}
                                        className={styles.input}
                                    />
                                    <div className={styles.chipGroup}>
                                        <button
                                            type="button"
                                            onClick={() => setSpecialHours({ ...specialHours, date: todayDateStr })}
                                            className={`${styles.presetChip} ${specialHours.date === todayDateStr ? styles.presetChipActive : ""}`}
                                        >
                                            Today ({todayDateStr})
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => setSpecialHours({ ...specialHours, date: tomorrowDateStr })}
                                            className={`${styles.presetChip} ${specialHours.date === tomorrowDateStr ? styles.presetChipActive : ""}`}
                                        >
                                            Tomorrow ({tomorrowDateStr})
                                        </button>
                                    </div>
                                </div>

                                {/* Extended Closing Time */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Extended Closing Time</label>
                                    <input
                                        type="time"
                                        value={specialHours.close_time}
                                        onChange={(e) => setSpecialHours({ ...specialHours, close_time: e.target.value })}
                                        className={styles.input}
                                    />
                                    <div className={styles.chipGroup}>
                                        {TIME_PRESETS.map((p) => (
                                            <button
                                                key={p.value}
                                                type="button"
                                                onClick={() => setSpecialHours({ ...specialHours, close_time: p.value })}
                                                className={`${styles.presetChip} ${specialHours.close_time === p.value ? styles.presetChipActive : ""}`}
                                            >
                                                {p.label}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                {/* Label / Occasion */}
                                <div className={styles.fieldGroup}>
                                    <label className={styles.label}>Special Occasion / Banner Note</label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Special Late Night"
                                        value={specialHours.label || ""}
                                        onChange={(e) => setSpecialHours({ ...specialHours, label: e.target.value })}
                                        className={styles.input}
                                    />
                                    <div className={styles.chipGroup}>
                                        {OCCASION_PRESETS.map((occ) => (
                                            <button
                                                key={occ}
                                                type="button"
                                                onClick={() => setSpecialHours({ ...specialHours, label: occ })}
                                                className={`${styles.presetChip} ${specialHours.label === occ ? styles.presetChipActive : ""}`}
                                            >
                                                {occ}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* Cross-Midnight Explainer */}
                            {simulations?.isCrossMidnight && (
                                <div className={styles.crossMidnightBanner}>
                                    <span style={{ fontSize: "16px" }} aria-hidden="true">💡</span>
                                    <div>
                                        <strong>Cross-midnight shift detected:</strong> Closing at{" "}
                                        <strong>{simulations.formattedClose}</strong> runs through midnight into tomorrow morning. When customers visit at 1:00 AM, the system calculates that yesterday&apos;s shift is still running, displaying the store as <strong>OPEN</strong>!
                                    </div>
                                </div>
                            )}

                            {/* Live Customer Simulation Preview */}
                            {simulations && (
                                <div className={styles.simulationBox}>
                                    <h4 className={styles.simulationTitle}>
                                        <span>👁️</span> Live Customer View Simulation ({specialHours.date})
                                    </h4>
                                    <div className={styles.simulationGrid}>
                                        <div className={styles.simulationItem}>
                                            <div className={styles.simTimeRow}>
                                                <span className={styles.simTimeLabel}>☀️ Afternoon at 1:00 PM</span>
                                                <span className={simulations.sim1pm.isOpen ? styles.simPillOpen : styles.simPillClosed}>
                                                    {simulations.sim1pm.isOpen ? "OPEN" : "CLOSED"}
                                                </span>
                                            </div>
                                            <span className={styles.simStatusText}>
                                                &ldquo;{simulations.sim1pm.statusText}&rdquo;
                                            </span>
                                        </div>

                                        <div className={styles.simulationItem}>
                                            <div className={styles.simTimeRow}>
                                                <span className={styles.simTimeLabel}>🌙 Night at 11:30 PM</span>
                                                <span className={simulations.sim1130pm.isOpen ? styles.simPillOpen : styles.simPillClosed}>
                                                    {simulations.sim1130pm.isOpen ? "OPEN" : "CLOSED"}
                                                </span>
                                            </div>
                                            <span className={styles.simStatusText}>
                                                &ldquo;{simulations.sim1130pm.statusText}&rdquo;
                                            </span>
                                        </div>

                                        <div className={styles.simulationItem}>
                                            <div className={styles.simTimeRow}>
                                                <span className={styles.simTimeLabel}>🌃 Midnight at 1:00 AM (Next Day)</span>
                                                <span className={simulations.sim1am.isOpen ? styles.simPillOpen : styles.simPillClosed}>
                                                    {simulations.sim1am.isOpen ? "OPEN" : "CLOSED"}
                                                </span>
                                            </div>
                                            <span className={styles.simStatusText}>
                                                &ldquo;{simulations.sim1am.statusText}&rdquo;
                                            </span>
                                        </div>

                                        <div className={styles.simulationItem}>
                                            <div className={styles.simTimeRow}>
                                                <span className={styles.simTimeLabel}>🌅 Morning after close (2:05 AM)</span>
                                                <span className={simulations.sim205am.isOpen ? styles.simPillOpen : styles.simPillClosed}>
                                                    {simulations.sim205am.isOpen ? "OPEN" : "CLOSED"}
                                                </span>
                                            </div>
                                            <span className={styles.simStatusText}>
                                                &ldquo;{simulations.sim205am.statusText}&rdquo;
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                type="button"
                                onClick={() => setSpecialHours((prev) => ({ ...prev, enabled: false }))}
                                className={styles.deactivateBtn}
                            >
                                ✕ Reset to Standard Hours
                            </button>
                        </>
                    )}
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
