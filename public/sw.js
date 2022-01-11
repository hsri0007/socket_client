self.addEventListener("install", (e) => {
  console.log(" installer running");
  e.waitUntil(
    caches.open("static").then((cache) => {
      console.log("pre-caching-app-shell");

      return cache.addAll([
        "/",
        "index.html",
        "index.js",
        "/static/js/main.chunk.js",
        "/static/js/bundle.js",
        "/static/js/vendors~main.chunk.js",
        "/favicon.ico",
      ]);
    })
  );
});
self.addEventListener("activate", (e) => {
  console.log(" activate running");
  e.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(
        keyList.map((key) => {
          if (key !== "static" && key !== "dynamic") {
            return caches.delete(key);
          }
        })
      );
    })
  );
  return self.clients.claim();
});
self.addEventListener("fetch", (e) => {
  console.log(" fetch running");
  e.respondWith(
    caches.match(e.request).then(function (response) {
      if (response) {
        return response;
      } else {
        return fetch(e.request).then((res) => {
          return caches.open("dynamic").then(() => {
            caches.put(e.request.url, res.clone());
            return res;
          });
        });
      }
    })
  );
});
