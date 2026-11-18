"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCrown } from "@fortawesome/free-solid-svg-icons";
import styles from "./analyticsAdmin.module.css";

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
        return (
            <div className={styles.container}>
                <p className={styles.emptyText}>Loading sales analytics...</p>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Sales &amp; Performance Analytics
                </h1>
                <p className={styles.subtitle}>
                    Revenue metrics, average order value, and top-selling menu items.
                </p>
            </div>

            {/* Metrics Cards */}
            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Today's Sales</div>
                    <div className={`${styles.metricValue} ${styles.metricAccent}`}>₹{todaySales}</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Weekly Sales (7 Days)</div>
                    <div className={`${styles.metricValue} ${styles.metricSuccess}`}>₹{weeklySales}</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Monthly Sales (30 Days)</div>
                    <div className={styles.metricValue}>₹{monthlySales}</div>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricLabel}>Avg Order Value</div>
                    <div className={styles.metricValue}>₹{avgOrderValue}</div>
                </div>
            </div>

            {/* Top Selling Products */}
            <div className={styles.tableCard}>
                <div className={styles.tableTitleRow}>
                    <FontAwesomeIcon icon={faCrown} className={styles.crownIcon} />
                    <h2 className={styles.tableTitle}>
                        Top Selling Menu Items
                    </h2>
                </div>

                {topProducts.length === 0 ? (
                    <p className={styles.emptyText}>No sales data available yet.</p>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Rank</th>
                                    <th className={styles.th}>Item Name</th>
                                    <th className={styles.th}>Quantity Sold</th>
                                    <th className={styles.th}>Total Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {topProducts.map((p, idx) => (
                                    <tr key={p.name} className={styles.tr}>
                                        <td className={styles.rankCell}>#{idx + 1}</td>
                                        <td className={styles.itemCell}>{p.name}</td>
                                        <td className={styles.qtyCell}>{p.qty} units</td>
                                        <td className={styles.revenueCell}>₹{p.revenue}</td>
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
