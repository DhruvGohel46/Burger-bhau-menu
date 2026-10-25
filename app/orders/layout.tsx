import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "My Orders",
    robots: { index: false, follow: true },
    alternates: { canonical: "/orders/" },
};

export default function OrdersLayout({ children }: { children: React.ReactNode }) {
    return children;
}
