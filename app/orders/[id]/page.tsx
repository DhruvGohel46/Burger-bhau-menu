import OrderTrackingClient from "./OrderTrackingClient";

export function generateStaticParams() {
    return [
        { id: "placeholder" },
        { id: "[id]" },
    ];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    return <OrderTrackingClient params={params} />;
}
