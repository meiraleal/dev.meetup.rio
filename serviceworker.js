
importScripts("backend.js");
const bootstrap = async () => {
  const APP = await self.APP.bootstrap(true);
  if (APP) {
    await self.APP.Backend.bootstrap(APP);
  }
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      await self.skipWaiting();
      await bootstrap();
    })()
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      await self.clients.claim();
      await bootstrap();
    })()
  );
});

self.addEventListener("fetch", (event) => {
  console.log(event.request.url);
});

self.addEventListener("message", (event) => {
  console.log("Message received:", event.data.eventId, event.data.type);
  self.APP.Backend.handleMessage(event, event.data);
});
