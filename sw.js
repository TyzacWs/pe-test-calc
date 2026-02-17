const CACHE_NAME = "pe-test-calc-v1";
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./sw.js"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k !== CACHE_NAME ? caches.delete(k) : null)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request).then((resp) => {
        const copy = resp.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, copy));
        return resp;
      }).catch(() => cached);
    })
  );
});
function generateReport() {
  const location = $('location').value || 'Not specified';
  const date = $('date').value || 'Not specified';
  const temp = $('temp').value || 'Not specified';
  const pressure = $('pressure').value || 'Not specified';
  const duration = $('duration').value || 'Not specified';

  const v2 = $('v2').value;
  const v3 = $('v3').value;
  const v4 = $('v4').value;
  const v5 = $('v5').value;

  const dv32 = $('dv32').textContent;
  const dv54 = $('dv54').textContent;
  const vall = $('vallOut').textContent;
  const allowable = $('allowOut').textContent;
  const status = $('status').textContent;

  const report = `
PE WATER MAIN PRESSURE TEST REPORT
------------------------------------

Location: ${location}
Date: ${date}

Test Pressure: ${pressure} kPa
Water Temperature: ${temp} °C
Test Duration: ${duration} hours

Hourly Volume Readings:
2h: ${v2} L
3h: ${v3} L
4h: ${v4} L
5h: ${v5} L

Calculated Values:
ΔV (3h−2h): ${dv32}
ΔV (5h−4h): ${dv54}
Vall (make-up allowance): ${vall}
Allowable Limit: ${allowable}

Assessment Rule:
ΔV (5h−4h) ≤ 0.55 × ΔV (3h−2h) + Vall

FINAL RESULT: ${status}

------------------------------------
Calculated in accordance with project
PE pipeline pressure test procedure.
`;

  $('reportOutput').value = report;
}

function copyReport() {
  const text = $('reportOutput').value;
  if (!text) return;
  navigator.clipboard.writeText(text).then(() => {
    alert("Report copied to clipboard");
  });
}

$('genReportBtn').addEventListener('click', generateReport);
$('copyReportBtn').addEventListener('click', copyReport);
