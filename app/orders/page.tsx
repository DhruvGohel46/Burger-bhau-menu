"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faBoxOpen, faClock, faCheckCircle, faTimesCircle, faMotorcycle, faStore } from "@fortawesome/free-solid-svg-icons";

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
        let bg = "rgba(255, 140, 0, 0.15)";
        if (status === "Delivered" || status === "Ready For Pickup") {
            color = "#28a745";
            bg = "rgba(40, 167, 69, 0.15)";
        } else if (status === "Cancelled") {
            color = "#ff4444";
            bg = "rgba(255, 68, 68, 0.15)";
        }

        return (
            <span style={{
                padding: "6px 12px",
                borderRadius: "20px",
                fontSize: "12px",
                fontWeight: "700",
                color,
                backgroundColor: bg,
                border: `1px solid ${color}`,
                display: "inline-block",
            }}>
                {status}
            </span>
        );
    };

    if (isLoading || loadingOrders) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0f0f0f", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Loading your orders...</p>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: "100vh",
            backgroundColor: "#0f0f0f",
            color: "#fff",
            padding: "20px 16px 40px 16px",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            <div style={{ maxWidth: "680px", margin: "0 auto" }}>

                {/* Header */}
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <Link href="/" style={{ color: "#ff8c00", fontSize: "18px" }}>
                            <FontAwesomeIcon icon={faArrowLeft} />
                        </Link>
                        <h1 style={{ fontSize: "24px", fontWeight: "800", margin: 0, color: "#fff" }}>
                            My Orders
                        </h1>
                    </div>
                    <Link href="/profile" style={{ fontSize: "13px", color: "#aaa", textDecoration: "underline" }}>
                        My Profile
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <div style={{
                        backgroundColor: "#1a1a1a",
                        border: "1px solid #333",
                        borderRadius: "16px",
                        padding: "40px 20px",
                        textAlign: "center",
                    }}>
                        <FontAwesomeIcon icon={faBoxOpen} style={{ fontSize: "48px", color: "#444", marginBottom: "16px" }} />
                        <h2 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>No orders placed yet</h2>
                        <p style={{ fontSize: "14px", color: "#aaa", marginBottom: "20px" }}>
                            Explore our delicious burgers and snacks on the menu.
                        </p>
                        <Link href="/" style={{
                            padding: "12px 24px",
                            backgroundColor: "#ff8c00",
                            color: "#000",
                            borderRadius: "8px",
                            fontWeight: "700",
                            textDecoration: "none",
                        }}>
                            Order Now
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                style={{
                                    backgroundColor: "#1a1a1a",
                                    border: "1px solid #333",
                                    borderRadius: "16px",
                                    padding: "20px",
                                    textDecoration: "none",
                                    color: "#fff",
                                    transition: "border-color 0.2s",
                                }}
                            >
                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                                    <div>
                                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#ff8c00", marginBottom: "4px" }}>
                                            Order #{order.order_number || order.id.slice(0, 8)}
                                        </div>
                                        <div style={{ fontSize: "13px", color: "#888" }}>
                                            {new Date(order.created_at).toLocaleString("en-IN", {
                                                dateStyle: "medium",
                                                timeStyle: "short",
                                            })}
                                        </div>
                                    </div>
                                    {getStatusBadge(order.status)}
                                </div>

                                {/* Items overview */}
                                <div style={{ fontSize: "14px", color: "#ddd", marginBottom: "12px", borderTop: "1px solid #282828", borderBottom: "1px solid #282828", padding: "10px 0" }}>
                                    {order.order_items && order.order_items.length > 0 ? (
                                        order.order_items.map((item) => (
                                            <div key={item.id} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                                                <span>{item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}</span>
                                                <span style={{ color: "#aaa" }}>₹{item.price * item.quantity}</span>
                                            </div>
                                        ))
                                    ) : (
                                        <span>Order details available inside</span>
                                    )}
                                </div>

                                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                                    <div style={{ fontSize: "13px", color: "#aaa" }}>
                                        Method: <strong style={{ color: "#ff8c00", textTransform: "capitalize" }}>{order.delivery_method}</strong>
                                    </div>
                                    <div style={{ fontSize: "16px", fontWeight: "800", color: "#ff8c00" }}>
                                        ₹{order.total}
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
