# Railway VLESS WebSocket TCP Relay v4.6

نسخه Railway از پروژه‌ای که در Vercel v4.6 کار می‌کرد.

## معماری

v2rayNG → TLS/WSS → Railway Edge → Node.js WebSocket `/api/ws` → TCP relay → Internet

Railway در لبه خود TLS را terminate می‌کند؛ بنابراین Node.js داخل سرویس نیازی به گواهی TLS ندارد.

## مشخصات

- VLESS
- WebSocket روی `/api/ws`
- TCP relay واقعی
- سازگار با v2rayNG
- buffering برای فریم‌های ابتدایی
- backpressure بین WebSocket و TCP
- TCP_NODELAY
- TCP keepalive
- IPv4-preferred DNS
- فقط TCP و پورت‌های مقصد 80/443
- `perMessageDeflate` خاموش
- Node.js 22+
- پورت سرویس از `process.env.PORT` خوانده می‌شود و روی `0.0.0.0` گوش می‌دهد

## Deploy روی Railway بدون کارت

1. پروژه را در GitHub قرار دهید (مثلاً یک repository خصوصی).
2. در Railway یک پروژه جدید بسازید.
3. گزینه Deploy from GitHub Repo را انتخاب کنید.
4. repository را انتخاب کنید.
5. در Variables مقدار زیر را قرار دهید:

   `VLESS_UUID=d51cad89-5064-4db9-a49e-e09de5254673`

6. Deploy را انجام دهید.
7. برای سرویس از Settings/Networking یک Public Domain تولید کنید.
8. ابتدا این آدرس را تست کنید:

   `https://YOUR-RAILWAY-DOMAIN/api/health`

باید JSON مشابه زیر دریافت شود:

`{"ok":true,"service":"vless-ws-v4.6","endpoint":"/api/ws"}`

Railway برای WebSocket نیازی به تنظیم جداگانه ندارد؛ سرویس باید روی `0.0.0.0` و `PORT` محیطی Railway گوش دهد.

## v2rayNG

- Protocol: VLESS
- Address: دامنه Railway، مثلاً `xxxx.up.railway.app`
- Port: `443`
- UUID: `d51cad89-5064-4db9-a49e-e09de5254673`
- Encryption: none
- Network: WS
- Path: `/api/ws`
- Host: دامنه Railway
- TLS: ON
- SNI: دامنه Railway
- ALPN: `http/1.1`
- Fingerprint: chrome
- Flow: خالی

### نکته مهم

در Railway نباید `http://` یا `https://` را در Address وارد کنید؛ فقط hostname را وارد کنید.

## تفاوت با Vercel

این نسخه دیگر Vercel Function نیست. `server.js` همان HTTP server نسخه v4.6 را روی پورت محیطی Railway اجرا می‌کند و WebSocketServer روی `/api/ws` به همان server متصل است.

TLS در Railway Edge انجام می‌شود و ارتباط عمومی کلاینت با سرویس به صورت `wss://` خواهد بود.

## محدودیت

این پروژه Xray-core و XHTTP نیست. Transport آن VLESS over WebSocket است و relay خروجی TCP انجام می‌دهد.


## Troubleshooting v4.6

برای فعال بودن لاگ تشخیصی WebSocket/VLESS، مقدار `VLESS_DEBUG=1` را در Railway Variables قرار دهید.
در این حالت هنگام اتصال باید لاگ‌هایی مانند `HTTP upgrade`، `WS connection`، `VLESS parsed` و `UPSTREAM connected` دیده شوند.
