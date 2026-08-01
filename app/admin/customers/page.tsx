"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile, Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faUser, faPhone, faMapMarkerAlt, faShoppingBag } from "@fortawesome/free-solid-svg-icons";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<UserProfile[]>([]);
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCustomer, setSelectedCustomer] = useState<UserProfile | null>(null);

    useEffect(() => {
        async function loadCustomersAndOrders() {
            setLoading(true);

            const { data: profData } = await supabase.from("profiles").select("*");
            if (profData) {
                setCustomers(profData as UserProfile[]);
            }

            const { data: orderData } = await supabase.from("orders").select("*, order_items(*)");
            if (orderData) {
                setOrders(orderData as Order[]);
            }

            setLoading(false);
        }

        loadCustomersAndOrders();
    }, []);

    const filteredCustomers = customers.filter(
        (c) =>
            c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            c.phone.includes(searchQuery)
    );

    const getCustomerStats = (customerId: string) => {
        const customerOrders = orders.filter((o) => o.customer_id === customerId);
        const totalSpent = customerOrders
            .filter((o) => o.status === "Delivered" || o.payment_status === "Approved")
            .reduce((sum, o) => sum + o.total, 0);

        return {
            totalOrders: customerOrders.length,
            totalSpent,
            customerOrders,
        };
    };

    return (
        <div>
            <div style={{ marginBottom: "24px" }}>
                <h1 style={{ fontSize: "28px", fontWeight: "800", margin: 0, color: "#fff" }}>
                    Customer Directory
                </h1>
                <p style={{ fontSize: "14px", color: "#888", marginTop: "4px" }}>
                    Registered customer profiles, order history, and spending summaries.
                </p>
            </div>

            {/* Search Bar */}
            <div style={{ marginBottom: "24px", position: "relative", maxWidth: "400px" }}>
                <FontAwesomeIcon icon={faSearch} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#666" }} />
                <input
                    type="text"
                    placeholder="Search customers by name, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                        width: "100%",
                        padding: "10px 12px 10px 36px",
                        backgroundColor: "#161616",
                        border: "1px solid #333",
                        borderRadius: "8px",
                        color: "#fff",
                        fontSize: "14px",
                        outline: "none",
                    }}
                />
            </div>

            {loading ? (
                <p>Loading customers...</p>
            ) : filteredCustomers.length === 0 ? (
                <p style={{ color: "#888" }}>No customer records found.</p>
            ) : (
                <div style={{ backgroundColor: "#141414", border: "1px solid #282828", borderRadius: "16px", overflowX: "auto" }}>
                    <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "14px" }}>
                        <thead>
                            <tr style={{ borderBottom: "1px solid #282828", color: "#888", fontSize: "12px", textTransform: "uppercase" }}>
                                <th style={{ padding: "14px" }}>Name</th>
                                <th style={{ padding: "14px" }}>Email</th>
                                <th style={{ padding: "14px" }}>Phone</th>
                                <th style={{ padding: "14px" }}>Role</th>
                                <th style={{ padding: "14px" }}>Total Orders</th>
                                <th style={{ padding: "14px" }}>Total Spending</th>
                                <th style={{ padding: "14px" }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((c) => {
                                const { totalOrders, totalSpent } = getCustomerStats(c.id);
                                return (
                                    <tr key={c.id} style={{ borderBottom: "1px solid #1e1e1e" }}>
                                        <td style={{ padding: "14px", fontWeight: "700" }}>{c.name || "N/A"}</td>
                                        <td style={{ padding: "14px", color: "#aaa" }}>{c.email}</td>
                                        <td style={{ padding: "14px" }}>{c.phone || "N/A"}</td>
                                        <td style={{ padding: "14px" }}>
                                            <span style={{
                                                padding: "4px 8px",
                                                borderRadius: "6px",
                                                fontSize: "11px",
                                                fontWeight: "700",
                                                color: c.role === "admin" ? "#ff8c00" : "#aaa",
                                                backgroundColor: c.role === "admin" ? "rgba(255,140,0,0.15)" : "#222",
                                                border: `1px solid ${c.role === "admin" ? "#ff8c00" : "#333"}`,
                                            }}>
                                                {c.role}
                                            </span>
                                        </td>
                                        <td style={{ padding: "14px", fontWeight: "600" }}>{totalOrders}</td>
                                        <td style={{ padding: "14px", fontWeight: "700", color: "#28a745" }}>₹{totalSpent}</td>
                                        <td style={{ padding: "14px" }}>
                                            <button
                                                onClick={() => setSelectedCustomer(c)}
                                                style={{
                                                    padding: "6px 12px",
                                                    backgroundColor: "#262626",
                                                    border: "1px solid #444",
                                                    color: "#fff",
                                                    borderRadius: "6px",
                                                    fontSize: "12px",
                                                    cursor: "pointer",
                                                }}
                                            >
                                                View History
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Customer History Modal */}
            {selectedCustomer && (
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
                        maxWidth: "550px",
                        width: "100%",
                        maxHeight: "85vh",
                        overflowY: "auto",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#ff8c00", margin: 0 }}>
                                Customer Profile
                            </h3>
                            <button onClick={() => setSelectedCustomer(null)} style={{ background: "none", border: "none", color: "#fff", fontSize: "18px", cursor: "pointer" }}>✕</button>
                        </div>

                        <div style={{ backgroundColor: "#202020", borderRadius: "10px", padding: "14px", marginBottom: "16px", fontSize: "14px" }}>
                            <div style={{ fontWeight: "700", color: "#fff", marginBottom: "4px" }}>{selectedCustomer.name}</div>
                            <div style={{ color: "#aaa" }}>Email: {selectedCustomer.email}</div>
                            <div style={{ color: "#aaa" }}>Phone: {selectedCustomer.phone}</div>
                            <div style={{ color: "#aaa", marginTop: "4px" }}>Address: {selectedCustomer.address}</div>
                        </div>

                        <h4 style={{ fontSize: "15px", fontWeight: "700", marginBottom: "10px", color: "#fff" }}>Order History</h4>
                        {getCustomerStats(selectedCustomer.id).customerOrders.length === 0 ? (
                            <p style={{ color: "#777", fontSize: "13px" }}>No orders placed yet.</p>
                        ) : (
                            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                                {getCustomerStats(selectedCustomer.id).customerOrders.map((o) => (
                                    <div key={o.id} style={{ backgroundColor: "#202020", borderRadius: "8px", padding: "10px 12px", fontSize: "13px", display: "flex", justifyContent: "space-between" }}>
                                        <div>
                                            <div style={{ fontWeight: "700", color: "#fff" }}>#{o.id.slice(0, 8)} • {o.status}</div>
                                            <div style={{ color: "#888", fontSize: "11px" }}>{new Date(o.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div style={{ fontWeight: "800", color: "#ff8c00" }}>₹{o.total}</div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
