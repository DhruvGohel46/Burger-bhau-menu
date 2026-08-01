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
} from "@fortawesome/free-solid-svg-icons";

// Web Audio API Chime Synthesizer
function playOrderChimeSound() {
    try {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = "sine";
        osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.15); // A5

        gain.gain.setValueAtTime(0.3, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start();
        osc.stop(ctx.currentTime + 0.6);
    } catch (e) {
        console.error("Audio error:", e);
    }
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
    }, []);

    const fetchOrders = async () => {
        setLoading(true);
        const { data } = await supabase
            .from("orders")
            .select("*, order_items(*)")
            .order("created_at", { ascending: false });

        if (data) {
            setOrders(data as Order[]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOrders();

        // Subscribe to Realtime inserts & updates
        const channel = supabase
            .channel("admin-orders-live")
            .on(
                "postgres_changes",
                { event: "INSERT", schema: "public", table: "orders" },
                (payload) => {
                    const newOrder = payload.new as Order;
                    if (soundEnabled) playOrderChimeSound();

                    if ("Notification" in window && Notification.permission === "granted") {
                        new Notification("🍔 NEW ORDER RECEIVED!", {
                            body: `Order #${newOrder.order_number || "New"} - Total ₹${newOrder.total} by ${newOrder.customer_name}`,
                            icon: "/BURGER-BHAU-logo.webp",
                        });
                    }
                    fetchOrders();
                }
            )
            .on(
                "postgres_changes",
                { event: "UPDATE", schema: "public", table: "orders" },
                () => {
                    fetchOrders();
                }
            )
            .subscribe();

        return () => {
            supabase.removeChannel(channel);
        };
    }, [soundEnabled]);

    const updateOrderStatus = async (orderId: string, newStatus: OrderStatus) => {
        const timestampMap: Record<string, string> = {
            updated_at: new Date().toISOString(),
        };

        if (newStatus === "Payment Verified") timestampMap.payment_verified_at = new Date().toISOString();
        if (newStatus === "Accepted") timestampMap.accepted_at = new Date().toISOString();
        if (newStatus === "Preparing") timestampMap.preparing_at = new Date().toISOString();
        if (newStatus === "Ready For Pickup") timestampMap.ready_at = new Date().toISOString();
        if (newStatus === "Cancelled") timestampMap.cancelled_at = new Date().toISOString();

        const { error } = await supabase
            .from("orders")
            .update({ status: newStatus, ...timestampMap })
            .eq("id", orderId);

        if (!error) {
            // Write Audit Log into activity_logs table
            await supabase.from("activity_logs").insert({
                order_id: orderId,
                admin_id: user?.id,
                action: `Updated Status to ${newStatus}`,
                details: { newStatus, timestamp: new Date().toISOString() },
            });

            setOrders((prev) =>
                prev.map((o) => (o.id === orderId ? { ...o, status: newStatus, ...timestampMap } : o))
            );
            if (selectedOrder && selectedOrder.id === orderId) {
                setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus, ...timestampMap } : null));
            }
        }
    };

    const updatePaymentStatus = async (orderId: string, newPaymentStatus: PaymentStatus) => {
        const updateData: any = {
            payment_status: newPaymentStatus,
            updated_at: new Date().toISOString(),
        };
        if (newPaymentStatus === "Approved") {
            updateData.status = "Payment Verified";
            updateData.payment_verified_at = new Date().toISOString();
        }

        const { error } = await supabase
            .from("orders")
            .update(updateData)
            .eq("id", orderId);

        if (!error) {
            // Write Audit Log
            await supabase.from("activity_logs").insert({
                order_id: orderId,
                admin_id: user?.id,
                action: `Payment ${newPaymentStatus}`,
                details: { newPaymentStatus, timestamp: new Date().toISOString() },
            });

            fetchOrders();
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
                        onClick={fetchOrders}
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
                        <option value="Payment Verified">Payment Verified</option>
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
                        padding: "28px",
                        maxWidth: "600px",
                        width: "100%",
                        maxHeight: "90vh",
                        overflowY: "auto",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#ff8c00", margin: 0 }}>
                                Order #{selectedOrder.order_number || selectedOrder.id.slice(0, 8)}
                            </h2>
                            <button onClick={() => setSelectedOrder(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: "20px", cursor: "pointer" }}>✕</button>
                        </div>

                        {/* Customer Info */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "10px", padding: "14px", marginBottom: "16px", fontSize: "14px" }}>
                            <div style={{ fontWeight: "700", color: "#fff", marginBottom: "4px" }}>{selectedOrder.customer_name} ({selectedOrder.customer_phone})</div>
                            <div style={{ color: "#aaa", fontSize: "13px" }}>Address: {selectedOrder.customer_address}</div>
                            <div style={{ color: "#ff8c00", fontSize: "13px", marginTop: "4px" }}>Delivery Method: <strong style={{ textTransform: "capitalize" }}>{selectedOrder.delivery_method}</strong></div>
                        </div>

                        {/* UTR Verification */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "10px", padding: "14px", marginBottom: "16px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                            <div>
                                <div style={{ fontSize: "12px", color: "#aaa" }}>Transaction UTR:</div>
                                <div style={{ fontFamily: "monospace", fontSize: "16px", fontWeight: "700", color: "#fff" }}>{selectedOrder.utr}</div>
                            </div>
                            <div style={{ display: "flex", gap: "8px" }}>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Approved")}
                                    style={{ padding: "8px 12px", backgroundColor: "#28a745", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                                >
                                    Approve Payment
                                </button>
                                <button
                                    onClick={() => updatePaymentStatus(selectedOrder.id, "Rejected")}
                                    style={{ padding: "8px 12px", backgroundColor: "#dc3545", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "700", fontSize: "12px", cursor: "pointer" }}
                                >
                                    Reject Payment
                                </button>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div style={{ backgroundColor: "#202020", borderRadius: "10px", padding: "14px", marginBottom: "20px" }}>
                            <div style={{ fontSize: "13px", fontWeight: "700", color: "#aaa", marginBottom: "8px" }}>Items:</div>
                            {selectedOrder.order_items && selectedOrder.order_items.map((item) => (
                                <div key={item.id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", marginBottom: "6px" }}>
                                    <span>{item.quantity}x {item.name} {item.variant_label ? `(${item.variant_label})` : ""}</span>
                                    <span>₹{item.price * item.quantity}</span>
                                </div>
                            ))}
                            <div style={{ borderTop: "1px solid #333", paddingTop: "8px", marginTop: "8px", display: "flex", justifyContent: "space-between", fontWeight: "800", fontSize: "16px" }}>
                                <span>Total</span>
                                <span style={{ color: "#28a745" }}>₹{selectedOrder.total}</span>
                            </div>
                        </div>

                        {/* Status Change Controls */}
                        <div style={{ fontSize: "14px", fontWeight: "700", color: "#fff", marginBottom: "10px" }}>Update Order Status:</div>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                            {(["Pending Payment Verification", "Payment Verified", "Accepted", "Preparing", "Ready For Pickup", "Delivered", "Cancelled"] as OrderStatus[]).map((status) => (
                                <button
                                    key={status}
                                    onClick={() => updateOrderStatus(selectedOrder.id, status)}
                                    style={{
                                        padding: "10px",
                                        backgroundColor: selectedOrder.status === status ? "#ff8c00" : "#262626",
                                        color: selectedOrder.status === status ? "#000" : "#fff",
                                        border: "1px solid #444",
                                        borderRadius: "8px",
                                        fontWeight: "700",
                                        fontSize: "12px",
                                        cursor: "pointer",
                                    }}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
