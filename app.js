if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/sw.js")
    .then((result) => console.log("service registered", result))
    .catch((err) => console.log("service failed", err));
}
