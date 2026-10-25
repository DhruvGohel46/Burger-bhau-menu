"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faArrowLeft,
    faBoxOpen,
    faClock,
    faCheckCircle,
    faTimesCircle,
    faMotorcycle,
    faStore,
    faChevronRight,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";

export default function MyOrdersPage() {
    const router = useRouter();
    const { user, isLoading } = useAuthStore();

    const [orders, setOrders] = useState<Order[]>([]);
    const [loadingOrders, setLoadingOrders] = useState(true);

    useEffect(() => {
        if (!isLoading && !user) {
            router.push("/login");
            return;
        }

        async function fetchMyOrders() {
            if (!user) return;
            setLoadingOrders(true);

            const { data, error } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .eq("customer_id", user.id)
                .order("created_at", { ascending: false });

            if (error) {
                console.error("Error fetching orders:", error);
            } else if (data) {
                setOrders(data as Order[]);
            }
            setLoadingOrders(false);
        }

        if (user) {
            fetchMyOrders();
        }
    }, [user, isLoading, router]);

    const getStatusBadge = (status: string) => {
        let color = "#ff8c00";
        let bg = "rgba(255, 140, 0, 0.12)";
        let border = "rgba(255, 140, 0, 0.35)";

        if (status === "Delivered" || status === "Ready For Pickup") {
            color = "#22c55e";
            bg = "rgba(34, 197, 94, 0.12)";
            border = "rgba(34, 197, 94, 0.35)";
        } else if (status === "Cancelled") {
            color = "#ef4444";
            bg = "rgba(239, 68, 68, 0.12)";
            border = "rgba(239, 68, 68, 0.35)";
        } else if (status === "Accepted" || status === "Preparing") {
            color = "#38bdf8";
            bg = "rgba(56, 189, 248, 0.12)";
            border = "rgba(56, 189, 248, 0.35)";
        }

        return (
            <span style={{
                padding: "4px 10px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "700",
                color,
                backgroundColor: bg,
                border: `1px solid ${border}`,
                display: "inline-block",
                whiteSpace: "nowrap",
            }}>
                {status}
            </span>
        );
    };

    if (isLoading || loadingOrders) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "#0c0a09",
                color: "#ffffff",
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
                <p style={{ fontSize: "15px", color: "#a8a29e", fontWeight: "600" }}>
                    Loading your order history...
                </p>
                <style jsx>{`
                    @keyframes spin {
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0c0a09",
            backgroundImage: "radial-gradient(circle at 50% 0%, rgba(255, 140, 0, 0.08) 0%, transparent 60%)",
            color: "#ffffff",
            padding: "16px 14px 60px 14px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{ maxWidth: "620px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "10px 0 18px 0",
                    borderBottom: "1px solid rgba(255, 255, 255, 0.08)",
                    marginBottom: "20px",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link
                            href="/"
                            style={{
                                color: "#ff8c00",
                                fontSize: "15px",
                                padding: "8px 12px",
                                borderRadius: "10px",
                                backgroundColor: "rgba(255, 140, 0, 0.1)",
                                border: "1px solid rgba(255, 140, 0, 0.25)",
                                textDecoration: "none",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            <span>Menu</span>
                        </Link>
                        <h1 style={{ fontSize: "20px", fontWeight: "800", margin: 0, color: "#ffffff" }}>
                            My Orders
                        </h1>
                    </div>

                    <Link
                        href="/profile/"
                        style={{
                            fontSize: "13px",
                            color: "#a8a29e",
                            textDecoration: "none",
                            padding: "6px 12px",
                            borderRadius: "8px",
                            border: "1px solid rgba(255, 255, 255, 0.1)",
                            backgroundColor: "rgba(255, 255, 255, 0.04)",
                        }}
                    >
                        Profile
                    </Link>
                </div>

                {/* Empty State */}
                {orders.length === 0 ? (
                    <div style={{
                        backgroundColor: "#161311",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        borderRadius: "20px",
                        padding: "48px 20px",
                        textAlign: "center",
                        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.4)",
                    }}>
                        <div style={{
                            width: "64px",
                            height: "64px",
                            borderRadius: "50%",
                            backgroundColor: "rgba(255, 140, 0, 0.12)",
                            border: "1px solid rgba(255, 140, 0, 0.3)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            margin: "0 auto 18px auto",
                            color: "#ff8c00",
                            fontSize: "26px",
                        }}>
                            <FontAwesomeIcon icon={faBoxOpen} />
                        </div>
                        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#ffffff", marginBottom: "8px" }}>
                            No orders placed yet
                        </h2>
                        <p style={{ fontSize: "14px", color: "#a8a29e", marginBottom: "24px", maxWidth: "340px", margin: "0 auto 24px auto" }}>
                            Hungry? Explore our handcrafted gourmet burgers, loaded fries & shakes!
                        </p>
                        <Link
                            href="/"
                            style={{
                                display: "inline-block",
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
                            Browse Menu Now
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}/`}
                                prefetch={false}
                                style={{
                                    backgroundColor: "#161311",
                                    border: "1px solid rgba(255, 255, 255, 0.08)",
                                    borderRadius: "18px",
                                    padding: "18px",
                                    boxShadow: "0 6px 20px rgba(0, 0, 0, 0.3)",
                                    textDecoration: "none",
                                    color: "#ffffff",
                                    display: "block",
                                    transition: "border-color 0.2s, transform 0.15s",
                                }}
                            >
                                {/* Order Title & Status */}
                                <div style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "flex-start",
                                    marginBottom: "12px",
                                    gap: "8px",
                                }}>
                                    <div>
                                        <div style={{ fontSize: "15px", fontWeight: "800", color: "#ff8c00", marginBottom: "4px" }}>
                                            Order #{order.order_number || order.id.slice(0, 6).toUpperCase()}
                                        </div>
                                        <div style={{ fontSize: "12px", color: "#a8a29e" }}>
                                            {new Date(order.created_at).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </div>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                {/* Order Items Summary */}
                                <div style={{
                                    fontSize: "13px",
                                    color: "#d6d3d1",
                                    marginBottom: "12px",
                                    borderTop: "1px solid rgba(255, 255, 255, 0.06)",
                                    borderBottom: "1px solid rgba(255, 255, 255, 0.06)",
                                    padding: "10px 0",
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: "6px",
                                }}>
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.slice(0, 3).map((item) => (
                                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between" }}>
                                                <span>
                                                    {item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}
                                                </span>
                                                <span style={{ color: "#a8a29e" }}>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span>Burger Bhau Meal</span>
                                    )}
                                    {order.order_items && order.order_items.length > 3 && (
                                        <span style={{ fontSize: "11px", color: "#ff8c00" }}>
                                            +{order.order_items.length - 3} more items...
                                        </span>
                                    )}
                                </div>

                                {/* Footer: Method, Total, and Arrow */}
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{
                                        fontSize: "12px",
                                        color: "#a8a29e",
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "6px",
                                    }}>
                                        <FontAwesomeIcon
                                            icon={order.delivery_method === "rapido" ? faMotorcycle : faStore}
                                            style={{ color: "#ff8c00" }}
                                        />
                                        <span style={{ textTransform: "capitalize" }}>{order.delivery_method || "Pickup"}</span>
                                    </div>

                                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                                        <div style={{ fontSize: "16px", fontWeight: "800", color: "#ff8c00" }}>
                                            ₹{order.total}
                                        </div>
                                        <FontAwesomeIcon icon={faChevronRight} style={{ fontSize: "12px", color: "#57534e" }} />
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}

            </div>
        </div>
    );
}
