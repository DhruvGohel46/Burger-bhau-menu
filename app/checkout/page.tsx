"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCartStore, selectCartTotal } from "@/app/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { buildCallUrl } from "@/app/data/shopConfig";
import { DeliveryMethod, ShopSettings } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faStore,
    faMotorcycle,
    faHeadset,
    faPhone,
    faQrcode,
    faCheckCircle,
    faExclamationTriangle,
    faMapMarkerAlt,
    faClock,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function CheckoutPage() {
    const router = useRouter();

    const { cartItems, clearCart } = useCartStore();
    const cartTotal = useCartStore(selectCartTotal);
    const { user, profile, isLoading, fetchProfile } = useAuthStore();

    // Step state: 1 = Details & Delivery, 2 = Payment & UTR
    const [step, setStep] = useState<1 | 2>(1);

    // Profile & Structured Address Fields
    const [name, setName] = useState("");
    const [phone, setPhone] = useState("");
    const [houseFlat, setHouseFlat] = useState("");
    const [area, setArea] = useState("");
    const [landmark, setLandmark] = useState("");
    const [city, setCity] = useState("Rajkot");
    const [pincode, setPincode] = useState("360004");

    // Checkout selections
    const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("pickup");
    const [utr, setUtr] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // Dynamic Shop Settings
    const [settings, setSettings] = useState<ShopSettings>({
        id: 1,
        shop_name: "Burger Bhau (Kothariya)",
        restaurant_name: "Burger Bhau (Kothariya)",
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

    useEffect(() => {
        async function loadSettings() {
            try {
                const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
                if (data) {
                    setSettings(data as ShopSettings);
                }
            } catch (err) {
                // Keep defaults
            }
        }
        loadSettings();
    }, []);

    useEffect(() => {
        if (profile) {
            if (profile.name) setName(profile.name);
            if (profile.phone) setPhone(profile.phone);
            setHouseFlat(profile.house_flat || profile.address || "");
            setArea(profile.area || "");
            setLandmark(profile.landmark || "");
            setCity(profile.city || "Rajkot");
            setPincode(profile.pincode || "360004");
        }
    }, [profile]);

    if (isLoading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading checkout...</p>
            </div>
        );
    }

    if (!user) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#0f0f0f",
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
                    backgroundColor: "#1a1a1a",
                    border: "1px solid #333",
                    borderRadius: "16px",
                    padding: "32px 24px",
                    textAlign: "center",
                }}>
                    <h2 style={{ fontSize: "22px", fontWeight: "700", marginBottom: "12px", color: "#ff8c00" }}>
                        Login Required to Checkout
                    </h2>
                    <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "24px" }}>
                        Please log in or create an account to complete your order.
                    </p>
                    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                        <Link href="/login" style={{ padding: "14px", backgroundColor: "#ff8c00", color: "#000", borderRadius: "8px", fontWeight: "700", textDecoration: "none" }}>
                            Sign In
                        </Link>
                        <Link href="/register" style={{ padding: "14px", backgroundColor: "#262626", border: "1px solid #444", color: "#fff", borderRadius: "8px", fontWeight: "600", textDecoration: "none" }}>
                            Create New Account
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    if (cartItems.length === 0) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#0f0f0f",
                color: "#fff",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "var(--font-jakarta), sans-serif",
            }}>
                <div style={{ textAlign: "center" }}>
                    <h2 style={{ fontSize: "24px", fontWeight: "700", marginBottom: "8px" }}>Your Cart is Empty</h2>
                    <p style={{ color: "#aaa", marginBottom: "20px" }}>Add items from our menu before proceeding to checkout.</p>
                    <Link href="/" style={{ padding: "12px 24px", backgroundColor: "#ff8c00", color: "#000", borderRadius: "8px", fontWeight: "700", textDecoration: "none" }}>
                        Browse Menu
                    </Link>
                </div>
            </div>
        );
    }

    const fullAddress = `${houseFlat}, ${area}, ${landmark ? landmark + ", " : ""}${city} - ${pincode}`;

    const handleNextStep = (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!name.trim() || !phone.trim() || !houseFlat.trim() || !area.trim()) {
            setErrorMsg("Please fill out your Name, Phone Number, and Address fields.");
            return;
        }

        // Save profile address to Supabase
        supabase.from("profiles").upsert({
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
            updated_at: new Date().toISOString(),
        });
        fetchProfile(user.id, user.email);

        setStep(2);
    };

    const handlePlaceOrder = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg("");

        if (!utr.trim()) {
            setErrorMsg("Transaction ID (UTR) is required to verify your payment.");
            return;
        }

        setSubmitting(true);

        try {
            // Create order record with ENUMs and structured address
            const { data: orderData, error: orderError } = await supabase
                .from("orders")
                .insert({
                    customer_id: user.id,
                    customer_name: name,
                    customer_phone: phone,
                    customer_address: fullAddress,
                    house_flat: houseFlat,
                    area,
                    landmark,
                    city,
                    pincode,
                    delivery_method: deliveryMethod,
                    payment_status: "Pending",
                    status: "Pending Payment Verification",
                    utr: utr.trim(),
                    subtotal: cartTotal,
                    delivery_charge: 0,
                    total: cartTotal,
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString(),
                })
                .select("*")
                .single();

            if (orderError || !orderData) {
                setErrorMsg(orderError?.message || "Failed to create order. Please try again.");
                setSubmitting(false);
                return;
            }

            // Create order items
            const itemsToInsert = cartItems.map((item) => ({
                order_id: orderData.id,
                product_id: item.itemId,
                name: item.name,
                quantity: item.quantity,
                price: item.price,
                variant_label: item.variantLabel || "",
                extras: item.extras || [],
            }));

            await supabase.from("order_items").insert(itemsToInsert);

            clearCart();
            router.push(`/orders/${orderData.id}`);
        } catch (err: any) {
            setErrorMsg(err?.message || "An unexpected error occurred during checkout.");
            setSubmitting(false);
        }
    };

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f0f0f",
            color: "#fff",
            padding: "20px 16px 40px 16px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>

                {/* Back / Title Bar */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <button
                        onClick={() => {
                            if (step === 2) setStep(1);
                            else router.push("/");
                        }}
                        style={{ background: "none", border: "none", color: "#ff8c00", fontSize: "18px", cursor: "pointer", padding: "8px" }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </button>
                    <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff", margin: 0 }}>
                        Checkout ({step === 1 ? "Step 1 of 2: Details" : "Step 2 of 2: Payment"})
                    </h1>
                </div>

                {errorMsg && (
                    <div style={{ backgroundColor: "rgba(255, 68, 68, 0.2)", border: "1px solid #ff4444", color: "#ff6b6b", padding: "12px 16px", borderRadius: "10px", fontSize: "14px", marginBottom: "20px" }}>
                        {errorMsg}
                    </div>
                )}

                {/* STEP 1: Details & Delivery Method */}
                {step === 1 && (
                    <form onSubmit={handleNextStep}>
                        {/* Order Summary Box */}
                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "14px", padding: "18px", marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "12px", color: "#ff8c00" }}>
                                Order Summary ({cartItems.length} items)
                            </h3>
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "12px" }}>
                                {cartItems.map((item) => (
                                    <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#ddd" }}>
                                        <span>{item.quantity}x {item.name} {item.variantLabel ? `(${item.variantLabel})` : ""}</span>
                                        <span>₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>
                            <div style={{ borderTop: "1px solid #333", paddingTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "700", fontSize: "16px", color: "#fff" }}>
                                <span>Total Payable</span>
                                <span style={{ color: "#ff8c00" }}>₹{cartTotal}</span>
                            </div>
                        </div>

                        {/* Structured Address */}
                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "14px", padding: "18px", marginBottom: "20px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px", color: "#ff8c00" }}>
                                Delivery Details
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>Full Name *</label>
                                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Alex XXXX" style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>Phone Number *</label>
                                    <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="e.g. +91 98XXX XXXXX" style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>House / Flat / Bldg No. *</label>
                                    <input type="text" required value={houseFlat} onChange={(e) => setHouseFlat(e.target.value)} placeholder="e.g. Flat 2XX" style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                                </div>

                                <div>
                                    <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>Area / Society / Road *</label>
                                    <input type="text" required value={area} onChange={(e) => setArea(e.target.value)} placeholder="e.g. Street XX, Area XX" style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "14px" }} />
                                </div>

                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>Landmark</label>
                                        <input type="text" value={landmark} onChange={(e) => setLandmark(e.target.value)} placeholder="e.g. Near Landmark XX" style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "13px" }} />
                                    </div>
                                    <div>
                                        <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#aaa", marginBottom: "4px" }}>Pincode</label>
                                        <input type="text" required value={pincode} onChange={(e) => setPincode(e.target.value)} style={{ width: "100%", padding: "10px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "8px", color: "#fff", fontSize: "13px" }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Method Options */}
                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "14px", padding: "18px", marginBottom: "24px" }}>
                            <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px", color: "#ff8c00" }}>
                                How would you like to receive your order?
                            </h3>

                            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                                <div onClick={() => setDeliveryMethod("pickup")} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px", backgroundColor: deliveryMethod === "pickup" ? "rgba(255, 140, 0, 0.12)" : "#262626", border: `2px solid ${deliveryMethod === "pickup" ? "#ff8c00" : "#333"}`, borderRadius: "10px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faStore} style={{ fontSize: "20px", color: "#ff8c00", marginTop: "2px" }} />
                                    <div>
                                        <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "0 0 4px 0" }}>Self Pickup</h4>
                                        <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>Collect directly from Burger Bhau counter.</p>
                                    </div>
                                </div>

                                <div onClick={() => setDeliveryMethod("rapido")} style={{ display: "flex", alignItems: "flex-start", gap: "14px", padding: "14px", backgroundColor: deliveryMethod === "rapido" ? "rgba(255, 140, 0, 0.12)" : "#262626", border: `2px solid ${deliveryMethod === "rapido" ? "#ff8c00" : "#333"}`, borderRadius: "10px", cursor: "pointer" }}>
                                    <FontAwesomeIcon icon={faMotorcycle} style={{ fontSize: "20px", color: "#ff8c00", marginTop: "2px" }} />
                                    <div>
                                        <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "0 0 4px 0" }}>Rapido Parcel</h4>
                                        <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>Arrange your Rapido rider after status updates to READY FOR PICKUP.</p>
                                    </div>
                                </div>

                                <div onClick={() => setDeliveryMethod("contact")} style={{ display: "flex", flexDirection: "column", gap: "8px", padding: "14px", backgroundColor: deliveryMethod === "contact" ? "rgba(255, 140, 0, 0.12)" : "#262626", border: `2px solid ${deliveryMethod === "contact" ? "#ff8c00" : "#333"}`, borderRadius: "10px", cursor: "pointer" }}>
                                    <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                                        <FontAwesomeIcon icon={faHeadset} style={{ fontSize: "20px", color: "#ff8c00", marginTop: "2px" }} />
                                        <div>
                                            <h4 style={{ fontSize: "15px", fontWeight: "700", color: "#fff", margin: "0 0 4px 0" }}>Contact Store Directly</h4>
                                            <p style={{ fontSize: "13px", color: "#aaa", margin: 0 }}>Reach our team on any of our call or WhatsApp lines for custom delivery assistance.</p>
                                        </div>
                                    </div>

                                    {deliveryMethod === "contact" && (
                                        <div style={{ marginTop: "8px", paddingTop: "10px", borderTop: "1px solid rgba(255,140,0,0.2)", display: "flex", flexDirection: "column", gap: "6px" }}>
                                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#ff8c00" }}>📞 Call Lines:</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {[settings.shop_phone, ...(settings.additional_phones || [])].filter(Boolean).map((num, i) => (
                                                    <a key={i} href={buildCallUrl(num)} onClick={(e) => e.stopPropagation()} style={{ padding: "4px 10px", backgroundColor: "#1e1e1e", border: "1px solid #444", borderRadius: "6px", color: "#fff", textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>
                                                        +{num}
                                                    </a>
                                                ))}
                                            </div>

                                            <div style={{ fontSize: "12px", fontWeight: "700", color: "#25d366", marginTop: "4px" }}>💬 WhatsApp Lines:</div>
                                            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                                                {[settings.whatsapp_number, ...(settings.additional_whatsapps || [])].filter(Boolean).map((num, i) => (
                                                    <a key={i} href={`https://wa.me/${num.replace(/[^0-9]/g, "")}`} target="_blank" rel="noopener noreferrer" onClick={(e) => e.stopPropagation()} style={{ padding: "4px 10px", backgroundColor: "rgba(37, 211, 102, 0.15)", border: "1px solid #25d366", borderRadius: "6px", color: "#25d366", textDecoration: "none", fontSize: "12px", fontWeight: "600" }}>
                                                        +{num}
                                                    </a>
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button type="submit" style={{ width: "100%", padding: "16px", backgroundColor: "#ff8c00", color: "#000", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: "pointer" }}>
                            Proceed to Payment →
                        </button>
                    </form>
                )}

                {/* STEP 2: Payment & UTR */}
                {step === 2 && (
                    <form onSubmit={handlePlaceOrder}>
                        {deliveryMethod === "rapido" && (
                            <div style={{ backgroundColor: "rgba(255, 193, 7, 0.15)", border: "1px solid #ffc107", borderRadius: "12px", padding: "14px", marginBottom: "20px", display: "flex", gap: "12px", alignItems: "flex-start" }}>
                                <FontAwesomeIcon icon={faExclamationTriangle} style={{ color: "#ffc107", fontSize: "18px", marginTop: "2px" }} />
                                <p style={{ fontSize: "13px", color: "#ffe082", margin: 0, lineHeight: "1.4" }}>
                                    <strong>Important for Rapido Delivery:</strong> Please wait until Burger Bhau confirms that your order status is <strong>READY FOR PICKUP</strong> before booking your Rapido Parcel rider.
                                </p>
                            </div>
                        )}

                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "14px", padding: "20px", marginBottom: "20px", textAlign: "center" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#ff8c00", marginBottom: "8px" }}>
                                Scan & Pay via UPI
                            </h3>

                            <div style={{ display: "inline-block", padding: "12px", backgroundColor: "#fff", borderRadius: "12px", marginBottom: "16px" }}>
                                <img src={settings.qr_code_url} alt="UPI QR Code" style={{ width: "180px", height: "180px", objectFit: "contain" }} />
                            </div>

                            <div style={{ backgroundColor: "#262626", borderRadius: "10px", padding: "12px", display: "flex", flexDirection: "column", gap: "6px" }}>
                                <div style={{ fontSize: "13px", color: "#aaa" }}>Account Name: <strong style={{ color: "#fff" }}>{settings.upi_name || settings.shop_name}</strong></div>
                                <div style={{ fontSize: "14px", color: "#ff8c00", fontWeight: "700" }}>UPI ID: {settings.upi_id}</div>
                                <div style={{ fontSize: "18px", fontWeight: "800", color: "#fff", marginTop: "4px" }}>Amount to Pay: ₹{cartTotal}</div>
                            </div>
                        </div>

                        <div style={{ backgroundColor: "#1a1a1a", border: "1px solid #333", borderRadius: "14px", padding: "20px", marginBottom: "20px" }}>
                            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "6px" }}>
                                Enter Transaction ID (UTR / Ref No.) *
                            </label>
                            <input
                                type="text"
                                required
                                placeholder="e.g. 4231XXXX5432"
                                value={utr}
                                onChange={(e) => setUtr(e.target.value)}
                                style={{ width: "100%", padding: "14px", backgroundColor: "#262626", border: "1px solid #555", borderRadius: "10px", color: "#fff", fontSize: "16px", fontWeight: "600", outline: "none" }}
                            />
                        </div>

                        <button type="submit" disabled={submitting} style={{ width: "100%", padding: "16px", backgroundColor: "#ff8c00", color: "#000", border: "none", borderRadius: "12px", fontSize: "16px", fontWeight: "800", cursor: submitting ? "not-allowed" : "pointer", opacity: submitting ? 0.7 : 1 }}>
                            {submitting ? "Creating Order..." : "Confirm & Submit Order"}
                        </button>
                    </form>
                )}

            </div>
        </div>
    );
}
