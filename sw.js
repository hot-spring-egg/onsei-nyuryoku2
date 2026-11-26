// アプリ化（ホーム画面に追加）用のサービスワーカー
// 常にネットワークから最新を取得し、オフライン時だけ保存済みのページを返す
const CACHE = 'onsei-memo-v1';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()));

self.addEventListener('fetch', (event) => {
    const req = event.request;
    if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
    event.respondWith(
        fetch(req)
            .then((res) => {
                if (res.ok) {
                    const copy = res.clone();
                    caches.open(CACHE).then((c) => c.put(req, copy));
                }
                return res;
            })
            .catch(() => caches.match(req).then((hit) => hit || Promise.reject(new Error('offline'))))
    );
});
