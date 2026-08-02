"use client";

import { useEffect, useState } from "react";
import { selectCartTotal, useCartStore } from "@/app/store/cartStore";
import { buildWhatsAppUrl, buildCallUrl } from "@/app/data/shopConfig";
import { supabase } from "@/lib/supabase";
import { ShopSettings } from "@/lib/types";
import styles from "./FloatingActions.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faTimes } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp } from "@fortawesome/free-brands-svg-icons";

export default function FloatingActions() {
    const cartItems = useCartStore((s) => s.cartItems);
    const cartTotal = useCartStore(selectCartTotal);
    const customerName = useCartStore((s) => s.customerName);
    const customerAddress = useCartStore((s) => s.customerAddress);
    const customerPhone = useCartStore((s) => s.customerPhone);

    const [settings, setSettings] = useState<ShopSettings | null>(null);
    const [activeModal, setActiveModal] = useState<"phone" | "whatsapp" | null>(null);

    useEffect(() => {
        async function loadShopSettings() {
            try {
                const { data } = await supabase.from("shop_settings").select("*").eq("id", 1).single();
                if (data) {
                    setSettings(data as ShopSettings);
                }
            } catch (err) {
                // fallback defaults
            }
        }
        loadShopSettings();
    }, []);

    const phoneList = [
        settings?.shop_phone || "919558941555",
        ...(settings?.additional_phones || []).filter((p) => p && p.trim().length > 0),
    ];

    const whatsappList = [
        settings?.whatsapp_number || "919558941555",
        ...(settings?.additional_whatsapps || []).filter((w) => w && w.trim().length > 0),
    ];

    const handleCallClick = (e: React.MouseEvent) => {
        if (phoneList.length > 1) {
            e.preventDefault();
            setActiveModal("phone");
        }
    };

    const handleWhatsAppClick = (e: React.MouseEvent) => {
        if (whatsappList.length > 1) {
            e.preventDefault();
            setActiveModal("whatsapp");
        }
    };

    return (
        <>
            <div className={styles.wrap}>
                <a
                    href={buildCallUrl(phoneList[0])}
                    onClick={handleCallClick}
                    className={`${styles.fab} ${styles.call}`}
                    aria-label="Call shop"
                >
                    <FontAwesomeIcon icon={faPhone} width={20} height={20} />
                </a>
                <a
                    href={buildWhatsAppUrl(cartItems, cartTotal, customerName, customerAddress, customerPhone, whatsappList[0])}
                    onClick={handleWhatsAppClick}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${styles.fab} ${styles.whatsapp}`}
                    aria-label="Order on WhatsApp"
                >
                    <FontAwesomeIcon icon={faWhatsapp} width={22} height={22} />
                </a>
            </div>

            {/* Modal for selecting among multiple Phone or WhatsApp lines */}
            {activeModal && (
                <div style={{
                    position: "fixed",
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.75)",
                    backdropFilter: "blur(6px)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "20px",
                    zIndex: 9999,
                }}>
                    <div style={{
                        backgroundColor: "#161616",
                        border: "1px solid #333",
                        borderRadius: "20px",
                        padding: "24px",
                        maxWidth: "380px",
                        width: "100%",
                        boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
                    }}>
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
                            <h3 style={{ fontSize: "17px", fontWeight: "800", color: activeModal === "phone" ? "#ff8c00" : "#25d366", margin: 0, display: "flex", alignItems: "center", gap: "8px" }}>
                                <FontAwesomeIcon icon={activeModal === "phone" ? faPhone : faWhatsapp} />
                                {activeModal === "phone" ? "Select Call Line" : "Select WhatsApp Line"}
                            </h3>
                            <button
                                onClick={() => setActiveModal(null)}
                                style={{ background: "none", border: "none", color: "#aaa", fontSize: "18px", cursor: "pointer", padding: "4px" }}
                            >
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>

                        <p style={{ fontSize: "13px", color: "#aaa", marginBottom: "16px" }}>
                            Choose an available contact line to reach Burger Bhau:
                        </p>

                        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                            {activeModal === "phone"
                                ? phoneList.map((num, i) => (
                                      <a
                                          key={i}
                                          href={buildCallUrl(num)}
                                          onClick={() => setActiveModal(null)}
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              padding: "14px 16px",
                                              backgroundColor: "#222",
                                              border: "1px solid #333",
                                              borderRadius: "12px",
                                              color: "#fff",
                                              textDecoration: "none",
                                              fontWeight: "700",
                                              fontSize: "15px",
                                          }}
                                      >
                                          <span>{i === 0 ? "📞 Primary Line" : `📞 Line ${i + 1}`}</span>
                                          <span style={{ color: "#ff8c00", fontSize: "14px" }}>+{num}</span>
                                      </a>
                                  ))
                                : whatsappList.map((num, i) => (
                                      <a
                                          key={i}
                                          href={buildWhatsAppUrl(cartItems, cartTotal, customerName, customerAddress, customerPhone, num)}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          onClick={() => setActiveModal(null)}
                                          style={{
                                              display: "flex",
                                              alignItems: "center",
                                              justifyContent: "space-between",
                                              padding: "14px 16px",
                                              backgroundColor: "rgba(37, 211, 102, 0.12)",
                                              border: "1px solid #25d366",
                                              borderRadius: "12px",
                                              color: "#fff",
                                              textDecoration: "none",
                                              fontWeight: "700",
                                              fontSize: "15px",
                                          }}
                                      >
                                          <span>{i === 0 ? "💬 Main WhatsApp" : `💬 WhatsApp Line ${i + 1}`}</span>
                                          <span style={{ color: "#25d366", fontSize: "14px" }}>+{num}</span>
                                      </a>
                                  ))}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
