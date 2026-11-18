"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/store/authStore";
import { Order, OrderStatus, PaymentStatus } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faSearch,
    faFilter,
    faSync,
    faVolumeHigh,
    faVolumeMute,
    faBell,
    faHistory,
    faPhone,
    faCopy,
    faCheck,
    faCheckCircle,
    faTimes,
    faExclamationTriangle,
    faSpinner,
    faReceipt,
} from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";
import styles from "./ordersAdmin.module.css";

// Global Web Audio Context Synthesizer for Persistent Order Alarm
let sharedAudioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
    if (typeof window === "undefined") return null;
    const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioCtx) return null;
    if (!sharedAudioCtx) {
        sharedAudioCtx = new AudioCtx();
    }
    if (sharedAudioCtx.state === "suspended") {
        sharedAudioCtx.resume();
    }
    return sharedAudioCtx;
}

function playOrderAlarm() {
    try {
        const ctx = getAudioContext();
        if (!ctx) return;
        if (ctx.state === "suspended") {
            ctx.resume();
        }

        const now = ctx.currentTime;

        // Dynamics compressor to maximize loudness and prevent distortion
        const compressor = ctx.createDynamicsCompressor();
        compressor.threshold.setValueAtTime(-10, now);
        compressor.knee.setValueAtTime(30, now);
        compressor.ratio.setValueAtTime(14, now);
        compressor.attack.setValueAtTime(0.003, now);
        compressor.release.setValueAtTime(0.20, now);

        const masterGain = ctx.createGain();
        masterGain.gain.setValueAtTime(0.95, now);

        masterGain.connect(compressor);
        compressor.connect(ctx.destination);

        // Piercing commercial restaurant kitchen chime sequence (B5 -> E6 -> A6, pause, E6 -> A6)
        const beeps = [
            { freq: 987.77, start: 0.0, dur: 0.13 },
            { freq: 1318.51, start: 0.15, dur: 0.13 },
            { freq: 1760.00, start: 0.30, dur: 0.20 },
            { freq: 1318.51, start: 0.55, dur: 0.13 },
            { freq: 1760.00, start: 0.70, dur: 0.25 },
        ];

        beeps.forEach(({ freq, start, dur }) => {
            const tStart = now + start;
            const tEnd = tStart + dur;

            // 1. Triangle wave: high acoustic energy body
            const osc1 = ctx.createOscillator();
            const gain1 = ctx.createGain();
            osc1.type = "triangle";
            osc1.frequency.setValueAtTime(freq, tStart);
            gain1.gain.setValueAtTime(0.85, tStart);
            gain1.gain.exponentialRampToValueAtTime(0.01, tEnd);
            osc1.connect(gain1);
            gain1.connect(masterGain);
            osc1.start(tStart);
            osc1.stop(tEnd);

            // 2. Square harmonic: sharp cutting edge for noisy kitchen environments
            const osc2 = ctx.createOscillator();
            const gain2 = ctx.createGain();
            osc2.type = "square";
            osc2.frequency.setValueAtTime(freq * 1.5, tStart);
            gain2.gain.setValueAtTime(0.3, tStart);
            gain2.gain.exponentialRampToValueAtTime(0.008, tEnd);
            osc2.connect(gain2);
            gain2.connect(masterGain);
            osc2.start(tStart);
            osc2.stop(tEnd);
        });
    } catch (e) {
        console.error("Audio error:", e);
    }
}

function buildCustomerWhatsAppUrl(order: Order, customText?: string) {
    const cleanPhone = (order.customer_phone || "").replace(/[^0-9]/g, "");
    const phoneWithCountry = cleanPhone.startsWith("91") ? cleanPhone : `91${cleanPhone}`;
    let text = customText;
    if (!text) {
        if (order.status === "Ready For Pickup") {
            text = `Hi ${order.customer_name}! Your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} is FRESH & READY FOR PICKUP at our counter! 🍔 Pickup location: Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot. See you soon!`;
        } else if (order.status === "Accepted") {
            text = `Hi ${order.customer_name}! Your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} has been ACCEPTED by our kitchen. We are preparing it fresh for you! 🍟`;
        } else if (order.status === "Preparing") {
            text = `Hi ${order.customer_name}! Your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} is currently being prepared hot & fresh in our kitchen!`;
        } else if (order.status === "Delivered") {
            text = `Hi ${order.customer_name}! Your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} has been completed/delivered. Thank you for ordering from Burger Bhau! Enjoy your meal!`;
        } else if (order.status === "Cancelled") {
            text = `Hi ${order.customer_name}, your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} has been cancelled. For queries, please contact us at +919558941555.`;
        } else if (order.payment_status === "Approved") {
            text = `Hi ${order.customer_name}! Your payment for Order #${order.order_number || order.id.slice(0, 6)} (Total: ₹${order.total}, UTR: ${order.utr}) has been VERIFIED & APPROVED! Thank you!`;
        } else if (order.payment_status === "Rejected") {
            text = `Hi ${order.customer_name}, we were unable to verify your payment UTR (${order.utr}) for Order #${order.order_number || order.id.slice(0, 6)}. Please check your transaction or send the correct UTR to confirm your order.`;
        } else {
            text = `Hi ${order.customer_name}, regarding your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)}:`;
        }
    }
    return `https://wa.me/${phoneWithCountry}?text=${encodeURIComponent(text)}`;
}

export default function AdminOrdersPage() {
    const { user } = useAuthStore();
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("ALL");
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
    const [soundEnabled, setSoundEnabled] = useState(true);
    const [notifPermission, setNotifPermission] = useState<string>("default");

    // Modal action feedback & states
    const [actionLoading, setActionLoading] = useState(false);
    const [actionFeedback, setActionFeedback] = useState<{ type: "success" | "error"; message: string } | null>(null);
    const [copiedUtr, setCopiedUtr] = useState(false);
    const [silencedOrderIds, setSilencedOrderIds] = useState<string[]>([]);

    const requestWebNotification = () => {
        if ("Notification" in window) {
            Notification.requestPermission().then((perm) => {
                setNotifPermission(perm);
            });
        }
    };

    useEffect(() => {
        if ("Notification" in window) {
            setNotifPermission(Notification.permission);
        }

        // Unlock browser audio autoplay policy on any user interaction
        const unlockAudio = () => {
            getAudioContext();
        };
        window.addEventListener("click", unlockAudio, { passive: true });
        window.addEventListener("touchstart", unlockAudio, { passive: true });
        return () => {
            window.removeEventListener("click", unlockAudio);
            window.removeEventListener("touchstart", unlockAudio);
        };
    }, []);

    const fetchOrders = async (showSpinner = false) => {
        if (showSpinner) setLoading(true);
        try {
            const { data } = await supabase
                .from("orders")
                .select("*, order_items(*)")
                .order("created_at", { ascending: false });

            if (data) {
                setOrders(data as Order[]);
            }
        } catch (err) {
            console.error("Error fetching orders:", err);
        } finally {
            if (showSpinner) setLoading(false);
        }
    };

    // Auto-sync polling every 4 seconds + Supabase Realtime WebSocket push
    useEffect(() => {
        fetchOrders(true);

        // 1. Fallback background auto-sync poll every 4 seconds
        const pollInterval = setInterval(() => {
            fetchOrders(false);
        }, 4000);

        // 2. Immediate sync when user refocuses browser tab
        const onWindowFocus = () => {
            fetchOrders(false);
        };
        window.addEventListener("focus", onWindowFocus);

        // 3. Supabase Realtime WebSocket subscription for instant push
        const channel = supabase
            .channel("admin-orders-live")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "orders" },
                (payload) => {
                    const newOrder = payload.new as Order;
                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("🍔 NEW ORDER RECEIVED!", {
                            body: `Order #${newOrder.order_number || "New"} - Total ₹${newOrder.total} by ${newOrder.customer_name}`,
                            icon: "/BURGER-BHAU-logo.webp",
                        });
                    }
                    fetchOrders(false);
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "orders" },
                () => {
                    fetchOrders(false);
                }
            )
            .subscribe();

        return () => {
            clearInterval(pollInterval);
            window.removeEventListener("focus", onWindowFocus);
            supabase.removeChannel(channel);
        };
    }, []);

    // Active unhandled incoming orders awaiting admin action (excludes any approved, cancelled, or silenced orders)
    const unhandledOrders = orders.filter((o) => {
        if (silencedOrderIds.includes(o.id)) return false;
        const isPendingStatus = o.status === "Pending Payment Verification";
        const isPendingPayment = o.payment_status === "Pending";
        return isPendingStatus && isPendingPayment;
    });
    const hasPendingAlert = unhandledOrders.length > 0;

    // Persistent siren: repeatedly rings every 3.5 seconds until admin accepts or rejects!
    useEffect(() => {
        if (!soundEnabled || !hasPendingAlert) return;

        // Play immediate siren
        playOrderAlarm();

        // Repeat ringing every 3.5 seconds
        const alarmInterval = setInterval(() => {
            playOrderAlarm();
        }, 3500);

        return () => {
            clearInterval(alarmInterval);
        };
    }, [soundEnabled, hasPendingAlert]);

    // Flashing browser title when pending orders exist
    useEffect(() => {
        if (!hasPendingAlert) {
            document.title = "Orders Management | Burger Bhau Admin";
            return;
        }

        let flip = false;
        const titleInterval = setInterval(() => {
            flip = !flip;
            document.title = flip
                ? `🚨 (${unhandledOrders.length}) NEW ORDER! - Burger Bhau`
                : `⚡ ACTION REQUIRED - Burger Bhau`;
        }, 1000);

        return () => {
            clearInterval(titleInterval);
            document.title = "Orders Management | Burger Bhau Admin";
        };
    }, [hasPendingAlert, unhandledOrders.length]);

    const handleCopyUtr = (utr: string) => {
        if (!utr) return;
        navigator.clipboard.writeText(utr);
        setCopiedUtr(true);
        setTimeout(() => setCopiedUtr(false), 2000);
    };



    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        if (newStatus !== "Pending Payment Verification") {
            setSilencedOrderIds((prev) => Array.from(new Set([...prev, orderId])));
        }
        setActionLoading(true);
        setActionFeedback(null);
        try {
            const updateData: any = {
                status: newStatus,
                updated_at: new Date().toISOString(),
            };

            // If marking Accepted, automatically approve payment status as well if pending
            if (newStatus === "Accepted") {
                updateData.accepted_at = new Date().toISOString();
                if (selectedOrder?.payment_status === "Pending") {
                    updateData.payment_verified_at = new Date().toISOString();
                    updateData.payment_status = "Approved";
                }
            }
            if (newStatus === "Preparing") updateData.preparing_at = new Date().toISOString();
            if (newStatus === "Ready For Pickup") updateData.ready_at = new Date().toISOString();
            if (newStatus === "Cancelled") updateData.cancelled_at = new Date().toISOString();

            const { error } = await supabase
                .from("orders")
                .update(updateData)
                .eq("id", orderId);

            if (error) throw error;

            // Log activity in background
            try {
                await supabase.from("activity_logs").insert({
                    order_id: orderId,
                    admin_id: user?.id,
                    action: `Updated Status to ${newStatus}`,
                    details: { newStatus, timestamp: new Date().toISOString() },
                });
            } catch (e) {
                console.warn("Activity log insert failed:", e);
            }

            // Immediately update state in table and in active modal
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, ...updateData } : o))
            );
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder((prev) => (prev ? { ...prev, ...updateData } : null));
            }

            setActionFeedback({
                type: "success",
                message: `Status updated to "${newStatus}"!`,
            });
        } catch (err: any) {
            console.error("Order status update error:", err);
            setActionFeedback({
                type: "error",
                message: err?.message || "Failed to update order status.",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const updatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
        // Immediately silence alert for this order
        setSilencedOrderIds((prev) => Array.from(new Set([...prev, orderId])));
        setActionLoading(true);
        setActionFeedback(null);
        try {
            const currentOrder = orders.find((o) => o.id === orderId) || selectedOrder;
            const updateData: any = {
                payment_status: newPaymentStatus,
                updated_at: new Date().toISOString(),
            };

            // If approving payment, advance status to "Accepted"
            if (newPaymentStatus === "Approved") {
                updateData.payment_verified_at = new Date().toISOString();
                if (!currentOrder || currentOrder.status === "Pending Payment Verification") {
                    updateData.status = "Accepted";
                    updateData.accepted_at = new Date().toISOString();
                }
            } else if (newPaymentStatus === "Rejected") {
                // If payment rejected, advance status to "Cancelled"
                updateData.status = "Cancelled";
                updateData.cancelled_at = new Date().toISOString();
            }

            const { error } = await supabase
                .from("orders")
                .update(updateData)
                .eq("id", orderId);

            if (error) throw error;

            // Log activity
            try {
                await supabase.from("activity_logs").insert({
                    order_id: orderId,
                    admin_id: user?.id,
                    action: `Payment ${newPaymentStatus}`,
                    details: { newPaymentStatus, timestamp: new Date().toISOString() },
                });
            } catch (e) {
                console.warn("Activity log insert failed:", e);
            }

            // Immediately update state in table and in active modal
            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, ...updateData } : o))
            );
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder((prev) => (prev ? { ...prev, ...updateData } : null));
            }

            setActionFeedback({
                type: "success",
                message: newPaymentStatus === "Approved" ? "Payment Approved Successfully!" : "Payment Marked as Rejected.",
            });
        } catch (err: any) {
            console.error("Payment status update error:", err);
            setActionFeedback({
                type: "error",
                message: err?.message || "Failed to update payment status.",
            });
        } finally {
            setActionLoading(false);
        }
    };

    const filteredOrders = orders.filter((o) => {
        const numStr = o.order_number ? `#${o.order_number}` : "";
        const matchesSearch =
            numStr.includes(searchQuery) ||
            o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            o.customer_phone.includes(searchQuery) ||
            o.utr.includes(searchQuery);

        const matchesStatus = statusFilter === "ALL" || o.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    return (
        <div className={styles.container}>
            {/* Header Toolbar */}
            <div className={styles.headerRow}>
                <div className={styles.titleArea}>
                    <h1 className={styles.title}>
                        Orders Management
                    </h1>
                    <p className={styles.subtitle}>
                        Manage incoming orders, UTR verification, audit logs, and realtime notifications.
                    </p>
                </div>

                <div className={styles.headerActions}>
                    {/* Audio Toggle Button */}
                    <button
                        type="button"
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        className={`${styles.actionBtn} ${soundEnabled ? styles.audioActive : ""}`}
                    >
                        <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeMute} />
                        {soundEnabled ? "Chime On" : "Chime Off"}
                    </button>

                    {/* Web Notification Permission Button */}
                    {notifPermission !== "granted" && (
                        <button
                            type="button"
                            onClick={requestWebNotification}
                            className={`${styles.actionBtn} ${styles.alertActive}`}
                        >
                            <FontAwesomeIcon icon={faBell} /> Enable Alerts
                        </button>
                    )}

                    <button
                        type="button"
                        onClick={() => fetchOrders(true)}
                        className={styles.actionBtn}
                    >
                        <FontAwesomeIcon icon={faSync} /> Refresh
                    </button>
                </div>
            </div>

            {/* Urgent Persistent Alert Banner for unaccepted orders */}
            {hasPendingAlert && (
                <div className={styles.urgentBanner}>
                    <div className={styles.urgentLeft}>
                        <FontAwesomeIcon icon={faExclamationTriangle} className={styles.urgentIcon} />
                        <div>
                            <div className={styles.urgentTitle}>
                                🚨 {unhandledOrders.length} NEW ORDER{unhandledOrders.length > 1 ? "S" : ""} AWAITING APPROVAL / REJECTION!
                            </div>
                            <div className={styles.urgentSub}>
                                Latest: #{unhandledOrders[0].order_number || unhandledOrders[0].id.slice(0, 6)} ({unhandledOrders[0].customer_name} • ₹{unhandledOrders[0].total}) • UTR: {unhandledOrders[0].utr}
                                <span style={{ marginLeft: "8px", fontWeight: 700, color: "var(--accent)" }}>
                                    (Alert siren will ring until you Accept or Reject this order)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className={styles.urgentActions}>
                        <button
                            type="button"
                            onClick={() => updatePaymentStatus(unhandledOrders[0].id, "Approved")}
                            disabled={actionLoading}
                            className={styles.approveUrgentBtn}
                        >
                            ✓ Approve #{unhandledOrders[0].order_number || unhandledOrders[0].id.slice(0, 5)}
                        </button>
                        <button
                            type="button"
                            onClick={() => setSelectedOrder(unhandledOrders[0])}
                            className={styles.reviewUrgentBtn}
                        >
                            Review Order
                        </button>
                        <button
                            type="button"
                            onClick={() => setSilencedOrderIds(orders.map((o) => o.id))}
                            title="Silence alarm for all currently pending orders"
                            className={styles.actionBtn}
                        >
                            <FontAwesomeIcon icon={faVolumeMute} /> Silence Alarm
                        </button>
                        <button
                            type="button"
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            className={styles.actionBtn}
                        >
                            <FontAwesomeIcon icon={soundEnabled ? faVolumeMute : faVolumeHigh} />
                            {soundEnabled ? "Mute All" : "Unmute"}
                        </button>
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div className={styles.toolbar}>
                <div className={styles.searchWrap}>
                    <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                    <input
                        type="text"
                        placeholder="Search by #1001, Name, Phone, UTR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className={styles.searchInput}
                    />
                </div>

                <div className={styles.filterWrap}>
                    <FontAwesomeIcon icon={faFilter} style={{ color: "var(--muted)" }} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className={styles.filterSelect}
                    >
                        <option value="ALL">All Statuses</option>
                        <option value="Pending Payment Verification">Pending Payment</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Preparing">Preparing</option>
                        <option value="Ready For Pickup">Ready For Pickup</option>
                        <option value="Delivered">Delivered</option>
                        <option value="Cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            {/* Orders Table */}
            {loading ? (
                <p style={{ color: "var(--muted)" }}>Loading orders…</p>
            ) : filteredOrders.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "var(--muted)", backgroundColor: "var(--card)", borderRadius: "var(--radius-lg)", border: "1px solid var(--border)" }}>
                    No matching orders found.
                </div>
            ) : (
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Order No</th>
                                <th className={styles.th}>Date/Time</th>
                                <th className={styles.th}>Customer</th>
                                <th className={styles.th}>Method</th>
                                <th className={styles.th}>UTR / Ref</th>
                                <th className={styles.th}>Payment</th>
                                <th className={styles.th}>Status</th>
                                <th className={styles.th}>Total</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((o) => (
                                <tr key={o.id} className={styles.tr}>
                                    <td className={styles.td}>
                                        <span className={styles.orderNum}>
                                            #{o.order_number || o.id.slice(0, 6)}
                                        </span>
                                    </td>
                                    <td className={styles.td} style={{ fontSize: "12px", color: "var(--muted)" }}>
                                        {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                                    </td>
                                    <td className={styles.td}>
                                        <div className={styles.custName}>{o.customer_name}</div>
                                        <div className={styles.custPhone}>{o.customer_phone}</div>
                                    </td>
                                    <td className={styles.td}>
                                        <span className={styles.methodPill}>{o.delivery_method}</span>
                                    </td>
                                    <td className={styles.td} style={{ fontFamily: "monospace", fontSize: "13px", color: "var(--muted)" }}>
                                        {o.utr}
                                    </td>
                                    <td className={styles.td}>
                                        <span
                                            className={
                                                o.payment_status === "Approved"
                                                    ? styles.badgeSuccess
                                                    : o.payment_status === "Rejected"
                                                    ? styles.badgeDanger
                                                    : styles.badgePending
                                            }
                                        >
                                            {o.payment_status}
                                        </span>
                                    </td>
                                    <td className={styles.td} style={{ fontWeight: 600 }}>
                                        {o.status}
                                    </td>
                                    <td className={`${styles.td} ${styles.tableTotal}`}>
                                        ₹{o.total}
                                    </td>
                                    <td className={styles.td}>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            {o.status === "Pending Payment Verification" && o.payment_status === "Pending" && (
                                                <button
                                                    type="button"
                                                    onClick={() => updatePaymentStatus(o.id, "Approved")}
                                                    title="Quick Approve Payment and Accept Order"
                                                    className={styles.quickApproveBtn}
                                                >
                                                    ✓ Approve
                                                </button>
                                            )}
                                            <button
                                                type="button"
                                                onClick={() => setSelectedOrder(o)}
                                                className={styles.tableBtn}
                                            >
                                                Manage
                                            </button>
                                            {o.status === "Pending Payment Verification" && !silencedOrderIds.includes(o.id) && (
                                                <button
                                                    type="button"
                                                    onClick={() => setSilencedOrderIds(prev => [...prev, o.id])}
                                                    title="Mute siren for this specific order"
                                                    style={{
                                                        padding: "6px 8px",
                                                        backgroundColor: "var(--card)",
                                                        color: "var(--muted)",
                                                        border: "1px solid var(--border-strong)",
                                                        borderRadius: "var(--radius-xs)",
                                                        fontWeight: "600",
                                                        cursor: "pointer",
                                                        fontSize: "11px",
                                                    }}
                                                >
                                                    <FontAwesomeIcon icon={faVolumeMute} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Selected Order Detail Modal */}
            {selectedOrder && (
                <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="modal-order-title">
                    <div className={styles.modalCard}>
                        {/* Modal Header */}
                        <div className={styles.modalHeader}>
                            <div>
                                <h2 id="modal-order-title" className={styles.modalTitle}>
                                    Order #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                                </h2>
                                <div className={styles.modalSub}>
                                    Placed on: {new Date(selectedOrder.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                </div>
                                {selectedOrder.status === "Pending Payment Verification" && selectedOrder.payment_status === "Pending" && (
                                    <div style={{
                                        marginTop: "8px",
                                        padding: "6px 10px",
                                        backgroundColor: "var(--danger-soft)",
                                        border: "1px solid var(--danger)",
                                        borderRadius: "6px",
                                        color: "var(--danger)",
                                        fontSize: "11px",
                                        fontWeight: "700",
                                        display: "inline-flex",
                                        alignItems: "center",
                                        gap: "6px"
                                    }}>
                                        <FontAwesomeIcon icon={faExclamationTriangle} />
                                        <span>Awaiting Action: Approve or Reject payment below to clear alert</span>
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => {
                                    setSelectedOrder(null);
                                    setActionFeedback(null);
                                }}
                                className={styles.modalCloseBtn}
                                aria-label="Close modal"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        {/* Action Feedback Banner */}
                        {actionFeedback && (
                            <div className={`${styles.modalFeedback} ${actionFeedback.type === "success" ? styles.modalFeedbackSuccess : styles.modalFeedbackDanger}`}>
                                <FontAwesomeIcon icon={actionFeedback.type === "success" ? faCheckCircle : faExclamationTriangle} />
                                <span>{actionFeedback.message}</span>
                            </div>
                        )}

                        {/* Customer Info Card */}
                        <div className={styles.modalSectionCard}>
                            <div className={styles.modalCustomerTop}>
                                <div>
                                    <div className={styles.modalCustomerName}>
                                        {selectedOrder.customer_name}
                                    </div>
                                    <div className={styles.modalCustomerAddress}>
                                        Address: {selectedOrder.customer_address || "None provided"}
                                    </div>
                                    <div className={styles.modalDeliveryTag}>
                                        Delivery Method: <span className={styles.modalDeliveryMethodBadge}>{selectedOrder.delivery_method}</span>
                                    </div>
                                </div>
                                <div className={styles.modalContactActions}>
                                    <a
                                        href={`tel:+${selectedOrder.customer_phone.replace(/[^0-9]/g, "")}`}
                                        className={styles.modalCallBtn}
                                    >
                                        <FontAwesomeIcon icon={faPhone} /> Call
                                    </a>
                                    <a
                                        href={buildCustomerWhatsAppUrl(selectedOrder)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className={styles.modalWhatsappBtn}
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* UTR Verification & Payment Management Card */}
                        <div className={styles.modalSectionCard}>
                            <div className={styles.modalUtrTop}>
                                <div>
                                    <div className={styles.modalUtrLabel}>Transaction ID (UTR / Ref):</div>
                                    <div className={styles.modalUtrRow}>
                                        <span className={styles.modalUtrCode}>
                                            {selectedOrder.utr}
                                        </span>
                                        <button
                                            onClick={() => handleCopyUtr(selectedOrder.utr)}
                                            className={styles.modalCopyBtn}
                                        >
                                            <FontAwesomeIcon icon={copiedUtr ? faCheck : faCopy} /> {copiedUtr ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Current Payment Status Badge */}
                                <div className={selectedOrder.payment_status === "Approved" ? styles.badgeSuccess : selectedOrder.payment_status === "Rejected" ? styles.badgeDanger : styles.badgePending}>
                                    {selectedOrder.payment_status === "Approved" && "✓ Payment: Approved"}
                                    {selectedOrder.payment_status === "Rejected" && "✕ Payment: Rejected"}
                                    {selectedOrder.payment_status === "Pending" && "⏳ Payment: Pending Verification"}
                                </div>
                            </div>

                            {/* Payment Role Action Buttons */}
                            <div className={styles.paymentActionGrid}>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Approved")}
                                    disabled={actionLoading}
                                    className={selectedOrder.payment_status === "Approved" ? styles.paymentApproveBtn : styles.paymentApproveBtnOutline}
                                >
                                    <FontAwesomeIcon icon={actionLoading ? faSpinner : faCheck} spin={actionLoading} />
                                    {selectedOrder.payment_status === "Approved" ? "Payment Approved ✓" : "Approve Payment"}
                                </button>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Rejected")}
                                    disabled={actionLoading}
                                    className={selectedOrder.payment_status === "Rejected" ? styles.paymentRejectBtn : styles.paymentRejectBtnOutline}
                                >
                                    <FontAwesomeIcon icon={actionLoading ? faSpinner : faTimes} spin={actionLoading} />
                                    {selectedOrder.payment_status === "Rejected" ? "Payment Rejected ✕" : "Reject Payment"}
                                </button>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className={styles.modalSectionCard}>
                            <div className={styles.itemsHeader}>
                                Order Items ({(selectedOrder.order_items || []).length}):
                            </div>
                            {selectedOrder.order_items && selectedOrder.order_items.map((item) => (
                                <div key={item.id} className={styles.itemLine}>
                                    <span>
                                        {item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}
                                    </span>
                                    <span style={{ fontWeight: "700" }}>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div className={styles.itemTotalLine}>
                                <span>Total Payable</span>
                                <span className={styles.itemTotalAmount}>₹{selectedOrder.total}</span>
                            </div>
                        </div>

                        {/* Status Change Controls */}
                        <div className={styles.modalSectionCard}>
                            <div className={styles.statusSectionHeader}>
                                <div className={styles.statusSectionTitle}>
                                    Update Order Status:
                                </div>
                                <span className={styles.statusSectionHint}>Click to update live tracking</span>
                            </div>

                            <div className={styles.statusGrid}>
                                {(["Pending Payment Verification", "Accepted", "Preparing", "Ready For Pickup", "Delivered", "Cancelled"] as OrderStatus[]).map((status) => {
                                    const isCurrent = selectedOrder.status === status;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            disabled={actionLoading}
                                            className={isCurrent ? styles.statusOptionBtnActive : styles.statusOptionBtn}
                                        >
                                            {isCurrent && <FontAwesomeIcon icon={faCheckCircle} />}
                                            {status}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Contextual WhatsApp Quick Action based on current status */}
                            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid var(--border)" }}>
                                <a
                                    href={buildCustomerWhatsAppUrl(selectedOrder)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className={styles.whatsappWideLink}
                                >
                                    <FontAwesomeIcon icon={faWhatsapp} />
                                    <span>
                                        {selectedOrder.status === "Ready For Pickup" && "📲 WhatsApp Customer: Order Ready For Pickup!"}
                                        {selectedOrder.status === "Accepted" && "📲 WhatsApp Customer: Order Accepted by Kitchen!"}
                                        {selectedOrder.status === "Delivered" && "📲 WhatsApp Customer: Thank You Message!"}
                                        {selectedOrder.status === "Preparing" && "📲 WhatsApp Customer: Food is Being Prepared!"}
                                        {selectedOrder.status === "Pending Payment Verification" && "📲 WhatsApp Customer: Send Payment Reminder"}
                                        {selectedOrder.status === "Cancelled" && "📲 WhatsApp Customer: Order Cancellation Note"}
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
