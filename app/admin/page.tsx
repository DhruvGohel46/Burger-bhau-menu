"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faShoppingBag,
    faRupeeSign,
    faClock,
    faCheckCircle,
    faUsers,
    faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [totalCustomers, setTotalCustomers] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function loadDashboardData() {
            setLoading(true);

            // Fetch orders
            const { data: orderData } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .order("created_at", { ascending: false });

            if (orderData) {
                setOrders(orderData as Order[]);
            }

            // Fetch total customer profiles
            const { count } = await supabase
                .from("profiles")
                .select("*", { count: "exact", head: true });

            setTotalCustomers(count || 0);
            setLoading(false);
        }

        loadDashboardData();
    }, []);

    // Filter today's metrics
    const todayStr = new Date().toISOString().split("T")[0];
    const todayOrders = orders.filter((o) => o.created_at.startsWith(todayStr));
    const todayRevenue = todayOrders
        .filter((o) => o.payment_status === "Approved" || o.status === "Delivered")
        .reduce((sum, o) => sum + o.total, 0);

    const pendingOrders = orders.filter((o) => o.status === "Pending Payment Verification" || o.status === "Accepted" || o.status === "Preparing");
    const completedOrders = orders.filter((o) => o.status === "Delivered");

    if (loading) {
        return (
            <div>
                <h1 style={{ fontSize: "28px", fontWeight: "800", marginBottom: "24px" }}>Dashboard Overview</h1>
                <p>Loading analytics data...</p>
            </div>
        );
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{
                    fontSize: "32px",
                    fontWeight: "700",
                    margin: 0,
                    color: "#F0E8C7",
                    fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    letterSpacing: "-0.01em",
                }}>
                    Dashboard <span style={{ color: "#ff8c00" }}>Overview</span>
                </h1>
                <p style={{ fontSize: "14px", color: "rgba(240, 232, 199, 0.7)", marginTop: "6px" }}>
                    Real-time operational summary and customer stats for Burger Bhau (Kothariya).
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "18px",
                marginBottom: "32px",
            }}>
                <div style={{
                    backgroundColor: "rgba(22, 17, 13, 0.80)",
                    border: "1px solid rgba(207, 75, 19, 0.25)",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(240, 232, 199, 0.7)", fontWeight: "600" }}>Today's Orders</span>
                        <FontAwesomeIcon icon={faShoppingBag} style={{ color: "#ff8c00", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#F0E8C7", fontFamily: "var(--font-playfair), serif" }}>{todayOrders.length}</div>
                </div>

                <div style={{
                    backgroundColor: "rgba(22, 17, 13, 0.80)",
                    border: "1px solid rgba(34, 197, 94, 0.30)",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(240, 232, 199, 0.7)", fontWeight: "600" }}>Today's Revenue</span>
                        <FontAwesomeIcon icon={faRupeeSign} style={{ color: "#22c55e", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#22c55e", fontFamily: "var(--font-playfair), serif" }}>₹{todayRevenue}</div>
                </div>

                <div style={{
                    backgroundColor: "rgba(22, 17, 13, 0.80)",
                    border: "1px solid rgba(255, 193, 7, 0.30)",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(240, 232, 199, 0.7)", fontWeight: "600" }}>Pending Orders</span>
                        <FontAwesomeIcon icon={faClock} style={{ color: "#ffc107", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffc107", fontFamily: "var(--font-playfair), serif" }}>{pendingOrders.length}</div>
                </div>

                <div style={{
                    backgroundColor: "rgba(22, 17, 13, 0.80)",
                    border: "1px solid rgba(207, 75, 19, 0.25)",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(240, 232, 199, 0.7)", fontWeight: "600" }}>Completed Orders</span>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#38bdf8", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#F0E8C7", fontFamily: "var(--font-playfair), serif" }}>{completedOrders.length}</div>
                </div>

                <div style={{
                    backgroundColor: "rgba(22, 17, 13, 0.80)",
                    border: "1px solid rgba(207, 75, 19, 0.25)",
                    borderRadius: "16px",
                    padding: "22px",
                    boxShadow: "0 8px 24px rgba(0, 0, 0, 0.3)",
                    backdropFilter: "blur(12px)",
                }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "rgba(240, 232, 199, 0.7)", fontWeight: "600" }}>Total Customers</span>
                        <FontAwesomeIcon icon={faUsers} style={{ color: "#c084fc", fontSize: "20px" }} />
                    </div>
                    <div style={{ fontSize: "32px", fontWeight: "800", color: "#F0E8C7", fontFamily: "var(--font-playfair), serif" }}>{totalCustomers}</div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div style={{
                backgroundColor: "rgba(22, 17, 13, 0.85)",
                border: "1px solid rgba(207, 75, 19, 0.25)",
                borderRadius: "20px",
                padding: "24px",
                boxShadow: "0 12px 32px rgba(0, 0, 0, 0.4)",
                backdropFilter: "blur(16px)",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{
                        fontSize: "20px",
                        fontWeight: "700",
                        color: "#F0E8C7",
                        margin: 0,
                        fontFamily: "var(--font-playfair), 'Playfair Display', serif",
                    }}>
                        Recent Orders
                    </h2>
                    <Link href="/admin/orders" style={{
                        fontSize: "13px",
                        color: "#ff8c00",
                        fontWeight: "700",
                        textDecoration: "none",
                        display: "flex",
                        alignItems: "center",
                        gap: "6px",
                        padding: "6px 14px",
                        backgroundColor: "rgba(207, 75, 19, 0.12)",
                        border: "1px solid rgba(207, 75, 19, 0.3)",
                        borderRadius: "10px",
                    }}>
                        View All Orders <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <p style={{ color: "#888", fontSize: "14px" }}>No orders recorded yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid rgba(207, 75, 19, 0.2)", color: "rgba(240, 232, 199, 0.6)", fontSize: "12px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                    <th style={{ padding: "14px 12px" }}>Order ID</th>
                                    <th style={{ padding: "14px 12px" }}>Customer</th>
                                    <th style={{ padding: "14px 12px" }}>Method</th>
                                    <th style={{ padding: "14px 12px" }}>Payment</th>
                                    <th style={{ padding: "14px 12px" }}>Status</th>
                                    <th style={{ padding: "14px 12px" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((o) => (
                                    <tr key={o.id} style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.05)" }}>
                                        <td style={{ padding: "14px 12px", fontFamily: "monospace", color: "#ff8c00", fontWeight: "700" }}>#{o.id.slice(0, 8)}</td>
                                        <td style={{ padding: "14px 12px", fontWeight: "600", color: "#F0E8C7" }}>{o.customer_name}</td>
                                        <td style={{ padding: "14px 12px", textTransform: "capitalize", color: "#d4cbb0" }}>{o.delivery_method}</td>
                                        <td style={{ padding: "14px 12px", color: o.payment_status === "Approved" ? "#22c55e" : "#ffc107", fontWeight: "700" }}>{o.payment_status}</td>
                                        <td style={{ padding: "14px 12px", fontWeight: "600", color: "#ff8c00" }}>{o.status}</td>
                                        <td style={{ padding: "14px 12px", fontWeight: "700", color: "#F0E8C7", fontFamily: "var(--font-playfair), serif", fontSize: "16px" }}>₹{o.total}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
