"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Order, OrderStatus } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faCheckCircle,
    faClock,
    faUtensils,
    faStore,
    faMotorcycle,
    faPhone,
    faExclamationTriangle,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

const STATUS_STEPS: { status: OrderStatus; label: string; timeKey?: keyof Order }[] = [
    { status: "Pending Payment Verification", label: "Order Received & UTR Submitted", timeKey: "created_at" },
    { status: "Payment Verified", label: "Payment Verified by Cashier", timeKey: "payment_verified_at" },
    { status: "Accepted", label: "Order Accepted by Kitchen", timeKey: "accepted_at" },
    { status: "Preparing", label: "Preparing Fresh Food", timeKey: "preparing_at" },
    { status: "Ready For Pickup", label: "Ready For Pickup / Delivery", timeKey: "ready_at" },
    { status: "Delivered", label: "Order Completed" },
];

export default function OrderTrackingClient({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const router = useRouter();
    const { user, isLoading: authLoading } = useAuthStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [shopPhone, setShopPhone] = useState("919558941555");
    const [whatsappNum, setWhatsappNum] = useState("919558941555");

    useEffect(() => {
        async function fetchSettings() {
            try {
                const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
                if (data) {
                    if (data.shop_phone) setShopPhone(data.shop_phone);
                    if (data.whatsapp_number) setWhatsappNum(data.whatsapp_number);
                }
            } catch (err) {}
        }
        fetchSettings();
    }, []);

    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login");
            return;
        }

        async function fetchOrder() {
            setLoading(true);
            const { data, error: err } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .eq("id", id)
                .single();

            if (err || !data) {
                setError("Order not found or permission denied.");
            } else {
                setOrder(data as Order);
            }
            setLoading(false);
        }

        if (id) {
            fetchOrder();
        }

        // Subscribe to Supabase Realtime updates on this order
        const channel = supabase
            .channel(`order-tracking-${id}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${id}`,
                },
                (payload) => {
                    if (payload.new) {
                        setOrder((prev) => (prev ? { ...prev, ...(payload.new as Order) } : null));
                    }
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [id, user, authLoading, router]);

    if (loading || authLoading) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#F0E8C7", color: "#060504", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading order status...</p>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#F0E8C7", color: "#060504", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                <h2 style={{ fontSize: "20px", color: "#ff4444", marginBottom: "12px" }}>{error || "Order Not Found"}</h2>
                <Link href="/orders" style={{ padding: "10px 20px", backgroundColor: "#CF4B13", color: "#fff", borderRadius: "8px", fontWeight: "700", textDecoration: "none" }}>
                    Back to My Orders
                </Link>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);

    const cleanWhatsappNum = whatsappNum.replace(/[^0-9]/g, "");
    const cleanShopPhone = shopPhone.replace(/[^0-9]/g, "");
    const confirmMessage = `Hi Burger Bhau! I have placed Order #${order.order_number || order.id.slice(0, 8)} (Total: ₹${order.total}) with UTR: ${order.utr}. Please confirm and start preparing my order!`;
    const whatsappConfirmUrl = `https://wa.me/${cleanWhatsappNum}?text=${encodeURIComponent(confirmMessage)}`;

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#F0E8C7",
            color: "#060504",
            padding: "20px 16px 40px 16px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{ maxWidth: "640px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
                    <Link href="/orders" style={{ color: "#CF4B13", fontSize: "18px" }}>
                        <FontAwesomeIcon icon={faArrowLeft} />
                    </Link>
                    <div>
                        <h1 style={{ fontSize: "22px", fontWeight: "800", margin: 0, color: "#060504" }}>
                            Order Tracker
                        </h1>
                        <span style={{ fontSize: "14px", color: "#CF4B13", fontWeight: "700" }}>
                            Order #{order.order_number || order.id.slice(0, 8)} • Realtime Sync
                        </span>
                    </div>
                </div>

                {/* Urgent Customer Contact Banner to Confirm Order after Payment */}
                {(order.status === "Pending Payment Verification" || order.payment_status === "Pending") && (
                    <div style={{
                        backgroundColor: "rgba(207, 75, 19, 0.15)",
                        border: "2px solid #CF4B13",
                        borderRadius: "16px",
                        padding: "20px",
                        marginBottom: "20px",
                        boxShadow: "0 8px 24px rgba(207, 75, 19, 0.25)",
                    }}>
                        <div style={{ display: "flex", alignItems: "flex-start", gap: "14px" }}>
                            <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "32px", color: "#25d366", marginTop: "2px" }} />
                            <div style={{ flex: 1 }}>
                                <h3 style={{ fontSize: "17px", fontWeight: "800", color: "#fff", margin: "0 0 6px 0" }}>
                                    Please Contact Us to Confirm Your Order!
                                </h3>
                                <p style={{ fontSize: "13px", color: "#ddd", margin: "0 0 14px 0", lineHeight: "1.5" }}>
                                    Your order with Transaction UTR <strong style={{ color: "#ff8c00" }}>{order.utr}</strong> has been submitted. Please send a quick message on WhatsApp or call our cashier to fast-track your order verification and kitchen preparation.
                                </p>

                                <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
                                    <a
                                        href={whatsappConfirmUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: "12px 18px",
                                            backgroundColor: "#25d366",
                                            color: "#000",
                                            borderRadius: "10px",
                                            fontWeight: "800",
                                            fontSize: "14px",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            boxShadow: "0 4px 12px rgba(37, 211, 102, 0.35)",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "18px" }} />
                                        Confirm Order on WhatsApp
                                    </a>

                                    <a
                                        href={`tel:+${cleanShopPhone}`}
                                        style={{
                                            padding: "12px 18px",
                                            backgroundColor: "#262626",
                                            border: "1px solid #ff8c00",
                                            color: "#ff8c00",
                                            borderRadius: "10px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            textDecoration: "none",
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPhone} />
                                        Call Store
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Rapido Rider Notice Banner */}
                {order.delivery_method === "rapido" && (
                    <div style={{
                        backgroundColor: order.status === "Ready For Pickup" ? "rgba(40, 167, 69, 0.2)" : "rgba(255, 140, 0, 0.15)",
                        border: `1px solid ${order.status === "Ready For Pickup" ? "#28a745" : "#ff8c00"}`,
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "20px",
                        display: "flex",
                        gap: "14px",
                        alignItems: "center",
                    }}>
                        <FontAwesomeIcon icon={faMotorcycle} style={{ fontSize: "24px", color: order.status === "Ready For Pickup" ? "#28a745" : "#ff8c00" }} />
                        <div>
                            <h4 style={{ fontSize: "15px", fontWeight: "700", margin: "0 0 4px 0", color: "#fff" }}>
                                {order.status === "Ready For Pickup" ? "Food is Ready! Book Rapido Rider Now" : "Rapido Delivery Selected"}
                            </h4>
                            <p style={{ fontSize: "13px", color: "#ddd", margin: 0, lineHeight: "1.4" }}>
                                {order.status === "Ready For Pickup"
                                    ? "Your order is prepared and ready! You can book your Rapido Parcel rider to collect from Burger Bhau now."
                                    : "Please wait until status updates to READY FOR PICKUP before booking your Rapido Parcel rider."}
                            </p>
                        </div>
                    </div>
                )}

                {/* Cancelled Banner if cancelled */}
                {order.status === "Cancelled" && (
                    <div style={{
                        backgroundColor: "rgba(255, 68, 68, 0.2)",
                        border: "1px solid #ff4444",
                        borderRadius: "12px",
                        padding: "16px",
                        marginBottom: "20px",
                        color: "#ff6b6b",
                        fontSize: "14px",
                        fontWeight: "600",
                    }}>
                        ❌ This order was cancelled. {order.cancelled_at && `Time: ${new Date(order.cancelled_at).toLocaleTimeString()}`}
                    </div>
                )}

                {/* Live Status Tracker Stepper with Timestamps */}
                {order.status !== "Cancelled" && (
                    <div style={{
                        backgroundColor: "rgba(18, 14, 10, 0.76)",
                        backdropFilter: "blur(20px) saturate(180%)",
                        WebkitBackdropFilter: "blur(20px) saturate(180%)",
                        border: "1px solid rgba(255, 255, 255, 0.12)",
                        borderRadius: "16px",
                        padding: "24px 20px",
                        marginBottom: "20px",
                        boxShadow: "0 12px 40px rgba(6, 5, 4, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                    }}>
                        <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "20px", color: "#CF4B13" }}>
                            Live Order Timeline
                        </h3>

                        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                            {STATUS_STEPS.map((step, idx) => {
                                const isDone = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                const timeVal = step.timeKey && order[step.timeKey] ? new Date(order[step.timeKey] as string).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) : null;

                                return (
                                    <div key={step.status} style={{ display: "flex", alignItems: "flex-start", gap: "16px" }}>
                                        <div style={{
                                            width: "32px",
                                            height: "32px",
                                            borderRadius: "50%",
                                            backgroundColor: isDone ? "#CF4B13" : "rgba(255, 255, 255, 0.10)",
                                            color: isDone ? "#fff" : "#666",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            border: isCurrent ? "2px solid #fff" : "none",
                                            boxShadow: isCurrent ? "0 0 12px rgba(207, 75, 19, 0.6)" : "none",
                                            flexShrink: 0,
                                        }}>
                                            {isDone ? <FontAwesomeIcon icon={faCheckCircle} /> : idx + 1}
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: "15px",
                                                fontWeight: isCurrent ? "800" : isDone ? "600" : "400",
                                                color: isDone ? "#fff" : "#777",
                                                display: "flex",
                                                justifyContent: "space-between",
                                            }}>
                                                <span>{step.label}</span>
                                                {timeVal && <span style={{ fontSize: "12px", color: "#CF4B13" }}>{timeVal}</span>}
                                            </div>
                                            {isCurrent && (
                                                <div style={{ fontSize: "12px", color: "#CF4B13", marginTop: "2px" }}>
                                                    • Active Step
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Payment & Order Details */}
                <div style={{
                    backgroundColor: "rgba(18, 14, 10, 0.76)",
                    backdropFilter: "blur(20px) saturate(180%)",
                    WebkitBackdropFilter: "blur(20px) saturate(180%)",
                    border: "1px solid rgba(255, 255, 255, 0.12)",
                    borderRadius: "16px",
                    padding: "20px",
                    marginBottom: "20px",
                    boxShadow: "0 12px 40px rgba(6, 5, 4, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.12)",
                }}>
                    <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "14px", color: "#CF4B13" }}>
                        Payment & Order Summary
                    </h3>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", fontSize: "14px", color: "#ddd" }}>
                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Payment Status:</span>
                            <span style={{ fontWeight: "700", color: order.payment_status === "Approved" ? "#28a745" : order.payment_status === "Rejected" ? "#ff4444" : "#ffc107" }}>
                                {order.payment_status}
                            </span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Transaction UTR:</span>
                            <span style={{ fontFamily: "monospace", color: "#fff", fontWeight: "600" }}>{order.utr}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Delivery Method:</span>
                            <span style={{ textTransform: "capitalize", fontWeight: "600", color: "#CF4B13" }}>{order.delivery_method}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Customer Name:</span>
                            <span>{order.customer_name}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Phone:</span>
                            <span>{order.customer_phone}</span>
                        </div>

                        <div style={{ display: "flex", justifyContent: "space-between" }}>
                            <span style={{ color: "#aaa" }}>Address:</span>
                            <span style={{ maxWidth: "240px", textAlign: "right" }}>{order.customer_address}</span>
                        </div>
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "14px", paddingTop: "12px" }}>
                        <h4 style={{ fontSize: "14px", fontWeight: "700", marginBottom: "8px", color: "#aaa" }}>Items Ordered:</h4>
                        {order.order_items && order.order_items.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
                                <span>{item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}</span>
                                <span>₹{item.price * item.quantity}</span>
                            </div>
                        ))}
                    </div>

                    <div style={{ borderTop: "1px solid rgba(255,255,255,0.12)", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "800", color: "#fff" }}>
                        <span>Total Paid / Payable</span>
                        <span style={{ color: "#CF4B13" }}>₹{order.total}</span>
                    </div>
                </div>

                {/* Contact Actions */}
                <div style={{ display: "flex", gap: "12px" }}>
                    <a href={`tel:+${cleanShopPhone}`} style={{ flex: 1, padding: "14px", backgroundColor: "#262626", border: "1px solid #444", borderRadius: "12px", color: "#fff", textAlign: "center", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                        <FontAwesomeIcon icon={faPhone} style={{ color: "#ff8c00", marginRight: "8px" }} /> Call Shop
                    </a>
                    <a href={whatsappConfirmUrl} target="_blank" rel="noreferrer" style={{ flex: 1, padding: "14px", backgroundColor: "rgba(37, 211, 102, 0.15)", border: "1px solid #25d366", borderRadius: "12px", color: "#25d366", textAlign: "center", textDecoration: "none", fontSize: "14px", fontWeight: "700" }}>
                        <FontAwesomeIcon icon={faWhatsapp} style={{ marginRight: "8px" }} /> WhatsApp Confirm
                    </a>
                </div>

            </div>
        </div>
    );
}
