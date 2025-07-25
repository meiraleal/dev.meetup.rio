
importScripts("backend.js");

const bootstrApp = async () => {
  // Load initial data from data.json
  try {
    const response = await fetch('data.json');
    const data = await response.json();
    $APP.data = data;
  } catch (error) {
    console.error('Error loading initial data:', error);
  }
  return $APP.Backend.bootstrap({ models: $APP.models, data: $APP.data });
};

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
  console.log(event.request.url);
});

self.addEventListener("message", (event) => {
  console.log("Message received:", event.data.eventId, event.data.type);
  $APP.Backend.handleMessage(event, event.data);
});