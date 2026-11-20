export default async function handler(req: Request): Promise<Response> {
    if (req.method !== "POST") {
        return new Response(
            JSON.stringify({ success: false, message: "Method Not Allowed" }),
            {
                status: 405,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    const hookUrl = process.env.NETLIFY_BUILD_HOOK_URL;
    if (!hookUrl) {
        return new Response(
            JSON.stringify({
                success: false,
                message: "NETLIFY_BUILD_HOOK_URL is not configured",
            }),
            {
                status: 500,
                headers: { "Content-Type": "application/json" },
            }
        );
    }

    try {
        const res = await fetch(hookUrl, { method: "POST" });
        if (!res.ok) {
            throw new Error(`Build hook responded with status ${res.status}`);
        }
        return new Response(
            JSON.stringify({ success: true, message: "Netlify rebuild triggered successfully" }),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err: any) {
        return new Response(
            JSON.stringify({ success: false, message: err?.message || "Failed to trigger rebuild" }),
            {
                status: 502,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}
