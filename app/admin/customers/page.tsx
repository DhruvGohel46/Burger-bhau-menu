"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { UserProfile, Order } from "@/lib/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch, faTimes } from "@fortawesome/free-solid-svg-icons";
import styles from "./customersAdmin.module.css";

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
        <div className={styles.container}>
            <div className={styles.header}>
                <h1 className={styles.title}>
                    Customer Directory
                </h1>
                <p className={styles.subtitle}>
                    Registered customer profiles, order history, and spending summaries.
                </p>
            </div>

            {/* Search Bar */}
            <div className={styles.searchWrap}>
                <FontAwesomeIcon icon={faSearch} className={styles.searchIcon} />
                <input
                    type="text"
                    placeholder="Search customers by name, phone, email..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={styles.searchInput}
                />
            </div>

            {loading ? (
                <p className={styles.emptyText}>Loading customers...</p>
            ) : filteredCustomers.length === 0 ? (
                <p className={styles.emptyText}>No customer records found.</p>
            ) : (
                <div className={styles.tableCard}>
                    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.th}>Name</th>
                                <th className={styles.th}>Email</th>
                                <th className={styles.th}>Phone</th>
                                <th className={styles.th}>Role</th>
                                <th className={styles.th}>Total Orders</th>
                                <th className={styles.th}>Total Spending</th>
                                <th className={styles.th}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCustomers.map((c) => {
                                const { totalOrders, totalSpent } = getCustomerStats(c.id);
                                return (
                                    <tr key={c.id} className={styles.tr}>
                                        <td className={styles.nameCell}>{c.name || "N/A"}</td>
                                        <td className={styles.emailCell}>{c.email}</td>
                                        <td className={styles.phoneCell}>{c.phone || "N/A"}</td>
                                        <td className={styles.td}>
                                            <span className={c.role === "admin" ? styles.roleBadgeAdmin : styles.roleBadgeUser}>
                                                {c.role}
                                            </span>
                                        </td>
                                        <td className={styles.ordersCell}>{totalOrders}</td>
                                        <td className={styles.spentCell}>₹{totalSpent}</td>
                                        <td className={styles.td}>
                                            <button
                                                onClick={() => setSelectedCustomer(c)}
                                                className={styles.actionBtn}
                                            >
                                                Show Profile
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
                <div className={styles.modalBackdrop} role="dialog" aria-modal="true">
                    <div className={styles.modalCard}>
                        <div className={styles.modalHeader}>
                            <h3 className={styles.modalTitle}>
                                Customer Profile
                            </h3>
                            <button
                                onClick={() => setSelectedCustomer(null)}
                                className={styles.modalCloseBtn}
                                aria-label="Close modal"
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <div className={styles.profileCard}>
                            <div className={styles.profileName}>{selectedCustomer.name}</div>
                            <div className={styles.profileMeta}>Email: {selectedCustomer.email}</div>
                            <div className={styles.profileMeta}>Phone: {selectedCustomer.phone}</div>
                            <div className={styles.profileMeta}>Address: {selectedCustomer.address}</div>
                        </div>

                        <h4 className={styles.historyTitle}>Order History</h4>
                        {getCustomerStats(selectedCustomer.id).customerOrders.length === 0 ? (
                            <p className={styles.emptyText}>No orders placed yet.</p>
                        ) : (
                            <div className={styles.historyList}>
                                {getCustomerStats(selectedCustomer.id).customerOrders.map((o) => (
                                    <div key={o.id} className={styles.historyItem}>
                                        <div>
                                            <div className={styles.historyItemTitle}>#{o.id.slice(0, 8)} • {o.status}</div>
                                            <div className={styles.historyItemDate}>{new Date(o.created_at).toLocaleDateString()}</div>
                                        </div>
                                        <div className={styles.historyItemTotal}>₹{o.total}</div>
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
