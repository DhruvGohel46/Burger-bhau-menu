"use client";

import { useEffect, useState } from "react";
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
    faQrcode,
    faBars,
    faTimes,
    faArrowUpRightFromSquare,
} from "@fortawesome/free-solid-svg-icons";
import styles from "./adminLayout.module.css";

const NAV_ITEMS = [
    { label: "Dashboard", href: "/admin/", icon: faChartLine },
    { label: "Orders", href: "/admin/orders/", icon: faReceipt },
    { label: "Customers", href: "/admin/customers/", icon: faUsers },
    { label: "Menu Management", href: "/admin/menu/", icon: faUtensils },
    { label: "Photo Gallery", href: "/admin/gallery/", icon: faImages },
    { label: "Analytics", href: "/admin/analytics/", icon: faChartPie },
    { label: "Store QR Codes", href: "/admin/qr/", icon: faQrcode },
    { label: "Store Settings", href: "/admin/settings/", icon: faCog },
    { label: "Admin Profile", href: "/admin/profile/", icon: faUserShield },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    const { user, profile, isLoading, signOut } = useAuthStore();
    const [mobileOpen, setMobileOpen] = useState(false);

    // If on /admin/login (with or without trailing slash), bypass layout wrapper sidebar
    const isLoginPage = pathname?.startsWith("/admin/login");

    useEffect(() => {
        if (!isLoading && !isLoginPage) {
            if (!user || profile?.role !== "admin") {
                router.push("/admin/login");
            }
        }
    }, [user, profile, isLoading, isLoginPage, router]);

    // Close drawer automatically on route navigation
    useEffect(() => {
        setMobileOpen(false);
    }, [pathname]);

    if (isLoginPage) {
        return <>{children}</>;
    }

    if (isLoading || (!user && !isLoginPage)) {
        return (
            <div style={{
                minHeight: "100vh",
                backgroundColor: "var(--bg)",
                color: "var(--text)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "var(--font-claude-sans), Inter, sans-serif",
                fontSize: "15px",
                fontWeight: 600,
            }}>
                <p>Verifying Admin Access…</p>
            </div>
        );
    }

    const renderNavLinks = () => (
        <nav className={styles.nav}>
            {NAV_ITEMS.map((item) => {
                const isActive = pathname === item.href || pathname === `${item.href}/`;
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`${styles.navLink} ${isActive ? styles.navLinkActive : ""}`}
                    >
                        <FontAwesomeIcon icon={item.icon} className={styles.navIcon} />
                        <span className={styles.navLabel}>{item.label}</span>
                    </Link>
                );
            })}
        </nav>
    );

    const renderUserCard = () => (
        <div className={styles.userCard}>
            <div className={styles.userName}>
                {profile?.name || user?.email || "Store Administrator"}
            </div>
            <div className={styles.userRole}>
                Role: Store Administrator
            </div>
            <button
                type="button"
                onClick={() => {
                    signOut();
                    router.push("/");
                }}
                className={styles.signOutBtn}
            >
                <FontAwesomeIcon icon={faSignOutAlt} /> Sign Out
            </button>
        </div>
    );

    return (
        <div className={styles.layout}>
            {/* ─── Mobile Header Bar (< 860px) ─── */}
            <header className={styles.mobileBar}>
                <Link href="/admin/" className={styles.mobileBarBrand}>
                    <img
                        src="/BURGER-BHAU-logo.webp"
                        alt="Burger Bhau Logo"
                        className={styles.mobileLogo}
                    />
                    <span className={styles.mobileTitle}>
                        BURGER <span className={styles.brandAccent}>BHAU</span>
                    </span>
                </Link>

                <button
                    type="button"
                    onClick={() => setMobileOpen(true)}
                    className={styles.mobileToggle}
                    aria-label="Open navigation menu"
                >
                    <FontAwesomeIcon icon={faBars} />
                    <span>Menu</span>
                </button>
            </header>

            {/* ─── Mobile Drawer Overlay ─── */}
            {mobileOpen && (
                <div className={styles.mobileDrawerOpen}>
                    <div
                        className={styles.mobileBackdrop}
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true"
                    />
                    <div className={styles.mobileDrawerContent}>
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className={styles.mobileDrawerClose}
                            aria-label="Close navigation menu"
                        >
                            <FontAwesomeIcon icon={faTimes} /> Close
                        </button>

                        <div className={styles.brandBlock}>
                            <div className={styles.brandLogoWrap}>
                                <img
                                    src="/BURGER-BHAU-logo.webp"
                                    alt="Burger Bhau"
                                    className={styles.brandLogo}
                                />
                            </div>
                            <div className={styles.brandMeta}>
                                <div className={styles.brandTitle}>
                                    BURGER <span className={styles.brandAccent}>BHAU</span>
                                </div>
                                <span className={styles.brandBadge}>STORE ADMIN</span>
                            </div>
                        </div>

                        <Link href="/" target="_blank" className={styles.liveStoreBtn}>
                            <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                            <span>View Live Customer Site</span>
                        </Link>

                        {renderNavLinks()}
                        {renderUserCard()}
                    </div>
                </div>
            )}

            {/* ─── Desktop Sticky Side Panel ─── */}
            <aside className={styles.sidebar}>
                {/* Brand Logo Header */}
                <div className={styles.brandBlock}>
                    <div className={styles.brandLogoWrap}>
                        <img
                            src="/BURGER-BHAU-logo.webp"
                            alt="Burger Bhau"
                            className={styles.brandLogo}
                        />
                    </div>
                    <div className={styles.brandMeta}>
                        <div className={styles.brandTitle}>
                            BURGER <span className={styles.brandAccent}>BHAU</span>
                        </div>
                        <span className={styles.brandBadge}>ADMIN PORTAL</span>
                    </div>
                </div>

                {/* Quick Link to Customer Storefront */}
                <Link href="/" target="_blank" className={styles.liveStoreBtn}>
                    <FontAwesomeIcon icon={faArrowUpRightFromSquare} />
                    <span>View Live Customer Site</span>
                </Link>

                {/* Main Nav Links */}
                {renderNavLinks()}

                {/* Bottom User Controls */}
                {renderUserCard()}
            </aside>

            {/* ─── Main Content Canvas ─── */}
            <main className={styles.main}>
                {children}
            </main>
        </div>
    );
}
