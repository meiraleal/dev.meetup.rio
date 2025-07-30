if (!("serviceWorker" in navigator)) {
	console.warn("Service Worker not supported.");
	throw "Error, platform not supported";
}
await navigator.serviceWorker.register("/sw.js", {
	scope: "/",
});
await navigator.serviceWorker.ready;

await import("/bootstrap.js");
await import("/app.js");
