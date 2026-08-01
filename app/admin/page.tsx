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
                <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                    Dashboard Overview
                </h1>
                <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                    Real-time operational summary and customer stats for Burger Bhau.
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
            }}>
                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "600" }}>Today's Orders</span>
                        <FontAwesomeIcon icon={faShoppingBag} style={{ color: "#ff8c00", fontSize: "18px" }} />
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>{todayOrders.length}</div>
                </div>

                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "600" }}>Today's Revenue</span>
                        <FontAwesomeIcon icon={faRupeeSign} style={{ color: "#28a745", fontSize: "18px" }} />
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#28a745" }}>₹{todayRevenue}</div>
                </div>

                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "600" }}>Pending Orders</span>
                        <FontAwesomeIcon icon={faClock} style={{ color: "#ffc107", fontSize: "18px" }} />
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#ffc107" }}>{pendingOrders.length}</div>
                </div>

                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "600" }}>Completed Orders</span>
                        <FontAwesomeIcon icon={faCheckCircle} style={{ color: "#17a2b8", fontSize: "18px" }} />
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>{completedOrders.length}</div>
                </div>

                <div style={{ backgroundColor: "#161616", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                        <span style={{ fontSize: "13px", color: "#aaa", fontWeight: "600" }}>Total Customers</span>
                        <FontAwesomeIcon icon={faUsers} style={{ color: "#9c27b0", fontSize: "18px" }} />
                    </div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>{totalCustomers}</div>
                </div>
            </div>

            {/* Recent Orders Section */}
            <div style={{
                backgroundColor: "#141414",
                border: "1px solid #282828",
                borderRadius: "16px",
                padding: "24px",
            }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                    <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0 }}>
                        Recent Orders
                    </h2>
                    <Link href="/admin/orders" style={{ fontSize: "13px", color: "#ff8c00", fontWeight: "700", textDecoration: "none", display: "flex", alignItems: "center", gap: "6px" }}>
                        View All Orders <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <p style={{ color: "#888", fontSize: "14px" }}>No orders recorded yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #2a2a2a", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                                    <th style={{ padding: "12px" }}>Order ID</th>
                                    <th style={{ padding: "12px" }}>Customer</th>
                                    <th style={{ padding: "12px" }}>Method</th>
                                    <th style={{ padding: "12px" }}>Payment</th>
                                    <th style={{ padding: "12px" }}>Status</th>
                                    <th style={{ padding: "12px" }}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 5).map((o) => (
                                    <tr key={o.id} style={{ borderBottom: "1px solid #1f1f1f" }}>
                                        <td style={{ padding: "12px", fontFamily: "monospace" }}>#{o.id.slice(0, 8)}</td>
                                        <td style={{ padding: "12px", fontWeight: "600" }}>{o.customer_name}</td>
                                        <td style={{ padding: "12px", textTransform: "capitalize" }}>{o.delivery_method}</td>
                                        <td style={{ padding: "12px", color: o.payment_status === "Approved" ? "#28a745" : "#ffc107" }}>{o.payment_status}</td>
                                        <td style={{ padding: "12px", fontWeight: "600", color: "#ff8c00" }}>{o.status}</td>
                                        <td style={{ padding: "12px", fontWeight: "700" }}>₹{o.total}</td>
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
