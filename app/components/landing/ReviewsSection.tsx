"use client";

import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar, faExternalLinkAlt, faCheckCircle, faPenNib } from "@fortawesome/free-solid-svg-icons";
import { STORE } from "@/app/data/storeConfig";
import { GoogleReviewsData, GoogleReviewItem } from "@/lib/types";
import styles from "./ReviewsSection.module.css";

function formatReviewDate(dateStr?: string, relativeDesc?: string): string {
    if (relativeDesc) return relativeDesc;
    if (!dateStr) return "";
    try {
        const d = new Date(dateStr);
        if (isNaN(d.getTime())) return "";
        return d.toLocaleDateString("en-US", { month: "short", year: "numeric" });
    } catch {
        return "";
    }
}

interface ReviewsSectionProps {
    initialData?: GoogleReviewsData | null;
}

export default function ReviewsSection({ initialData }: ReviewsSectionProps = {}) {
    const config = STORE.googleReviews;
    const [reviewsData, setReviewsData] = useState<GoogleReviewsData | null>(() => initialData || null);
    const [loading, setLoading] = useState(() => (initialData !== undefined ? false : Boolean(config?.enabled)));
    const [expandedIds, setExpandedIds] = useState<Record<string, boolean>>({});

    useEffect(() => {
        if (initialData !== undefined || !config?.enabled) {
            setLoading(false);
            return;
        }

        let isMounted = true;
        const dataUrl = config.reviewsDataUrl || "/data/reviews.json";

        async function fetchReviews() {
            try {
                const res = await fetch(dataUrl);
                if (!res.ok) {
                    if (isMounted) setLoading(false);
                    return;
                }
                const data: GoogleReviewsData = await res.json();
                if (isMounted) {
                    setReviewsData(data);
                    setLoading(false);
                }
            } catch {
                if (isMounted) setLoading(false);
            }
        }

        fetchReviews();

        return () => {
            isMounted = false;
        };
    }, [initialData, config?.enabled, config?.reviewsDataUrl]);

    // If disabled in config, hide quietly
    if (!config?.enabled) {
        return null;
    }

    // While loading after initial screen paint, render soft skeleton to avoid layout shift
    if (loading) {
        return (
            <section className={styles.section} aria-label="Customer reviews loading">
                <div className={styles.container}>
                    <div className={styles.headBlock}>
                        <div className={styles.titleArea}>
                            <div className={styles.skeletonLineTitle} />
                            <div style={{ marginTop: "10px" }} className={styles.skeletonLineShort} />
                        </div>
                    </div>
                    <div className={styles.skeletonContainer}>
                        {[1, 2, 3].map((n) => (
                            <div key={n} className={styles.skeletonCard}>
                                <div className={styles.skeletonLineTitle} />
                                <div className={styles.skeletonLineText} />
                                <div className={styles.skeletonLineShort} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        );
    }

    // If missing, empty, or only placeholder data: hide section quietly
    const isPlaceholder = Boolean(reviewsData?.is_placeholder);
    const allowPlaceholder = Boolean(config.showPlaceholdersInDev && process.env.NODE_ENV === "development");

    if (!reviewsData || !reviewsData.reviews || reviewsData.reviews.length === 0) {
        return null;
    }

    if (isPlaceholder && !allowPlaceholder) {
        // Zero fabricated reviews shown to real visitors; hide section completely
        return null;
    }

    // Filter according to store config rules (4 or 5 stars, minimum comment length)
    const minRating = config.minRating || 4;
    const minLength = config.minCommentLength || 40;
    const maxItems = config.maxDisplayReviews || 6;

    const visibleReviews = reviewsData.reviews
        .filter((rev) => rev.rating >= minRating && (rev.text || "").trim().length >= minLength)
        .slice(0, maxItems);

    if (visibleReviews.length === 0) {
        return null;
    }

    const toggleExpand = (id: string) => {
        setExpandedIds((prev) => ({ ...prev, [id]: !prev[id] }));
    };

    const mapsPlaceUrl = config.googleMapsPlaceUrl || STORE.mapsDirectionsUrl;
    const writeUrl = config.writeReviewUrl || mapsPlaceUrl;

    return (
        <section className={styles.section} aria-labelledby="reviews-heading">
            <div className={styles.container}>
                {/* Header */}
                <div className={styles.headBlock}>
                    <div className={styles.titleArea}>
                        <div className={styles.googlePill}>
                            <span className={styles.googleGIcon}>G</span> Google Verified Reviews
                        </div>
                        <h2 id="reviews-heading" className={styles.title}>
                            {config.sectionHeading || "What our customers say"}
                        </h2>
                        <p className={styles.lead}>
                            {config.sectionSubtitle || "Real Google reviews from our Kothariya, Rajkot store"}
                        </p>
                    </div>

                    <div className={styles.headerActions}>
                        <a
                            href={writeUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.writeReviewBtn}
                        >
                            <FontAwesomeIcon icon={faPenNib} /> Write a Review
                        </a>
                        <a
                            href={mapsPlaceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={styles.mapsLinkBtn}
                        >
                            See all on Google Maps <FontAwesomeIcon icon={faExternalLinkAlt} />
                        </a>
                    </div>
                </div>

                {/* Rating Banner */}
                <div className={styles.ratingSummaryBar}>
                    <div className={styles.ratingBigNumber}>
                        {reviewsData.average_rating ? reviewsData.average_rating.toFixed(1) : "5.0"}
                    </div>
                    <div className={styles.ratingStarsRow} role="img" aria-label={`${reviewsData.average_rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <FontAwesomeIcon
                                key={star}
                                icon={faStar}
                            />
                        ))}
                    </div>
                    <span className={styles.reviewCountLabel}>
                        Based on {reviewsData.total_reviews} verified Google reviews
                    </span>
                    <span className={styles.verifiedBadge}>
                        <FontAwesomeIcon icon={faCheckCircle} /> Google Business Profile
                    </span>
                </div>

                {/* Review Cards Grid / Mobile Horizontal Swipe Track */}
                <div className={styles.reviewsGrid}>
                    {visibleReviews.map((rev: GoogleReviewItem) => {
                        const isExpanded = Boolean(expandedIds[rev.id]);
                        const shouldTruncate = rev.text.length > 170;
                        const displayText = shouldTruncate && !isExpanded
                            ? `${rev.text.slice(0, 170)}...`
                            : rev.text;

                        const dateLabel = formatReviewDate(rev.create_time, rev.relative_time_description);
                        const initial = rev.reviewer_name ? rev.reviewer_name.trim().charAt(0).toUpperCase() : "G";

                        return (
                            <article key={rev.id} className={styles.reviewCard}>
                                <div>
                                    <div className={styles.cardTop}>
                                        <div className={styles.reviewerMeta}>
                                            <div className={styles.avatarInitial} aria-hidden="true">
                                                {initial}
                                            </div>
                                            <div>
                                                <div className={styles.reviewerName}>
                                                    {rev.reviewer_name}
                                                </div>
                                                {dateLabel && (
                                                    <div className={styles.reviewDate}>
                                                        {dateLabel}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className={styles.cardStars} role="img" aria-label={`${rev.rating} stars`}>
                                            {[...Array(rev.rating)].map((_, i) => (
                                                <FontAwesomeIcon key={i} icon={faStar} />
                                            ))}
                                        </div>
                                    </div>

                                    <div className={styles.reviewBody}>
                                        <p className={styles.reviewText}>
                                            &ldquo;{displayText}&rdquo;
                                        </p>
                                        {shouldTruncate && (
                                            <button
                                                type="button"
                                                onClick={() => toggleExpand(rev.id)}
                                                className={styles.readMoreBtn}
                                                aria-expanded={isExpanded}
                                            >
                                                {isExpanded ? "Show less" : "Read more"}
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className={styles.cardBottom}>
                                    <span className={styles.googleSourceTag}>
                                        Verified Google Review
                                    </span>
                                </div>
                            </article>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}