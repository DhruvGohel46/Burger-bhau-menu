export async function triggerNetlifyBuildHook() {
    const hookUrl = process.env.NEXT_PUBLIC_NETLIFY_BUILD_HOOK_URL || process.env.NETLIFY_BUILD_HOOK_URL;
    if (hookUrl) {
        try {
            await fetch(hookUrl, { method: "POST" });
            console.log("Triggered Netlify build hook successfully.");
        } catch (err) {
            console.error("Failed to trigger Netlify build hook:", err);
        }
    }
}
