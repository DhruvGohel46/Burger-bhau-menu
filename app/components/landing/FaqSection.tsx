"use client";

import { useState } from "react";
import styles from "./FaqSection.module.css";

const FAQ_ITEMS = [
    {
        q: "Is Burger Bhau 100% pure vegetarian?",
        a: "Yes, Burger Bhau is 100% pure vegetarian. Every single item on our menu, including our burgers, cheese burst pizzas, grilled sandwiches, crinkle-cut fries, and garlic breads, is prepared with pure vegetarian ingredients. Jain options are also available on request.",
    },
    {
        q: "Where is Burger Bhau located in Rajkot?",
        a: "We are located Besides Axis Bank, Surbhi Possible 3, Rolex Road, Kothariya, Rajkot, Gujarat 360004. You can find us easily on Google Maps for turn-by-turn driving or walking directions.",
    },
    {
        q: "What are your daily opening hours?",
        a: "We are open daily from Monday to Sunday, from 11:00 AM to 11:00 PM IST.",
    },
    {
        q: "What are the most recommended dishes for first-time visitors?",
        a: "Our regulars love the Tandoori Tadka Burger (₹40 without cheese, ₹50 with cheese), Aalu Tikki Burger (₹40), Korean Burger (₹40), Loaded French Fries (₹70), 7 Cheese Pizza (₹100), Cheese Burst Pizza (₹120), and the Indori Jumbo Sandwich (₹100).",
    },
    {
        q: "How can I order for takeaway or delivery?",
        a: "You can call us directly or message us on WhatsApp at +91 95589 41555. Counter pickup, dine-in, and local store delivery up to 400 meters are available.",
    },
    {
        q: "Which payment methods do you accept?",
        a: "We accept instant UPI payments via all major apps (Google Pay, PhonePe, Paytm, BHIM) with our dynamic store QR code as well as cash.",
    },
];

export default function FaqSection() {
    // Open the first question by default for instant readability
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggleQuestion = (index: number) => {
        setOpenIndex((prev) => (prev === index ? null : index));
    };

    return (
        <section className={styles.section} aria-labelledby="faq-heading">
            <div className={styles.container}>
                <div className={styles.headBlock}>
                    <span className={styles.eyebrow}>Helpful Store Information</span>
                    <h2 id="faq-heading" className={styles.title}>
                        Frequently asked questions
                    </h2>
                    <p className={styles.lead}>
                        Everything you need to know about our food, pure veg preparation, location, and orders.
                    </p>
                </div>

                <div className={styles.faqList}>
                    {FAQ_ITEMS.map((item, idx) => {
                        const isOpen = openIndex === idx;
                        const questionId = `faq-q-${idx}`;
                        const answerId = `faq-a-${idx}`;

                        return (
                            <div key={idx} className={styles.faqItem}>
                                <button
                                    type="button"
                                    id={questionId}
                                    aria-expanded={isOpen}
                                    aria-controls={answerId}
                                    onClick={() => toggleQuestion(idx)}
                                    className={styles.faqQuestionBtn}
                                >
                                    <span>{item.q}</span>
                                    <span
                                        className={`${styles.faqIcon} ${isOpen ? styles.faqIconOpen : ""}`}
                                        aria-hidden="true"
                                    >
                                        +
                                    </span>
                                </button>
                                {isOpen && (
                                    <p id={answerId} role="region" aria-labelledby={questionId} className={styles.faqAnswer}>
                                        {item.a}
                                    </p>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
