importScripts("/assets/dyn/config.js?v=10-02-2024");
importScripts("/assets/dyn/worker.js?v=10-02-2024");
importScripts("/assets/ultra/bundle.js?v=10-02-2024");
importScripts("/assets/ultra/config.js?v=10-02-2024");
importScripts(__uv$config.sw || "/assets/ultra/sw.js?v=10-02-2024");

const uv = new UVServiceWorker();
const dynamic = new Dynamic();

const userKey = new URL(location).searchParams.get("userkey");
self.dynamic = dynamic;

// Helper function: inject tabcloak.js into HTML
async function injectTabCloak(response) {
  try {
    const contentType = response.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return response;

    let text = await response.text();
    // Inject tabcloak.js before </body>
    text = text.replace(
      /<\/body>/i,
      '<script src="/assets/js/tabcloak.js"></script></body>'
    );

    return new Response(text, {
      headers: response.headers,
      status: response.status,
      statusText: response.statusText,
    });
  } catch (e) {
    console.error("Failed to inject tabcloak.js", e);
    return response;
  }
}

self.addEventListener("fetch", (event) => {
  event.respondWith(
    (async () => {
      if (await dynamic.route(event)) {
        const resp = await dynamic.fetch(event);
        return await injectTabCloak(resp);
      }

      if (event.request.url.startsWith(`${location.origin}/a/`)) {
        const resp = await uv.fetch(event);
        return await injectTabCloak(resp);
      }

      return await fetch(event.request);
    })()
  );
});
