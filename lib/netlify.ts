/**
 * Triggers a site rebuild via Netlify serverless function or directly via environment variable on the server.
 * Avoids exposing secrets to the client bundle (no NEXT_PUBLIC_ exposure).
 */
export async function triggerNetlifyBuildHook(): Promise<{ success: boolean; message: string }> {
    // If executing in a server environment where the private hook is available
    if (typeof window === "undefined" && process.env.NETLIFY_BUILD_HOOK_URL) {
        try {
            const res = await fetch(process.env.NETLIFY_BUILD_HOOK_URL, { method: "POST" });
            return {
                success: res.ok,
                message: res.ok ? "Rebuild triggered directly via server hook" : `Status ${res.status}`,
            };
        } catch (err: any) {
            return { success: false, message: err?.message || "Failed direct rebuild trigger" };
        }
    }

    // Client-side invocation via serverless function
    try {
        const res = await fetch("/.netlify/functions/trigger-rebuild", { method: "POST" });
        const data = await res.json().catch(() => ({}));
        return {
            success: res.ok && data.success !== false,
            message: data.message || `Rebuild triggered with status ${res.status}`,
        };
    } catch (err: any) {
        console.error("Failed to trigger Netlify rebuild:", err);
        return { success: false, message: err?.message || "Rebuild request failed" };
    }
}
