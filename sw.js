
const FILE_BUNDLE = undefined;
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await self.skipWaiting();
      await bootstrApp();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await bootstrApp();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const file = FILE_BUNDLE[url];

  if (file) {
    event.respondWith(
      new Response(file.content, {
        headers: {
          'Content-Type': file.metaType || 'application/octet-stream'
        }
      })
    );
  } else {
    console.log(`Fetching from network: ${url}`);
    event.respondWith(fetch(event.request));
  }
});
