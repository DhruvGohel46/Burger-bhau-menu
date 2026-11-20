import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Login",
    robots: {
        index: false,
        follow: false,
        nocache: true,
        googleBot: {
            index: false,
            follow: false,
        },
    },
    alternates: { canonical: "/login/" },
};

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children;
}
