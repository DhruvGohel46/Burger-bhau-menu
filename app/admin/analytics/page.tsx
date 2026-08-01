"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine, faRupeeSign, faCrown, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAnalytics() {
            setLoading(true);
            const { data } = await supabase.from("orders").select("*, order_items(*)");
            if (data) {
                setOrders(data as Order[]);
            }
            setLoading(false);
        }
        fetchAnalytics();
    }, []);

    const validOrders = orders.filter((o) => o.status !== "Cancelled");

    // Today's Sales
    const todayStr = new Date().toISOString().split("T")[0];
    const todaySales = validOrders
        .filter((o) => o.created_at.startsWith(todayStr))
        .reduce((sum, o) => sum + o.total, 0);

    // Weekly Sales (last 7 days)
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklySales = validOrders
        .filter((o) => new Date(o.created_at) >= sevenDaysAgo)
        .reduce((sum, o) => sum + o.total, 0);

    // Monthly Sales (last 30 days)
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const monthlySales = validOrders
        .filter((o) => new Date(o.created_at) >= thirtyDaysAgo)
        .reduce((sum, o) => sum + o.total, 0);

    // Average Order Value
    const avgOrderValue = validOrders.length > 0
        ? Math.round(validOrders.reduce((sum, o) => sum + o.total, 0) / validOrders.length)
        : 0;

    // Top Selling Products Calculation
    const productSalesMap: Record<string, { name: string; qty: number; revenue: number }> = {};

    validOrders.forEach((order) => {
        if (order.order_items) {
            order.order_items.forEach((item) => {
                const key = item.name;
                if (!productSalesMap[key]) {
                    productSalesMap[key] = { name: item.name, qty: 0, revenue: 0 };
                }
                productSalesMap[key].qty += item.quantity;
                productSalesMap[key].revenue += item.price * item.quantity;
            });
        }
    });

    const topProducts = Object.values(productSalesMap)
        .sort((a, b) => b.qty - a.qty)
        .slice(0, 5);

    if (loading) {
        return <p>Loading sales analytics...</p>;
    }

    return (
        <div>
            {/* Header */}
            <div style={{ marginBottom: "28px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                    Sales & Performance Analytics
                </h1>
                <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                    Revenue metrics, average order value, and top-selling menu items.
                </p>
            </div>

            {/* Metrics Cards */}
            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                gap: "16px",
                marginBottom: "32px",
            }}>
                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>Today's Sales</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#ff8c00" }}>₹{todaySales}</div>
                </div>

                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>Weekly Sales (7 Days)</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#28a745" }}>₹{weeklySales}</div>
                </div>

                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>Monthly Sales (30 Days)</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#17a2b8" }}>₹{monthlySales}</div>
                </div>

                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "14px", padding: "20px" }}>
                    <div style={{ fontSize: "13px", color: "#aaa", marginBottom: "8px" }}>Avg Order Value</div>
                    <div style={{ fontSize: "28px", fontWeight: "800", color: "#fff" }}>₹{avgOrderValue}</div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div style={{
                backgroundColor: "#141414",
                border: "1px solid #282828",
                borderRadius: "16px",
                padding: "24px",
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <FontAwesomeIcon icon={faCrown} style={{ color: "#ffc107", fontSize: "20px" }} />
                    <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#fff", margin: 0 }}>
                        Top Selling Menu Items
                    </h2>
                </div>

                {topProducts.length === 0 ? (
                    <p style={{ color: "#777" }}>No sales data available yet.</p>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                            <thead>
                                <tr style={{ borderBottom: "1px solid #282828", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                                    <th style={{ padding: "12px" }}>Rank</th>
                                    <th style={{ padding: "12px" }}>Item Name</th>
                                    <th style={{ padding: "12px" }}>Quantity Sold</th>
                                    <th style={{ padding: "12px" }}>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, idx) => (
                                    <tr key={p.name} style={{ borderBottom: "1px solid #1e1e1e" }}>
                                        <td style={{ padding: "12px", fontWeight: "700", color: "#ff8c00" }}>#{idx + 1}</td>
                                        <td style={{ padding: "12px", fontWeight: "600" }}>{p.name}</td>
                                        <td style={{ padding: "12px" }}>{p.qty} units</td>
                                        <td style={{ padding: "12px", fontWeight: "700", color: "#28a745" }}>₹{p.revenue}</td>
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
