import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire, faLeaf, faTag, faLocationDot } from "@fortawesome/free-solid-svg-icons";
import styles from "./TrustStrip.module.css";

const TRUST_POINTS = [
    {
        icon: faFire,
        title: "Fresh on order",
        desc: "Garma-garam, assembled when you ask",
    },
    {
        icon: faLeaf,
        title: "100% pure veg",
        desc: "Dedicated vegetarian kitchen & ingredients",
    },
    {
        icon: faTag,
        title: "Street honest prices",
        desc: "Burgers from ₹40, sandwiches from ₹30",
    },
    {
        icon: faLocationDot,
        title: "Easy to reach",
        desc: "Besides Axis Bank, Rolex Road with quick counter service",
    },
];

export default function TrustStrip() {
    return (
        <section className={styles.strip} aria-label="Why visit Burger Bhau">
            <div className={styles.container}>
                <div className={styles.grid}>
                    {TRUST_POINTS.map((point, idx) => (
                        <div key={idx} className={styles.item}>
                            <div className={styles.iconWrap} aria-hidden="true">
                                <FontAwesomeIcon icon={point.icon} className={styles.icon} />
                            </div>
                            <div className={styles.textWrap}>
                                <h3 className={styles.itemTitle}>{point.title}</h3>
                                <p className={styles.itemDesc}>{point.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
