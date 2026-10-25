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
    faStore,
    faMotorcycle,
    faPhone,
    faCopy,
    faCheck,
    faLocationDot,
    faFireBurner,
    faBagShopping,
    faReceipt,
    faCircleDot,
    faExclamationTriangle,
    faSync,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

interface StepItem {
    status: OrderStatus;
    title: string;
    description: string;
    timeKey?: keyof Order;
    icon: any;
}

const STATUS_STEPS: StepItem[] = [
    {
        status: "Pending Payment Verification",
        title: "Order Placed & UTR Submitted",
        description: "Your payment reference is under verification by our counter team.",
        timeKey: "created_at",
        icon: faClock,
    },
    {
        status: "Accepted",
        title: "Order Accepted by Kitchen",
        description: "Payment confirmed! Our chefs have queued your order for preparation.",
        timeKey: "accepted_at",
        icon: faCheckCircle,
    },
    {
        status: "Preparing",
        title: "Cooking Hot & Fresh",
        description: "Burgers, sides & beverages are sizzling fresh right now.",
        timeKey: "preparing_at",
        icon: faFireBurner,
    },
    {
        status: "Ready For Pickup",
        title: "Ready for Collection / Delivery",
        description: "Packed hot and waiting at our counter or for your courier.",
        timeKey: "ready_at",
        icon: faBagShopping,
    },
    {
        status: "Delivered",
        title: "Order Completed",
        description: "Delivered & enjoyed! Thank you for ordering from Burger Bhau.",
        icon: faCheckCircle,
    },
];

export default function OrderTrackingClient({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = use(params);
    const paramId = resolvedParams?.id || "";

    const [orderId, setOrderId] = useState<string>(() => {
        if (typeof window !== "undefined") {
            const parts = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
            if (parts.length >= 2 && parts[0] === "orders" && parts[1] !== "placeholder") {
                return parts[1];
            }
            const queryId = new URLSearchParams(window.location.search).get("id");
            if (queryId) return queryId;
        }
        return paramId && paramId !== "placeholder" ? paramId : "";
    });

    const router = useRouter();
    const { user, isLoading: authLoading } = useAuthStore();

    const [order, setOrder] = useState<Order | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [shopPhone, setShopPhone] = useState("919558941555");
    const [whatsappNum, setWhatsappNum] = useState("919558941555");
    const [copiedUtr, setCopiedUtr] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);

    const fetchOrder = async (showSpinner = false) => {
        if (!orderId) {
            if (showSpinner) setLoading(false);
            setError("Order not found. No valid order ID was provided.");
            return;
        }

        if (showSpinner) setLoading(true);
        else setIsRefreshing(true);

        try {
            const { data, error: err } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .eq("id", orderId)
                .single();

            if (err || !data) {
                if (showSpinner) setError("Order not found or permission denied.");
            } else {
                setOrder(data as Order);
                if (showSpinner) setError("");
            }
        } catch (e) {
            console.error("Order fetch error:", e);
        } finally {
            if (showSpinner) setLoading(false);
            else setTimeout(() => setIsRefreshing(false), 600);
        }
    };

    useEffect(() => {
        if (typeof window !== "undefined") {
            const parts = window.location.pathname.replace(/^\/|\/$/g, "").split("/");
            if (parts.length >= 2 && parts[0] === "orders" && parts[1] !== "placeholder") {
                setOrderId(parts[1]);
                return;
            }
            const queryId = new URLSearchParams(window.location.search).get("id");
            if (queryId) {
                setOrderId(queryId);
                return;
            }
        }
        if (paramId && paramId !== "placeholder") {
            setOrderId(paramId);
        }
    }, [paramId]);

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

        if (!orderId) {
            if (!authLoading) setLoading(false);
            return;
        }

        // 1. Initial fetch with loading spinner
        fetchOrder(true);

        // 2. Auto-refresh order status every 15 seconds in the background
        const refreshInterval = setInterval(() => {
            fetchOrder(false);
        }, 15000);

        // 3. Auto-refresh immediately when user refocuses browser tab
        const onWindowFocus = () => {
            fetchOrder(false);
        };
        window.addEventListener("focus", onWindowFocus);

        // 4. Realtime subscription for instant kitchen push updates
        const channel = supabase
            .channel(`order-tracking-${orderId}`)
            .on(
                "postgres_changes",
                {
                    event: "UPDATE",
                    schema: "public",
                    table: "orders",
                    filter: `id=eq.${orderId}`,
                },
                (payload) => {
                    if (payload.new) {
                        setOrder((prev) => (prev ? { ...prev, ...(payload.new as Order) } : null));
                    }
                }
            )
            .subscribe();

        return () => {
            clearInterval(refreshInterval);
            window.removeEventListener("focus", onWindowFocus);
            supabase.removeChannel(channel);
        };
    }, [orderId, user, authLoading, router]);

    const handleCopyUtr = (utrValue: string) => {
        if (!utrValue) return;
        navigator.clipboard.writeText(utrValue);
        setCopiedUtr(true);
        setTimeout(() => setCopiedUtr(false), 2000);
    };

    if (loading || authLoading) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#0c0a09",
                color: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "20px",
                fontFamily: "var(--font-jakarta), sans-serif",
            }}>
                <div style={{
                    width: "48px",
                    height: "48px",
                    borderRadius: "50%",
                    border: "3px solid rgba(255, 140, 0, 0.2)",
                    borderTopColor: "#ff8c00",
                    animation: "spin 0.8s linear infinite",
                    marginBottom: "16px",
                }} />
                <p style={{ fontSize: "16px", fontWeight: "600", color: "#a8a29e" }}>
                    Loading your live order status...
                </p>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#0c0a09",
                color: "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                padding: "24px",
                fontFamily: "var(--font-jakarta), sans-serif",
                textAlign: "center",
            }}>
                <div style={{
                    width: "64px",
                    height: "64px",
                    borderRadius: "50%",
                    backgroundColor: "rgba(239, 68, 68, 0.15)",
                    border: "1px solid rgba(239, 68, 68, 0.3)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    marginBottom: "18px",
                    color: "#ef4444",
                    fontSize: "26px",
                }}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>
                    {error || "Order Not Found"}
                </h2>
                <p style={{ fontSize: "14px", color: "#a8a29e", marginBottom: "24px", maxWidth: "380px" }}>
                    We could not find the order details. It may still be syncing or belong to another account.
                </p>
                <Link
                    href="/orders/"
                    style={{
                        padding: "14px 28px",
                        backgroundColor: "#ff8c00",
                        color: "#0c0a09",
                        borderRadius: "12px",
                        fontWeight: "800",
                        textDecoration: "none",
                        fontSize: "15px",
                        boxShadow: "0 6px 20px rgba(255, 140, 0, 0.35)",
                    }}
                >
                    View My Orders
                </Link>
            </div>
        );
    }

    const currentStepIndex = STATUS_STEPS.findIndex((s) => s.status === order.status);
    const cleanWhatsappNum = whatsappNum.replace(/[^0-9]/g, "");
    const cleanShopPhone = shopPhone.replace(/[^0-9]/g, "");

    const itemsSummary = (order.order_items || [])
        .map((i) => `${i.quantity}x ${i.name}${i.variant_label ? ` (${i.variant_label})` : ""}`)
        .join(", ");

    const confirmMessage = `Hi Burger Bhau! 👋 I have placed Order #${order.order_number || order.id.slice(0, 6)}.\n\n📦 Items: ${itemsSummary || "Burger Order"}\n💰 Total: ₹${order.total}\n💳 Payment UTR: ${order.utr}\n🛵 Delivery Method: ${order.delivery_method ? order.delivery_method.toUpperCase() : "PICKUP"}\n\nPlease confirm my order and start kitchen preparation!`;
    const whatsappConfirmUrl = `https://wa.me/${cleanWhatsappNum}?text=${encodeURIComponent(confirmMessage)}`;
    const googleMapsUrl = "https://www.google.com/maps/search/?api=1&query=Burger+Bhau+Rolex+Road+Kothariya+Rajkot";

    // Dynamic Hero Status badge text & colors
    const getHeroStatusInfo = () => {
        if (order.status === "Cancelled") {
            return {
                title: "Order Cancelled",
                subtitle: "This order has been cancelled. For refunds or inquiries, please contact our counter.",
                color: "#ef4444",
                bg: "rgba(239, 68, 68, 0.12)",
                border: "rgba(239, 68, 68, 0.3)",
                badge: "Cancelled",
            };
        }
        if (order.status === "Delivered") {
            return {
                title: "Order Completed! 🎉",
                subtitle: "Your meal has been handed over. We hope you love the taste of Burger Bhau!",
                color: "#22c55e",
                bg: "rgba(34, 197, 94, 0.12)",
                border: "rgba(34, 197, 94, 0.3)",
                badge: "Delivered",
            };
        }
        if (order.status === "Ready For Pickup") {
            return {
                title: "Order Ready for Pickup! 🍔",
                subtitle: order.delivery_method === "rapido"
                    ? "Freshly packed & ready! You can now book your Rapido Parcel rider for collection."
                    : "Your order is ready and waiting at our counter on Rolex Road!",
                color: "#22c55e",
                bg: "rgba(34, 197, 94, 0.14)",
                border: "rgba(34, 197, 94, 0.4)",
                badge: "Ready Now",
            };
        }
        if (order.status === "Preparing") {
            return {
                title: "Cooking Hot & Fresh 🔥",
                subtitle: "Our kitchen has accepted your order and our chefs are grilling your burgers right now.",
                color: "#ff8c00",
                bg: "rgba(255, 140, 0, 0.14)",
                border: "rgba(255, 140, 0, 0.4)",
                badge: "Preparing",
            };
        }
        if (order.status === "Accepted") {
            return {
                title: "Order Accepted by Kitchen! 👨‍🍳",
                subtitle: "Your payment is approved and your order is in the cooking queue.",
                color: "#38bdf8",
                bg: "rgba(56, 189, 248, 0.12)",
                border: "rgba(56, 189, 248, 0.35)",
                badge: "Accepted",
            };
        }
        return {
            title: "Order Received — Verifying Payment ⏳",
            subtitle: "We have received your order & UTR. Our team is verifying your payment with the bank.",
            color: "#eab308",
            bg: "rgba(234, 179, 8, 0.12)",
            border: "rgba(234, 179, 8, 0.35)",
            badge: "Verifying UTR",
        };
    };

    const heroInfo = getHeroStatusInfo();

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0c0a09",
            backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 140, 0, 0.08) 0%, transparent 60%)",
            color: "#ffffff",
            padding: "16px 14px 60px 14px",
            fontFamily: "var(--font-jakarta), sans-serif",
            overflowX: "hidden",
        }}>
            <div style={{ maxWidth: "620px", margin: "0 auto" }}>

                {/* Top Nav Bar */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0 18px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "18px",
                }}>
                    <Link
                        href="/orders/"
                        style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "8px",
                            color: "#ff8c00",
                            textDecoration: "none",
                            fontSize: "14px",
                            fontWeight: "700",
                            padding: "8px 12px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 140, 0, 0.1)",
                            border: "1px solid rgba(255, 140, 0, 0.25)",
                        }}
                    >
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <span>My Orders</span>
                    </Link>

                </div>

                {/* 1. Celebratory Hero Status Card */}
                <div style={{
                    backgroundColor: "#161311",
                    border: `1px solid ${heroInfo.border}`,
                    borderRadius: "20px",
                    padding: "22px 18px",
                    marginBottom: "16px",
                    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                    position: "relative",
                    overflow: "hidden",
                }}>
                    {/* Top Order ID & Delivery Method Row */}
                    <div style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: "14px",
                        flexWrap: "wrap",
                        gap: "8px",
                    }}>
                        <div style={{ fontSize: "14px", fontWeight: "800", color: "#ff8c00" }}>
                            ORDER #{order.order_number || order.id.slice(0, 6).toUpperCase()}
                        </div>
                        <div style={{
                            padding: "4px 10px",
                            borderRadius: "12px",
                            fontSize: "12px",
                            fontWeight: "700",
                            color: heroInfo.color,
                            backgroundColor: heroInfo.bg,
                            border: `1px solid ${heroInfo.border}`,
                        }}>
                            {heroInfo.badge}
                        </div>
                    </div>

                    {/* Status Title & Subtitle */}
                    <h1 style={{
                        fontSize: "22px",
                        fontWeight: "800",
                        color: "#ffffff",
                        margin: "0 0 8px 0",
                        lineHeight: "1.3",
                    }}>
                        {heroInfo.title}
                    </h1>
                    <p style={{
                        fontSize: "14px",
                        color: "#d6d3d1",
                        margin: "0 0 18px 0",
                        lineHeight: "1.5",
                    }}>
                        {heroInfo.subtitle}
                    </p>

                    {/* Quick Info Badges: Method & Estimated Prep Time */}
                    <div style={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: "8px",
                        paddingTop: "14px",
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                    }}>
                        <div style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.12)",
                            padding: "6px 12px",
                            borderRadius: "10px",
                            fontSize: "12px",
                            color: "#ff8c00",
                            fontWeight: "700",
                        }}>
                            <FontAwesomeIcon icon={order.delivery_method === "rapido" ? faMotorcycle : faStore} />
                            <span>{order.delivery_method === "rapido" ? "Rapido Parcel Delivery" : "Self Counter Pickup"}</span>
                        </div>

                        {order.status !== "Delivered" && order.status !== "Cancelled" && (
                            <div style={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: "6px",
                                backgroundColor: "rgba(255, 255, 255, 0.06)",
                                border: "1px solid rgba(255, 255, 255, 0.12)",
                                padding: "6px 12px",
                                borderRadius: "10px",
                                fontSize: "12px",
                                color: "#f5f5f5",
                                fontWeight: "600",
                            }}>
                                <FontAwesomeIcon icon={faClock} style={{ color: "#ff8c00" }} />
                                <span>Prep Time: ~15-20 mins</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 2. Customer Action Buttons: WhatsApp & Call Store */}
                <div style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: "10px",
                    marginBottom: "16px",
                }}>
                    <a
                        href={whatsappConfirmUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "14px 10px",
                            backgroundColor: "#25d366",
                            color: "#0c0a09",
                            borderRadius: "14px",
                            fontWeight: "800",
                            fontSize: "14px",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            boxShadow: "0 6px 18px rgba(37, 211, 102, 0.35)",
                            minHeight: "50px",
                            textAlign: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={faWhatsapp} style={{ fontSize: "20px" }} />
                        <span>Send WhatsApp</span>
                    </a>

                    <a
                        href={`tel:+${cleanShopPhone}`}
                        style={{
                            padding: "14px 10px",
                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                            border: "1px solid rgba(255, 140, 0, 0.4)",
                            color: "#ff8c00",
                            borderRadius: "14px",
                            fontWeight: "700",
                            fontSize: "14px",
                            textDecoration: "none",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            minHeight: "50px",
                            textAlign: "center",
                        }}
                    >
                        <FontAwesomeIcon icon={faPhone} />
                        <span>Call Store</span>
                    </a>
                </div>

                {/* Helpful Rapido Rider Timing Notice */}
                {order.delivery_method === "rapido" && (
                    <div style={{
                        backgroundColor: order.status === "Ready For Pickup" ? "rgba(34, 197, 94, 0.12)" : "rgba(255, 140, 0, 0.10)",
                        border: `1px solid ${order.status === "Ready For Pickup" ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 140, 0, 0.3)"}`,
                        borderRadius: "16px",
                        padding: "14px 16px",
                        marginBottom: "16px",
                        display: "flex",
                        gap: "12px",
                        alignItems: "flex-start",
                    }}>
                        <FontAwesomeIcon
                            icon={faMotorcycle}
                            style={{
                                fontSize: "22px",
                                color: order.status === "Ready For Pickup" ? "#22c55e" : "#ff8c00",
                                marginTop: "2px",
                            }}
                        />
                        <div>
                            <div style={{
                                fontSize: "14px",
                                fontWeight: "800",
                                color: order.status === "Ready For Pickup" ? "#22c55e" : "#ff8c00",
                                marginBottom: "4px",
                            }}>
                                {order.status === "Ready For Pickup"
                                    ? "Food Ready! Book Your Rapido Rider Now"
                                    : "Rapido Parcel Instructions"}
                            </div>
                            <div style={{ fontSize: "13px", color: "#d6d3d1", lineHeight: "1.4" }}>
                                {order.status === "Ready For Pickup"
                                    ? "Your order has been freshly packed! You can dispatch your Rapido rider to Burger Bhau counter."
                                    : "Please wait until the status changes to 'Ready for Collection' before booking Rapido so your food stays warm and fresh."}
                            </div>
                        </div>
                    </div>
                )}

                {/* 3. Live Order Journey Stepper */}
                {order.status !== "Cancelled" && (
                    <div style={{
                        backgroundColor: "#161311",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        padding: "20px 18px",
                        marginBottom: "16px",
                        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                    }}>
                        <div style={{
                            fontSize: "16px",
                            fontWeight: "800",
                            color: "#ffffff",
                            marginBottom: "16px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}>
                            <FontAwesomeIcon icon={faClock} style={{ color: "#ff8c00" }} />
                            <span>Live Progress Timeline</span>
                        </div>

                        <div style={{ display: "flex", flexDirection: "column", gap: "0" }}>
                            {STATUS_STEPS.map((step, idx) => {
                                const isDone = idx <= currentStepIndex;
                                const isCurrent = idx === currentStepIndex;
                                const isLast = idx === STATUS_STEPS.length - 1;
                                const timeVal = step.timeKey && order[step.timeKey]
                                    ? new Date(order[step.timeKey] as string).toLocaleTimeString("en-IN", {
                                          hour: "2-digit",
                                          minute: "2-digit",
                                      })
                                    : null;

                                return (
                                    <div key={step.status} style={{ display: "flex", gap: "14px", position: "relative" }}>
                                        {/* Stepper Node & Connecting Line */}
                                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                                            <div style={{
                                                width: "32px",
                                                height: "32px",
                                                borderRadius: "50%",
                                                backgroundColor: isCurrent ? "#ff8c00" : isDone ? "rgba(34, 197, 94, 0.2)" : "rgba(255, 255, 255, 0.06)",
                                                border: `2px solid ${isCurrent ? "#ff8c00" : isDone ? "#22c55e" : "rgba(255, 255, 255, 0.15)"}`,
                                                color: isCurrent ? "#0c0a09" : isDone ? "#22c55e" : "#78716c",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                fontSize: "13px",
                                                fontWeight: "800",
                                                boxShadow: isCurrent ? "0 0 14px rgba(255, 140, 0, 0.6)" : "none",
                                                flexShrink: 0,
                                                zIndex: 2,
                                            }}>
                                                <FontAwesomeIcon icon={isDone ? faCheck : step.icon} />
                                            </div>

                                            {!isLast && (
                                                <div style={{
                                                    width: "2px",
                                                    flex: 1,
                                                    minHeight: "36px",
                                                    backgroundColor: isDone && !isCurrent ? "rgba(34, 197, 94, 0.4)" : "rgba(255, 255, 255, 0.08)",
                                                    margin: "4px 0",
                                                }} />
                                            )}
                                        </div>

                                        {/* Step Content */}
                                        <div style={{ flex: 1, paddingBottom: isLast ? "0" : "20px" }}>
                                            <div style={{
                                                display: "flex",
                                                justifyContent: "space-between",
                                                alignItems: "center",
                                                gap: "8px",
                                            }}>
                                                <div style={{
                                                    fontSize: "14px",
                                                    fontWeight: isCurrent ? "800" : isDone ? "700" : "500",
                                                    color: isCurrent ? "#ff8c00" : isDone ? "#ffffff" : "#78716c",
                                                }}>
                                                    {step.title}
                                                </div>
                                                {timeVal && (
                                                    <span style={{
                                                        fontSize: "11px",
                                                        fontWeight: "700",
                                                        color: "#ff8c00",
                                                        backgroundColor: "rgba(255, 140, 0, 0.1)",
                                                        padding: "2px 6px",
                                                        borderRadius: "6px",
                                                    }}>
                                                        {timeVal}
                                                    </span>
                                                )}
                                            </div>

                                            <div style={{
                                                fontSize: "12px",
                                                color: isDone ? "#a8a29e" : "#57534e",
                                                marginTop: "2px",
                                                lineHeight: "1.4",
                                            }}>
                                                {step.description}
                                            </div>

                                            {isCurrent && (
                                                <div style={{
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "4px",
                                                    fontSize: "11px",
                                                    fontWeight: "800",
                                                    color: "#ff8c00",
                                                    marginTop: "6px",
                                                }}>
                                                    <FontAwesomeIcon icon={faCircleDot} style={{ fontSize: "9px" }} />
                                                    <span>In Progress</span>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* 4. Payment & UTR Card with 1-Tap Copy */}
                <div style={{
                    backgroundColor: "#161311",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "18px",
                    marginBottom: "16px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                    }}>
                        <span>Payment Verification</span>
                        <span style={{
                            fontSize: "12px",
                            fontWeight: "800",
                            color: order.payment_status === "Approved" ? "#22c55e" : order.payment_status === "Rejected" ? "#ef4444" : "#eab308",
                            backgroundColor: order.payment_status === "Approved" ? "rgba(34, 197, 94, 0.15)" : order.payment_status === "Rejected" ? "rgba(239, 68, 68, 0.15)" : "rgba(234, 179, 8, 0.15)",
                            border: `1px solid ${order.payment_status === "Approved" ? "rgba(34, 197, 94, 0.4)" : order.payment_status === "Rejected" ? "rgba(239, 68, 68, 0.4)" : "rgba(234, 179, 8, 0.4)"}`,
                            padding: "4px 10px",
                            borderRadius: "12px",
                        }}>
                            {order.payment_status === "Approved" ? "✓ Verified" : order.payment_status === "Rejected" ? "✕ Rejected" : "⏳ Pending Verification"}
                        </span>
                    </div>

                    {/* UTR Box with Copy Button */}
                    <div style={{
                        backgroundColor: "rgba(255, 255, 255, 0.04)",
                        border: "1px solid rgba(255, 255, 255, 0.1)",
                        borderRadius: "12px",
                        padding: "12px 14px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "10px",
                        marginBottom: "12px",
                    }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <div style={{ fontSize: "11px", color: "#a8a29e", marginBottom: "2px" }}>
                                Transaction Reference (UTR / UPI Ref):
                            </div>
                            <div style={{
                                fontFamily: "monospace",
                                fontSize: "14px",
                                fontWeight: "700",
                                color: "#ffffff",
                                overflowWrap: "anywhere",
                                wordBreak: "break-all",
                            }}>
                                {order.utr || "Not provided"}
                            </div>
                        </div>

                        <button
                            onClick={() => handleCopyUtr(order.utr)}
                            style={{
                                padding: "8px 12px",
                                backgroundColor: copiedUtr ? "#22c55e" : "rgba(255, 140, 0, 0.15)",
                                border: `1px solid ${copiedUtr ? "#22c55e" : "#ff8c00"}`,
                                color: copiedUtr ? "#0c0a09" : "#ff8c00",
                                borderRadius: "8px",
                                fontSize: "12px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                                flexShrink: 0,
                            }}
                        >
                            <FontAwesomeIcon icon={copiedUtr ? faCheck : faCopy} />
                            <span>{copiedUtr ? "Copied!" : "Copy"}</span>
                        </button>
                    </div>

                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "14px" }}>
                        <span style={{ color: "#a8a29e" }}>Total Amount Paid:</span>
                        <span style={{ fontSize: "18px", fontWeight: "800", color: "#ff8c00" }}>₹{order.total}</span>
                    </div>
                </div>

                {/* 5. Itemized Order Details & Customer Info */}
                <div style={{
                    backgroundColor: "#161311",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "18px",
                    marginBottom: "16px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                }}>
                    <div style={{
                        fontSize: "15px",
                        fontWeight: "800",
                        color: "#ffffff",
                        marginBottom: "14px",
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                    }}>
                        <FontAwesomeIcon icon={faReceipt} style={{ color: "#ff8c00" }} />
                        <span>Order Items ({order.order_items?.length || 0})</span>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "14px" }}>
                        {order.order_items && order.order_items.map((item) => (
                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px", fontSize: "14px" }}>
                                <div>
                                    <span style={{ fontWeight: "700", color: "#ffffff" }}>
                                        {item.quantity}x {item.name}
                                    </span>
                                    {item.variant_label && (
                                        <span style={{
                                            marginLeft: "6px",
                                            fontSize: "11px",
                                            color: "#ff8c00",
                                            backgroundColor: "rgba(255, 140, 0, 0.12)",
                                            padding: "2px 6px",
                                            borderRadius: "4px",
                                        }}>
                                            {item.variant_label}
                                        </span>
                                    )}
                                </div>
                                <span style={{ fontWeight: "700", color: "#e7e5e4", flexShrink: 0 }}>
                                    ₹{item.price * item.quantity}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Customer Information */}
                    <div style={{
                        borderTop: "1px solid rgba(255, 255, 255, 0.08)",
                        paddingTop: "12px",
                        display: "flex",
                        flexDirection: "column",
                        gap: "8px",
                        fontSize: "13px",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#d6d3d1" }}>
                            <span style={{ color: "#a8a29e" }}>Customer:</span>
                            <span style={{ fontWeight: "600" }}>{order.customer_name}</span>
                        </div>
                        <div style={{ display: "flex", justifyContent: "space-between", color: "#d6d3d1" }}>
                            <span style={{ color: "#a8a29e" }}>Phone:</span>
                            <span style={{ fontWeight: "600" }}>{order.customer_phone}</span>
                        </div>
                        {order.customer_address && (
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px", color: "#d6d3d1" }}>
                                <span style={{ color: "#a8a29e", flexShrink: 0 }}>Delivery Address:</span>
                                <span style={{ textAlign: "right", maxWidth: "65%", overflowWrap: "anywhere" }}>{order.customer_address}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* 6. Store Counter Location & Directions */}
                <div style={{
                    backgroundColor: "#161311",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    borderRadius: "20px",
                    padding: "18px",
                    marginBottom: "24px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.35)",
                }}>
                    <div style={{ display: "flex", alignItems: "flex-start", gap: "12px", marginBottom: "14px" }}>
                        <div style={{
                            width: "38px",
                            height: "38px",
                            borderRadius: "10px",
                            backgroundColor: "rgba(255, 140, 0, 0.12)",
                            border: "1px solid rgba(255, 140, 0, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            color: "#ff8c00",
                            fontSize: "16px",
                            flexShrink: 0,
                        }}>
                            <FontAwesomeIcon icon={faLocationDot} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: "15px", fontWeight: "800", color: "#ffffff", marginBottom: "2px" }}>
                                Burger Bhau Store Counter
                            </div>
                            <div style={{ fontSize: "13px", color: "#a8a29e", lineHeight: "1.4" }}>
                                Rolex Road, Near Kothariya, Rajkot, Gujarat 360004
                            </div>
                            <div style={{ fontSize: "12px", color: "#ff8c00", marginTop: "4px", fontWeight: "600" }}>
                                Open: 4:00 PM – 11:30 PM Everyday
                            </div>
                        </div>
                    </div>

                    <a
                        href={googleMapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                            padding: "12px",
                            backgroundColor: "rgba(255, 255, 255, 0.06)",
                            border: "1px solid rgba(255, 255, 255, 0.14)",
                            borderRadius: "12px",
                            color: "#ffffff",
                            textDecoration: "none",
                            fontSize: "13px",
                            fontWeight: "700",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                    >
                        <FontAwesomeIcon icon={faLocationDot} style={{ color: "#ff8c00" }} />
                        <span>Get Directions on Google Maps</span>
                    </a>
                </div>

                {/* Back to Home Button */}
                <div style={{ textAlign: "center" }}>
                    <Link
                        href="/"
                        style={{
                            color: "#a8a29e",
                            fontSize: "14px",
                            fontWeight: "600",
                            textDecoration: "none",
                        }}
                    >
                        ← Return to Menu & Homepage
                    </Link>
                </div>

            </div>
        </div>
    );
}
