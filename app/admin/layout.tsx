"use client";

import { useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import { useAuthStore } from "@/store/authStore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChartLine,
    faReceipt,
    faUsers,
    faUtensils,
    faChartPie,
    faCog,
    faUserShield,
    faSignOutAlt,
    faStore,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: faChartLine },
    { label: "Orders", href: "/admin/orders", icon: faReceipt },
    { label: "Customers", href: "/admin/customers", icon: faUsers },
    { label: "Menu Management", href: "/admin/menu", icon: faUtensils },
    { label: "Analytics", href: "/admin/analytics", icon: faChartPie },
    { label: "Store Settings", href: "/admin/settings", icon: faCog },
    { label: "Admin Profile", href: "/admin/profile", icon: faUserShield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, profile, isLoading, signOut } = useAuthStore();

    // If on /admin/login (with or without trailing slash), bypass layout wrapper sidebar
    const isLoginPage = pathname?.startsWith("/admin/login");

    useEffect(() => {
        if (!isLoading && !isLoginPage) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin/login");
            }
        }
    }, [user, profile, isLoading, isLoginPage, router]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (isLoading || (!user && !isLoginPage)) {
        return (
            <div style={{ minHeight: "100vh", backgroundColor: "#0a0a0a", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <p>Verifying Admin Access...</p>
            </div>
        );
    }

    return (
        <div style={{
            display: "flex",
            minHeight: "100vh",
            backgroundColor: "#0a0a0a",
            color: "#fff",
            fontFamily: "var(--font-jakarta), sans-serif",
        }}>
            {/* Sidebar */}
            <aside style={{
                width: "260px",
                backgroundColor: "#121212",
                borderRight: "1px solid #222",
                display: "flex",
                flexDirection: "column",
                padding: "24px 16px",
                flexShrink: 0,
            }}>
                {/* Brand Logo */}
                <div style={{ marginBottom: "32px", padding: "0 8px" }}>
                    <div style={{ fontSize: "20px", fontWeight: "800", color: "#ff8c00", display: "flex", alignItems: "center", gap: "8px" }}>
                        <FontAwesomeIcon icon={faStore} /> Burger Bhau
                    </div>
                    <span style={{ fontSize: "11px", color: "#888", fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
                        ADMIN DASHBOARD
                    </span>
                </div>

                {/* Nav Links */}
                <nav style={{ display: "flex", flexDirection: "column", gap: "6px", flex: 1 }}>
                    {NAV_ITEMS.map((item) => {
                        const isActive = pathname === item.href || pathname === `${item.href}/`;
                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px 14px",
                                    borderRadius: "10px",
                                    fontSize: "14px",
                                    fontWeight: isActive ? "700" : "500",
                                    color: isActive ? "#000" : "#ccc",
                                    backgroundColor: isActive ? "#ff8c00" : "transparent",
                                    textDecoration: "none",
                                    transition: "all 0.15s ease",
                                }}
                            >
                                <FontAwesomeIcon icon={item.icon} style={{ fontSize: "16px", width: "18px" }} />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User Controls */}
                <div style={{ borderTop: "1px solid #222", paddingTop: "16px", marginTop: "16px" }}>
                    <div style={{ fontSize: "13px", color: "#fff", fontWeight: "600", marginBottom: "2px" }}>
                        {profile?.name || user?.email}
                    </div>
                    <div style={{ fontSize: "11px", color: "#ff8c00", fontWeight: "700", marginBottom: "12px" }}>
                        Role: Administrator
                    </div>
                    <button
                        onClick={() => {
                            signOut();
                            router.push("/");
                        }}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "#1e1e1e",
                            border: "1px solid #333",
                            borderRadius: "8px",
                            color: "#ff6b6b",
                            fontSize: "13px",
                            fontWeight: "600",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                        }}
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content Area */}
            <main style={{ flex: 1, padding: "32px", overflowY: "auto", minWidth: 0 }}>
                {children}
            </main>
        </div>
    );
}
