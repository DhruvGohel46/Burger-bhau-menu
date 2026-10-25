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
            text = `Hi ${order.customer_name}! Your Burger Bhau Order #${order.order_number || order.id.slice(0, 6)} is FRESH & READY FOR PICKUP at our counter! 🍔 Pickup location: Rolex Road, Kothariya, Rajkot. See you soon!`;
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
        <div>
            {/* Header Toolbar */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
                <div>
                    <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                        Orders Management
                    </h1>
                    <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                        Manage incoming orders, UTR verification, audit logs, and realtime notifications.
                    </p>
                </div>

                <div style={{ display: "flex", gap: "10px" }}>
                    {/* Audio Toggle Button */}
                    <button
                        onClick={() => setSoundEnabled(!soundEnabled)}
                        style={{
                            padding: "10px 14px",
                            backgroundColor: soundEnabled ? "rgba(40,167,69,0.15)" : "#222",
                            border: `1px solid ${soundEnabled ? "#28a745" : "#444"}`,
                            borderRadius: "8px",
                            color: soundEnabled ? "#5dd579" : "#aaa",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "6px",
                        }}
                    >
                        <FontAwesomeIcon icon={soundEnabled ? faVolumeHigh : faVolumeMute} />
                        {soundEnabled ? "Chime On" : "Chime Off"}
                    </button>

                    {/* Web Notification Permission Button */}
                    {notifPermission !== "granted" && (
                        <button
                            onClick={requestWebNotification}
                            style={{
                                padding: "10px 14px",
                                backgroundColor: "rgba(255,140,0,0.15)",
                                border: "1px solid #ff8c00",
                                borderRadius: "8px",
                                color: "#ff8c00",
                                fontSize: "13px",
                                fontWeight: "700",
                                cursor: "pointer",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <FontAwesomeIcon icon={faBell} /> Enable Alerts
                        </button>
                    )}

                    <button
                        onClick={() => fetchOrders(true)}
                        style={{
                            padding: "10px 16px",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            color: "#ff8c00",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                        }}
                    >
                        <FontAwesomeIcon icon={faSync} /> Refresh
                    </button>
                </div>
            </div>

            {/* Urgent Persistent Alert Banner for unaccepted orders */}
            {hasPendingAlert && (
                <div style={{
                    backgroundColor: "rgba(220, 53, 69, 0.95)",
                    border: "2px solid #ff4444",
                    borderRadius: "14px",
                    padding: "16px 20px",
                    marginBottom: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    flexWrap: "wrap",
                    gap: "14px",
                    boxShadow: "0 0 25px rgba(220, 53, 69, 0.55)",
                    color: "#fff",
                }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                        <FontAwesomeIcon icon={faExclamationTriangle} style={{ fontSize: "30px", color: "#ffe082" }} />
                        <div>
                            <div style={{ fontSize: "16px", fontWeight: "800", letterSpacing: "0.5px" }}>
                                🚨 {unhandledOrders.length} NEW ORDER{unhandledOrders.length > 1 ? "S" : ""} AWAITING APPROVAL / REJECTION!
                            </div>
                            <div style={{ fontSize: "13px", color: "#ffebee", marginTop: "2px" }}>
                                Latest: #{unhandledOrders[0].order_number || unhandledOrders[0].id.slice(0, 6)} ({unhandledOrders[0].customer_name} • ₹{unhandledOrders[0].total}) • UTR: {unhandledOrders[0].utr}
                                <span style={{ marginLeft: "8px", color: "#ffe082", fontWeight: "700" }}>
                                    (Alert siren will ring until you Accept or Reject this order)
                                </span>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: "flex", gap: "10px", alignItems: "center", flexWrap: "wrap" }}>
                        <button
                            onClick={() => updatePaymentStatus(unhandledOrders[0].id, "Approved")}
                            disabled={actionLoading}
                            style={{
                                padding: "10px 16px",
                                backgroundColor: "#28a745",
                                color: "#fff",
                                fontWeight: "800",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                boxShadow: "0 4px 12px rgba(40,167,69,0.35)",
                            }}
                        >
                            ✓ Approve #{unhandledOrders[0].order_number || unhandledOrders[0].id.slice(0, 5)}
                        </button>
                        <button
                            onClick={() => setSelectedOrder(unhandledOrders[0])}
                            style={{
                                padding: "10px 16px",
                                backgroundColor: "#fff",
                                color: "#d32f2f",
                                fontWeight: "800",
                                borderRadius: "8px",
                                border: "none",
                                cursor: "pointer",
                                fontSize: "13px",
                                boxShadow: "0 4px 12px rgba(0,0,0,0.25)",
                            }}
                        >
                            Review Order
                        </button>
                        <button
                            onClick={() => setSilencedOrderIds(orders.map((o) => o.id))}
                            title="Silence alarm for all currently pending orders"
                            style={{
                                padding: "10px 14px",
                                backgroundColor: "rgba(0,0,0,0.4)",
                                color: "#ffe082",
                                fontWeight: "700",
                                borderRadius: "8px",
                                border: "1px solid #ffe082",
                                cursor: "pointer",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <FontAwesomeIcon icon={faVolumeMute} /> Silence Alarm
                        </button>
                        <button
                            onClick={() => setSoundEnabled(!soundEnabled)}
                            style={{
                                padding: "10px 14px",
                                backgroundColor: "rgba(0,0,0,0.35)",
                                color: "#fff",
                                fontWeight: "700",
                                borderRadius: "8px",
                                border: "1px solid rgba(255,255,255,0.4)",
                                cursor: "pointer",
                                fontSize: "12px",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                            }}
                        >
                            <FontAwesomeIcon icon={soundEnabled ? faVolumeMute : faVolumeHigh} />
                            {soundEnabled ? "Mute All" : "Unmute"}
                        </button>
                    </div>
                </div>
            )}

            {/* Filter & Search Bar */}
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "16px",
                marginBottom: "24px",
                backgroundColor: "#141414",
                padding: "16px",
                borderRadius: "14px",
                border: "1px solid #282828",
            }}>
                <div style={{ flex: 1, minWidth: "240px", position: "relative" }}>
                    <FontAwesomeIcon icon={faSearch} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                    <input
                        type="text"
                        placeholder="Search by #1001, Name, Phone, UTR..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px 12px 10px 36px",
                            backgroundColor: "#202020",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "14px",
                            outline: "none",
                        }}
                    />
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <FontAwesomeIcon icon={faFilter} style={{ color: "#aaa" }} />
                    <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        style={{
                            padding: "10px 14px",
                            backgroundColor: "#202020",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            color: "#fff",
                            fontSize: "14px",
                            outline: "none",
                        }}
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
                <p>Loading orders...</p>
            ) : filteredOrders.length === 0 ? (
                <div style={{ padding: "40px", textAlign: "center", color: "#777", backgroundColor: "#141414", borderRadius: "14px" }}>
                    No matching orders found.
                </div>
            ) : (
                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "16px", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #282828", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                                <th style={{ padding: "14px" }}>Order No</th>
                                <th style={{ padding: "14px" }}>Date/Time</th>
                                <th style={{ padding: "14px" }}>Customer</th>
                                <th style={{ padding: "14px" }}>Method</th>
                                <th style={{ padding: "14px" }}>UTR / Ref</th>
                                <th style={{ padding: "14px" }}>Payment</th>
                                <th style={{ padding: "14px" }}>Status</th>
                                <th style={{ padding: "14px" }}>Total</th>
                                <th style={{ padding: "14px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredOrders.map((o) => (
                                <tr key={o.id} style={{ borderBottom: "1px solid #1e1e1e" }}>
                                    <td style={{ padding: "14px", fontWeight: "800", color: "#ff8c00" }}>
                                        #{o.order_number || o.id.slice(0, 6)}
                                    </td>
                                    <td style={{ padding: "14px", fontSize: "12px", color: "#aaa" }}>
                                        {new Date(o.created_at).toLocaleString("en-IN", { dateStyle: "short", timeStyle: "short" })}
                                    </td>
                                    <td style={{ padding: "14px" }}>
                                        <div style={{ fontWeight: "600" }}>{o.customer_name}</div>
                                        <div style={{ fontSize: "12px", color: "#888" }}>{o.customer_phone}</div>
                                    </td>
                                    <td style={{ padding: "14px", textTransform: "capitalize", color: "#ff8c00" }}>{o.delivery_method}</td>
                                    <td style={{ padding: "14px", fontFamily: "monospace", fontSize: "13px", color: "#aaa" }}>{o.utr}</td>
                                    <td style={{ padding: "14px" }}>
                                        <span style={{
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: o.payment_status === "Approved" ? "#28a745" : o.payment_status === "Rejected" ? "#ff4444" : "#ffc107",
                                            backgroundColor: o.payment_status === "Approved" ? "rgba(40,167,69,0.15)" : o.payment_status === "Rejected" ? "rgba(255,68,68,0.15)" : "rgba(255,193,7,0.15)",
                                        }}>
                                            {o.payment_status}
                                        </span>
                                    </td>
                                    <td style={{ padding: "14px", fontWeight: "700", color: "#fff" }}>{o.status}</td>
                                    <td style={{ padding: "14px", fontWeight: "800", color: "#28a745" }}>₹{o.total}</td>
                                    <td style={{ padding: "14px" }}>
                                        <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                                            {o.status === "Pending Payment Verification" && o.payment_status === "Pending" && (
                                                <button
                                                    onClick={() => updatePaymentStatus(o.id, "Approved")}
                                                    title="Quick Approve Payment and Accept Order"
                                                    style={{
                                                        padding: "6px 10px",
                                                        backgroundColor: "#28a745",
                                                        color: "#fff",
                                                        border: "none",
                                                        borderRadius: "6px",
                                                        fontWeight: "800",
                                                        cursor: "pointer",
                                                        fontSize: "11px",
                                                        whiteSpace: "nowrap",
                                                    }}
                                                >
                                                    ✓ Approve
                                                </button>
                                            )}
                                            <button
                                                onClick={() => setSelectedOrder(o)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#ff8c00",
                                                    color: "#000",
                                                    border: "none",
                                                    borderRadius: "6px",
                                                    fontWeight: "700",
                                                    cursor: "pointer",
                                                    fontSize: "12px",
                                                }}
                                            >
                                                Manage
                                            </button>
                                            {o.status === "Pending Payment Verification" && !silencedOrderIds.includes(o.id) && (
                                                <button
                                                    onClick={() => setSilencedOrderIds(prev => [...prev, o.id])}
                                                    title="Mute siren for this specific order"
                                                    style={{
                                                        padding: "6px 8px",
                                                        backgroundColor: "rgba(255,255,255,0.08)",
                                                        color: "#aaa",
                                                        border: "1px solid #444",
                                                        borderRadius: "6px",
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
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0,0,0,0.8)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    zIndex: 1000,
                }}>
                    <div style={{
                        backgroundColor: "#161616",
                        border: "1px solid #333",
                        borderRadius: "16px",
                        padding: "24px",
                        maxWidth: "620px",
                        width: "100%",
                        maxHeight: "92vh",
                        overflowY: "auto",
                        boxShadow: "0 20px 60px rgba(0,0,0,0.8)",
                    }}>
                        {/* Modal Header */}
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                            <div>
                                <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#ff8c00", margin: "0 0 4px 0" }}>
                                    Order #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                                </h2>
                                <div style={{ fontSize: "12px", color: "#aaa" }}>
                                    Placed on: {new Date(selectedOrder.created_at).toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" })}
                                </div>
                                {selectedOrder.status === "Pending Payment Verification" && selectedOrder.payment_status === "Pending" && (
                                    <div style={{
                                        marginTop: "8px",
                                        padding: "6px 10px",
                                        backgroundColor: "rgba(220, 53, 69, 0.2)",
                                        border: "1px solid #dc3545",
                                        borderRadius: "6px",
                                        color: "#ff8080",
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
                            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>

                                <button
                                    onClick={() => {
                                        setSelectedOrder(null);
                                        setActionFeedback(null);
                                    }}
                                    style={{
                                        background: "none",
                                        border: "none",
                                        color: "#aaa",
                                        fontSize: "20px",
                                        cursor: "pointer",
                                        padding: "4px 8px",
                                    }}
                                    aria-label="Close modal"
                                >
                                    <FontAwesomeIcon icon={faTimes} />
                                </button>
                            </div>
                        </div>

                        {/* Action Feedback Banner */}
                        {actionFeedback && (
                            <div style={{
                                padding: "12px 16px",
                                borderRadius: "10px",
                                marginBottom: "16px",
                                fontSize: "13px",
                                fontWeight: "700",
                                display: "flex",
                                alignItems: "center",
                                gap: "10px",
                                backgroundColor: actionFeedback.type === "success" ? "rgba(40, 167, 69, 0.2)" : "rgba(220, 53, 69, 0.2)",
                                border: `1px solid ${actionFeedback.type === "success" ? "#28a745" : "#dc3545"}`,
                                color: actionFeedback.type === "success" ? "#5dd579" : "#ff6b6b",
                            }}>
                                <FontAwesomeIcon icon={actionFeedback.type === "success" ? faCheckCircle : faExclamationTriangle} />
                                <span>{actionFeedback.message}</span>
                            </div>
                        )}

                        {/* Customer Info Card */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "12px", padding: "16px", marginBottom: "16px", border: "1px solid #2d2d2d" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "10px" }}>
                                <div>
                                    <div style={{ fontWeight: "800", color: "#fff", fontSize: "15px", marginBottom: "4px" }}>
                                        {selectedOrder.customer_name}
                                    </div>
                                    <div style={{ color: "#aaa", fontSize: "13px", marginBottom: "6px" }}>
                                        Address: {selectedOrder.customer_address || "None provided"}
                                    </div>
                                    <div style={{ color: "#ff8c00", fontSize: "12px", fontWeight: "700" }}>
                                        Delivery Method: <span style={{ textTransform: "uppercase", backgroundColor: "rgba(255, 140, 0, 0.15)", padding: "2px 8px", borderRadius: "4px" }}>{selectedOrder.delivery_method}</span>
                                    </div>
                                </div>
                                <div style={{ display: "flex", gap: "8px" }}>
                                    <a
                                        href={`tel:+${selectedOrder.customer_phone.replace(/[^0-9]/g, "")}`}
                                        style={{
                                            padding: "8px 12px",
                                            backgroundColor: "rgba(255, 255, 255, 0.08)",
                                            border: "1px solid #444",
                                            borderRadius: "8px",
                                            color: "#fff",
                                            textDecoration: "none",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faPhone} /> Call
                                    </a>
                                    <a
                                        href={buildCustomerWhatsAppUrl(selectedOrder)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        style={{
                                            padding: "8px 12px",
                                            backgroundColor: "rgba(37, 211, 102, 0.15)",
                                            border: "1px solid #25d366",
                                            borderRadius: "8px",
                                            color: "#25d366",
                                            textDecoration: "none",
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                                    </a>
                                </div>
                            </div>
                        </div>

                        {/* UTR Verification & Payment Management Card */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "12px", padding: "16px", marginBottom: "16px", border: "1px solid #2d2d2d" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px", flexWrap: "wrap", gap: "10px" }}>
                                <div>
                                    <div style={{ fontSize: "12px", color: "#aaa" }}>Transaction ID (UTR / Ref):</div>
                                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "2px" }}>
                                        <span style={{ fontFamily: "monospace", fontSize: "15px", fontWeight: "700", color: "#fff", wordBreak: "break-all" }}>
                                            {selectedOrder.utr}
                                        </span>
                                        <button
                                            onClick={() => handleCopyUtr(selectedOrder.utr)}
                                            style={{
                                                background: "none",
                                                border: "1px solid #444",
                                                color: copiedUtr ? "#28a745" : "#aaa",
                                                borderRadius: "4px",
                                                padding: "2px 6px",
                                                fontSize: "11px",
                                                cursor: "pointer",
                                            }}
                                        >
                                            <FontAwesomeIcon icon={copiedUtr ? faCheck : faCopy} /> {copiedUtr ? "Copied!" : "Copy"}
                                        </button>
                                    </div>
                                </div>

                                {/* Current Payment Status Badge */}
                                <div style={{
                                    padding: "6px 12px",
                                    borderRadius: "8px",
                                    fontSize: "12px",
                                    fontWeight: "800",
                                    color: selectedOrder.payment_status === "Approved" ? "#28a745" : selectedOrder.payment_status === "Rejected" ? "#ff4444" : "#ffc107",
                                    backgroundColor: selectedOrder.payment_status === "Approved" ? "rgba(40,167,69,0.15)" : selectedOrder.payment_status === "Rejected" ? "rgba(255,68,68,0.15)" : "rgba(255,193,7,0.15)",
                                    border: `1px solid ${selectedOrder.payment_status === "Approved" ? "#28a745" : selectedOrder.payment_status === "Rejected" ? "#ff4444" : "#ffc107"}`,
                                }}>
                                    {selectedOrder.payment_status === "Approved" && "✓ Payment: Approved"}
                                    {selectedOrder.payment_status === "Rejected" && "✕ Payment: Rejected"}
                                    {selectedOrder.payment_status === "Pending" && "⏳ Payment: Pending Verification"}
                                </div>
                            </div>

                            {/* Payment Role Action Buttons */}
                            <div style={{ display: "flex", gap: "10px" }}>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Approved")}
                                    disabled={actionLoading}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        backgroundColor: selectedOrder.payment_status === "Approved" ? "#28a745" : "rgba(40, 167, 69, 0.2)",
                                        border: `2px solid ${selectedOrder.payment_status === "Approved" ? "#5dd579" : "#28a745"}`,
                                        color: selectedOrder.payment_status === "Approved" ? "#000" : "#5dd579",
                                        borderRadius: "8px",
                                        fontWeight: "800",
                                        fontSize: "13px",
                                        cursor: actionLoading ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxShadow: selectedOrder.payment_status === "Approved" ? "0 0 12px rgba(40,167,69,0.4)" : "none",
                                    }}
                                >
                                    <FontAwesomeIcon icon={actionLoading ? faSpinner : faCheck} spin={actionLoading} />
                                    {selectedOrder.payment_status === "Approved" ? "Payment Approved ✓" : "Approve Payment"}
                                </button>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Rejected")}
                                    disabled={actionLoading}
                                    style={{
                                        flex: 1,
                                        padding: "10px",
                                        backgroundColor: selectedOrder.payment_status === "Rejected" ? "#dc3545" : "rgba(220, 53, 69, 0.2)",
                                        border: `2px solid ${selectedOrder.payment_status === "Rejected" ? "#ff6b6b" : "#dc3545"}`,
                                        color: selectedOrder.payment_status === "Rejected" ? "#fff" : "#ff6b6b",
                                        borderRadius: "8px",
                                        fontWeight: "800",
                                        fontSize: "13px",
                                        cursor: actionLoading ? "not-allowed" : "pointer",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxShadow: selectedOrder.payment_status === "Rejected" ? "0 0 12px rgba(220,53,69,0.4)" : "none",
                                    }}
                                >
                                    <FontAwesomeIcon icon={actionLoading ? faSpinner : faTimes} spin={actionLoading} />
                                    {selectedOrder.payment_status === "Rejected" ? "Payment Rejected ✕" : "Reject Payment"}
                                </button>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "12px", padding: "16px", marginBottom: "16px", border: "1px solid #2d2d2d" }}>
                            <div style={{ fontSize: "13px", fontWeight: "800", color: "#aaa", marginBottom: "8px", textTransform: "uppercase" }}>
                                Order Items ({(selectedOrder.order_items || []).length}):
                            </div>
                            {selectedOrder.order_items && selectedOrder.order_items.map((item) => (
                                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px", color: "#fff" }}>
                                    <span>
                                        {item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}
                                    </span>
                                    <span style={{ fontWeight: "700" }}>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: "1px solid #333", paddingTop: "10px", marginTop: "10px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "16px" }}>
                                <span style={{ color: "#fff" }}>Total Payable</span>
                                <span style={{ color: "#28a745", fontSize: "18px" }}>₹{selectedOrder.total}</span>
                            </div>
                        </div>

                        {/* Status Change Controls */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "12px", padding: "16px", border: "1px solid #2d2d2d" }}>
                            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px" }}>
                                <div style={{ fontSize: "14px", fontWeight: "800", color: "#fff" }}>
                                    Update Order Status:
                                </div>
                                <span style={{ fontSize: "11px", color: "#aaa" }}>Click to update live tracking</span>
                            </div>

                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                                {(["Pending Payment Verification", "Accepted", "Preparing", "Ready For Pickup", "Delivered", "Cancelled"] as OrderStatus[]).map((status) => {
                                    const isCurrent = selectedOrder.status === status;
                                    return (
                                        <button
                                            key={status}
                                            onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                            disabled={actionLoading}
                                            style={{
                                                padding: "12px 10px",
                                                backgroundColor: isCurrent ? "#ff8c00" : "#262626",
                                                color: isCurrent ? "#000" : "#fff",
                                                border: `2px solid ${isCurrent ? "#ff8c00" : "#383838"}`,
                                                borderRadius: "10px",
                                                fontWeight: isCurrent ? "800" : "600",
                                                fontSize: "12px",
                                                cursor: actionLoading ? "not-allowed" : "pointer",
                                                transition: "all 0.15s ease",
                                                boxShadow: isCurrent ? "0 0 16px rgba(255,140,0,0.4)" : "none",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                gap: "6px",
                                            }}
                                        >
                                            {isCurrent && <FontAwesomeIcon icon={faCheckCircle} />}
                                            {status}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Contextual WhatsApp Quick Action based on current status */}
                            <div style={{ marginTop: "14px", paddingTop: "12px", borderTop: "1px solid #333" }}>
                                <a
                                    href={buildCustomerWhatsAppUrl(selectedOrder)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    style={{
                                        width: "100%",
                                        padding: "10px",
                                        backgroundColor: "rgba(37, 211, 102, 0.15)",
                                        border: "1px solid #25d366",
                                        borderRadius: "8px",
                                        color: "#25d366",
                                        textDecoration: "none",
                                        fontSize: "13px",
                                        fontWeight: "700",
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        gap: "8px",
                                        boxSizing: "border-box",
                                    }}
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
