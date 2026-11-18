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
    faUtensils,
    faMoon,
    faQrcode,
    faChartPie,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./dashboard.module.css";

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

    const pendingOrders = orders.filter(
        (o) =>
            o.status === "Pending Payment Verification" ||
            o.status === "Accepted" ||
            o.status === "Preparing"
    );
    const completedOrders = orders.filter((o) => o.status === "Delivered");

    if (loading) {
        return (
            <div className={styles.container}>
                <div className={styles.header}>
                    <h1 className={styles.title}>Dashboard Overview</h1>
                    <p className={styles.subtitle}>Loading real-time store metrics…</p>
                </div>
            </div>
        );
    }

    return (
        <div className={styles.container}>
            {/* Header */}
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Dashboard <span className={styles.accent}>Overview</span>
                </h1>
                <p className={styles.subtitle}>
                    Real-time operational summary, live order flow, and customer stats for Burger Bhau (Kothariya).
                </p>
            </div>

            {/* Metric Cards Grid */}
            <div className={styles.metricsGrid}>
                <div className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>Today&apos;s Revenue</span>
                        <div className={styles.metricIconCircle}>
                            <FontAwesomeIcon icon={faRupeeSign} />
                        </div>
                    </div>
                    <div className={styles.metricValue}>₹{todayRevenue}</div>
                    <span className={styles.metricFooter}>{todayOrders.length} orders today</span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>Pending Action</span>
                        <div className={styles.metricIconCircle}>
                            <FontAwesomeIcon icon={faClock} />
                        </div>
                    </div>
                    <div className={styles.metricValue}>{pendingOrders.length}</div>
                    <span className={styles.metricFooter}>Awaiting prep or verification</span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>Today&apos;s Completed</span>
                        <div className={styles.metricIconCircle}>
                            <FontAwesomeIcon icon={faCheckCircle} />
                        </div>
                    </div>
                    <div className={styles.metricValue}>{completedOrders.length}</div>
                    <span className={styles.metricFooter}>Delivered orders</span>
                </div>

                <div className={styles.metricCard}>
                    <div className={styles.metricHeader}>
                        <span className={styles.metricLabel}>Total Customers</span>
                        <div className={styles.metricIconCircle}>
                            <FontAwesomeIcon icon={faUsers} />
                        </div>
                    </div>
                    <div className={styles.metricValue}>{totalCustomers}</div>
                    <span className={styles.metricFooter}>Registered accounts</span>
                </div>
            </div>

            {/* Quick Management Shortcuts */}
            <div className={styles.shortcutsGrid}>
                <Link href="/admin/orders/" className={styles.shortcutCard}>
                    <span className={styles.shortcutIcon} aria-hidden="true">📋</span>
                    <div className={styles.shortcutMeta}>
                        <span className={styles.shortcutTitle}>Live Kitchen Orders</span>
                        <span className={styles.shortcutDesc}>Verify UTR & status</span>
                    </div>
                </Link>

                <Link href="/admin/menu/" className={styles.shortcutCard}>
                    <span className={styles.shortcutIcon} aria-hidden="true">🍔</span>
                    <div className={styles.shortcutMeta}>
                        <span className={styles.shortcutTitle}>Menu & Prices</span>
                        <span className={styles.shortcutDesc}>Items, stock & badges</span>
                    </div>
                </Link>

                <Link href="/admin/settings/" className={styles.shortcutCard}>
                    <span className={styles.shortcutIcon} aria-hidden="true">🌙</span>
                    <div className={styles.shortcutMeta}>
                        <span className={styles.shortcutTitle}>Special Night Hours</span>
                        <span className={styles.shortcutDesc}>Extend closing to 2 AM</span>
                    </div>
                </Link>

                <Link href="/admin/analytics/" className={styles.shortcutCard}>
                    <span className={styles.shortcutIcon} aria-hidden="true">📊</span>
                    <div className={styles.shortcutMeta}>
                        <span className={styles.shortcutTitle}>Sales Analytics</span>
                        <span className={styles.shortcutDesc}>Revenue & top sellers</span>
                    </div>
                </Link>

                <Link href="/admin/qr/" className={styles.shortcutCard}>
                    <span className={styles.shortcutIcon} aria-hidden="true">📱</span>
                    <div className={styles.shortcutMeta}>
                        <span className={styles.shortcutTitle}>Store QR Codes</span>
                        <span className={styles.shortcutDesc}>UPI & table stands</span>
                    </div>
                </Link>
            </div>

            {/* Recent Orders Section */}
            <div className={styles.sectionCard}>
                <div className={styles.sectionHeader}>
                    <h2 className={styles.sectionTitle}>Recent Orders</h2>
                    <Link href="/admin/orders/" className={styles.viewAllLink}>
                        <span>View All Orders</span>
                        <FontAwesomeIcon icon={faArrowRight} />
                    </Link>
                </div>

                {orders.length === 0 ? (
                    <p className={styles.emptyText}>No orders recorded yet.</p>
                ) : (
                    <div className={styles.tableWrap}>
                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    <th className={styles.th}>Order ID</th>
                                    <th className={styles.th}>Customer</th>
                                    <th className={styles.th}>Method</th>
                                    <th className={styles.th}>Payment</th>
                                    <th className={styles.th}>Status</th>
                                    <th className={styles.th}>Total</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 6).map((o) => {
                                    const isPending =
                                        o.status === "Pending Payment Verification" ||
                                        o.payment_status === "Pending";
                                    const isCancelled = o.status === "Cancelled";

                                    return (
                                        <tr key={o.id} className={styles.tr}>
                                            <td className={styles.td} style={{ fontFamily: "monospace", fontWeight: 700, color: "var(--accent)" }}>
                                                #{o.order_number ? o.order_number : o.id.slice(0, 8)}
                                            </td>
                                            <td className={styles.td} style={{ fontWeight: 600 }}>
                                                {o.customer_name}
                                            </td>
                                            <td className={styles.td} style={{ textTransform: "capitalize" }}>
                                                {o.delivery_method}
                                            </td>
                                            <td className={styles.td}>
                                                <span
                                                    className={`${styles.statusPill} ${
                                                        o.payment_status === "Approved"
                                                            ? styles.statusSuccess
                                                            : styles.statusPending
                                                    }`}
                                                >
                                                    {o.payment_status}
                                                </span>
                                            </td>
                                            <td className={styles.td}>
                                                <span
                                                    className={`${styles.statusPill} ${
                                                        isCancelled
                                                            ? styles.statusCancelled
                                                            : isPending
                                                            ? styles.statusPending
                                                            : styles.statusSuccess
                                                    }`}
                                                >
                                                    {o.status}
                                                </span>
                                            </td>
                                            <td className={styles.td} style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                                                ₹{o.total}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
