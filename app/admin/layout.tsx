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
    faImages,
} from "@fortawesome/free-solid-svg-icons";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin", icon: faChartLine },
    { label: "Orders", href: "/admin/orders", icon: faReceipt },
    { label: "Customers", href: "/admin/customers", icon: faUsers },
    { label: "Menu Management", href: "/admin/menu", icon: faUtensils },
    { label: "Photo Gallery", href: "/admin/gallery", icon: faImages },
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
            backgroundColor: "#0d0a08",
            backgroundImage: "radial-gradient(ellipse at 20% 0%, rgba(207, 75, 19, 0.12) 0%, transparent 60%), radial-gradient(ellipse at 80% 100%, rgba(255, 140, 0, 0.08) 0%, transparent 60%)",
            color: "#f5f5f5",
            fontFamily: "var(--font-jakarta), 'Plus Jakarta Sans', system-ui, sans-serif",
        }}>
            {/* Sidebar */}
            <aside style={{
                width: "270px",
                backgroundColor: "rgba(18, 14, 10, 0.94)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(207, 75, 19, 0.20)",
                display: "flex",
                flexDirection: "column",
                padding: "24px 16px",
                flexShrink: 0,
                boxShadow: "4px 0 24px rgba(0, 0, 0, 0.4)",
            }}>
                {/* Brand Logo Header */}
                <div style={{ marginBottom: "28px", padding: "0 8px", display: "flex", alignItems: "center", gap: "12px" }}>
                    <div style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "12px",
                        backgroundColor: "#16120e",
                        border: "1px solid rgba(207, 75, 19, 0.35)",
                        overflow: "hidden",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        boxShadow: "0 4px 12px rgba(207, 75, 19, 0.25)",
                    }}>
                        <img src="/BURGER-BHAU-logo.webp" alt="Burger Bhau" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    </div>
                    <div>
                        <div style={{ fontSize: "20px", fontWeight: "700", fontFamily: "var(--font-playfair), 'Playfair Display', serif", color: "#F0E8C7", letterSpacing: "-0.01em" }}>
                            BURGER <span style={{ color: "#ff8c00" }}>BHAU</span>
                        </div>
                        <span style={{ fontSize: "10px", color: "rgba(240, 232, 199, 0.6)", fontWeight: "700", letterSpacing: "1.2px", textTransform: "uppercase" }}>
                            ADMIN PORTAL
                        </span>
                    </div>
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
                                    borderRadius: "12px",
                                    fontSize: "14px",
                                    fontWeight: isActive ? "700" : "500",
                                    color: isActive ? "#ffffff" : "#d4cbb0",
                                    background: isActive
                                        ? "linear-gradient(135deg, #CF4B13 0%, #ff8c00 100%)"
                                        : "transparent",
                                    border: isActive ? "1px solid rgba(255, 255, 255, 0.2)" : "1px solid transparent",
                                    boxShadow: isActive ? "0 4px 16px rgba(207, 75, 19, 0.40)" : "none",
                                    textDecoration: "none",
                                    transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
                                }}
                            >
                                <FontAwesomeIcon
                                    icon={item.icon}
                                    style={{
                                        fontSize: "16px",
                                        width: "18px",
                                        color: isActive ? "#ffffff" : "#CF4B13",
                                    }}
                                />
                                {item.label}
                            </Link>
                        );
                    })}
                </nav>

                {/* Bottom User Controls */}
                <div style={{
                    borderTop: "1px solid rgba(207, 75, 19, 0.18)",
                    paddingTop: "16px",
                    marginTop: "16px",
                    backgroundColor: "rgba(240, 232, 199, 0.04)",
                    borderRadius: "14px",
                    padding: "14px",
                }}>
                    <div style={{ fontSize: "13px", color: "#F0E8C7", fontWeight: "700", marginBottom: "2px", overflow: "hidden", textOverflow: "ellipsis" }}>
                        {profile?.name || user?.email}
                    </div>
                    <div style={{ fontSize: "11px", color: "#ff8c00", fontWeight: "700", marginBottom: "12px" }}>
                        Role: Store Administrator
                    </div>
                    <button
                        onClick={() => {
                            signOut();
                            router.push("/");
                        }}
                        style={{
                            width: "100%",
                            padding: "10px",
                            backgroundColor: "rgba(239, 68, 68, 0.12)",
                            border: "1px solid rgba(239, 68, 68, 0.35)",
                            borderRadius: "10px",
                            color: "#ff6b6b",
                            fontSize: "13px",
                            fontWeight: "700",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: "8px",
                            transition: "all 0.2s ease",
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
