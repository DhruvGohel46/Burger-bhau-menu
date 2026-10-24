export default function Loading() {
    return (
        <div style={{
            position: "fixed",
            inset: 0,
            backgroundColor: "#F0E8C7",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
            padding: "24px",
            fontFamily: "var(--font-claude-sans), 'Inter', sans-serif",
        }}>
            <style dangerouslySetInnerHTML={{ __html: `
                @keyframes bb-pulse {
                    0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(207, 75, 19, 0.25); }
                    50% { transform: scale(1.06); box-shadow: 0 14px 44px rgba(207, 75, 19, 0.45); }
                }
                @keyframes bb-shimmer {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(200%); }
                }
            `}} />

            {/* Pulsing Brand Avatar */}
            <div style={{
                position: "relative",
                width: "90px",
                height: "90px",
                borderRadius: "28px",
                backgroundColor: "#0a0a0a",
                border: "2px solid rgba(207, 75, 19, 0.50)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "bb-pulse 2s infinite ease-in-out",
                marginBottom: "20px",
                overflow: "hidden",
            }}>
                <img
                    src="/BURGER-BHAU-logo.webp"
                    alt="Burger Bhau"
                    style={{
                        width: "68px",
                        height: "68px",
                        objectFit: "contain",
                    }}
                />
            </div>

            {/* Brand Title */}
            <h2 style={{
                fontSize: "24px",
                fontWeight: "800",
                color: "#060504",
                margin: "0 0 6px 0",
                letterSpacing: "0.02em",
                fontFamily: "var(--font-outfit), sans-serif",
            }}>
                BURGER <span style={{ color: "#CF4B13" }}>BHAU</span>
            </h2>

            {/* Subtitle */}
            <p style={{
                fontSize: "13px",
                color: "rgba(6, 5, 4, 0.60)",
                margin: "0 0 20px 0",
                fontWeight: "500",
            }}>
                Preparing fresh & delicious menu...
            </p>

            {/* Smooth Shimmer Progress Bar */}
            <div style={{
                width: "160px",
                height: "4px",
                borderRadius: "99px",
                backgroundColor: "rgba(6, 5, 4, 0.10)",
                overflow: "hidden",
                position: "relative",
            }}>
                <div style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    width: "50%",
                    borderRadius: "99px",
                    background: "linear-gradient(90deg, #CF4B13 0%, #ff8c00 100%)",
                    animation: "bb-shimmer 1.4s infinite ease-in-out",
                }} />
            </div>
        </div>
    );
}
