"use client";

import { useState } from "react";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPrint, faCopy, faCheck, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import styles from "./qrAdmin.module.css";

const QR_VARIANTS = [
    {
        id: "counter",
        title: "In-Store Counter Display",
        usage: "Place at billing counter or table stands for visiting dine-in customers",
        utmUrl: `${STORE.websiteUrl}/?utm_source=counter&utm_medium=qr&utm_campaign=store_counter`,
        tag: "Counter Stand",
    },
    {
        id: "packaging",
        title: "Takeaway Packaging Sticker",
        usage: "Print on delivery paper bags, parcel packaging, and burger boxes",
        utmUrl: `${STORE.websiteUrl}/?utm_source=packaging&utm_medium=qr&utm_campaign=takeaway_box`,
        tag: "Takeaway Boxes",
    },
    {
        id: "flyer",
        title: "Local Marketing Flyers",
        usage: "For newspaper inserts, pamphlets, and neighborhood banners in Kothariya",
        utmUrl: `${STORE.websiteUrl}/?utm_source=flyer&utm_medium=qr&utm_campaign=local_flyer`,
        tag: "Flyers & Pamphlets",
    },
];

export default function AdminQrPage() {
    const [copiedId, setCopiedId] = useState<string | null>(null);

    const handleCopy = (id: string, url: string) => {
        navigator.clipboard.writeText(url);
        setCopiedId(id);
        setTimeout(() => setCopiedId(null), 2000);
    };

    const handlePrint = () => {
        if (typeof window !== "undefined") {
            window.print();
        }
    };

    return (
        <div className={styles.container}>
            {/* Header (Hidden when printing) */}
            <div className={styles.header}>
                <div>
                    <h1 className={styles.title}>
                        <FontAwesomeIcon icon={faQrcode} className={styles.titleIcon} />
                        Store Printable QR Codes
                    </h1>
                    <p className={styles.subtitle}>
                        Printable QR code cards with automatic Google Analytics UTM tracking.
                    </p>
                </div>

                <button type="button" onClick={handlePrint} className={styles.printBtn}>
                    <FontAwesomeIcon icon={faPrint} />
                    <span>Print QR Sheets</span>
                </button>
            </div>

            <div className={styles.cardsGrid}>
                {QR_VARIANTS.map((qr) => {
                    const qrImgUrl = `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=10&data=${encodeURIComponent(qr.utmUrl)}`;

                    return (
                        <div key={qr.id} className={styles.qrCard}>
                            <div className={styles.cardTop}>
                                <span className={styles.tagBadge}>{qr.tag}</span>
                                <h2 className={styles.cardTitle}>{qr.title}</h2>
                                <p className={styles.cardUsage}>{qr.usage}</p>
                            </div>

                            <div className={styles.qrFrame}>
                                <div className={styles.brandBadge}>
                                    <Image
                                        src="/BURGER-BHAU-logo.webp"
                                        alt="Burger Bhau"
                                        width={36}
                                        height={36}
                                        className={styles.miniLogo}
                                    />
                                    <div>
                                        <span className={styles.brandTitle}>Burger Bhau</span>
                                        <span className={styles.branchTitle}>{STORE.branch}, Rajkot</span>
                                    </div>
                                </div>

                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={qrImgUrl}
                                    alt={`QR Code for ${qr.title}`}
                                    width={220}
                                    height={220}
                                    className={styles.qrImage}
                                />

                                <div className={styles.scanNotice}>
                                    <strong>Scan to view menu & directions</strong>
                                    <span>Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya</span>
                                </div>
                            </div>

                            <div className={styles.urlBox}>
                                <code className={styles.urlText}>{qr.utmUrl}</code>
                                <button
                                    type="button"
                                    onClick={() => handleCopy(qr.id, qr.utmUrl)}
                                    className={styles.copyBtn}
                                    aria-label="Copy tracked URL"
                                >
                                    <FontAwesomeIcon icon={copiedId === qr.id ? faCheck : faCopy} />
                                    <span>{copiedId === qr.id ? "Copied" : "Copy Link"}</span>
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
