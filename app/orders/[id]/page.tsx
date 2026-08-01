import OrderTrackingClient from "./OrderTrackingClient";

export function generateStaticParams() {
    return [{ id: "placeholder" }];
}

export default function OrderTrackingPage({ params }: { params: Promise<{ id: string }> }) {
    return <OrderTrackingClient params={params} />;
}
