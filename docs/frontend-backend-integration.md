# Documentación técnica: integración Frontend (React + Vite) con backend actual

> Alcance: estado **actual** del repo `Amazon-Payments-reconciliation`, centrado en cómo el frontend consume backend/proxy local (sin depender de una integración directa con IDA Cloud desde el browser).

## 1) Resumen ejecutivo

El frontend está construido con React + Vite y organiza la navegación en rutas públicas (`/login`) y protegidas (dashboard y módulos de conciliación) mediante `AuthContext` + `ProtectedRoute`. La autenticación de sesión usa SAP Service Layer vía proxy (`/b1s/v1/*`) con cookies (`credentials: 'include'`), y además mantiene estado de sesión de UI en `localStorage` (`amazonpay_auth`, `amazonpay_user`).

La capa de datos está centralizada en `src/api/*`: la mayor parte del negocio se resuelve con un endpoint backend único (`POST VITE_API_URL` / `http://localhost:3010/api/Dynamic/process`) al que se le envía `Id` en headers para seleccionar el WS/proceso (261, 262, 265, 269, etc.). Para perfil de usuario se usa backend REST (`/api/me/profile`, `/api/me/avatar`) con headers de identidad temporal (`x-sap-user`, `x-company-db`). La exportación a PDF se ejecuta 100% en navegador con `jsPDF` + `jspdf-autotable`.

---

## 2) Arquitectura del frontend

## 2.1 Estructura de carpetas principal

```txt
src/
  api/                  # Capa de acceso a datos (fetch wrappers + funciones por dominio)
  components/
    pages/              # Páginas de ruta (Login, Dashboard, Orders, Refunds, Errors, Reports, Accounting, UserProfile)
    dashboard/          # Widgets/tabla/charts de reconciliation dashboard
    orders/             # Sales e Inpayments de orders
    refunds/            # Sales e Inpayments de refunds
    fees/               # Sales e Inpayments fees
    errors/             # Errores + detalle por settlement
    reports/            # Reportes mensuales + KPI
    accounting/         # Accounting + detalle por settlement
    layout/             # DashboardLayout, sidebars, top nav
    common|ui/          # Componentes reutilizables
  context/
    AuthContext.jsx     # Estado de autenticación y perfil
    DataContext.jsx     # Estado de CSV/data local en memoria
  hooks/
    useOrdersApi.js     # Hook auxiliar para consulta de órdenes
  utils/
    pdfExport/          # Exportación PDF (helper + columnas por pantalla)
    ...                 # métricas, filtros, paginación, mapeos
```

## 2.2 Ruteo y páginas principales

`App.jsx` define:

- Ruta pública: `/login`.
- Rutas protegidas bajo `DashboardLayout`:
  - `/dashboard` (Reconciliation Dashboard)
  - `/orders/:type` (`sales` / `payments` = Inpayments Orders)
  - `/refunds/:type` (`sales` / `payments` = Inpayments Refunds)
  - `/fees/:type` (`sales` / `payments` = Inpayments Fees)
  - `/errors`
  - `/reports`
  - `/accounting`
  - `/user-profile`
  - además detalles por settlement:
    - `/dashboard/settlements/:settlementId`
    - `/errors/settlements/:settlementId`
    - `/accounting/settlements/:settlementId`

`Payments` (`/payments`) existe como vista estática/demo (sin llamadas a API actuales).

---

## 3) Autenticación y control de acceso

## 3.1 Dónde se guarda sesión/token

- **UI auth state** en `localStorage`:
  - `amazonpay_auth` (string `'true'`/ausente)
  - `amazonpay_user` (JSON con `name`, `companyDb`, `sessionId`, `userKey`)
- **Sesión SAP Service Layer**: cookie HTTP (`B1SESSION`) manejada por navegador/backend al usar `credentials: 'include'` en `/b1s/v1/*`.
- No hay JWT propio almacenado en frontend para APIs de negocio.

## 3.2 Cómo se autentica el login

- `AuthContext.login(username,password)` envía:
  - `POST /b1s/v1/Login`
  - body: `{ UserName, Password, CompanyDB: 'SBO_COPA_LIVE' }`
- Si responde OK:
  - setea estado `isAuthenticated=true`
  - persiste en `localStorage`
  - intenta hidratar perfil (`GET /api/me/profile`).

## 3.3 Cómo se agrega credencial a requests

- **Service Layer (`slRequest`)**:
  - `fetch('/b1s/v1${path}', { credentials: 'include', headers: {'Content-Type':'application/json'} })`
- **Backend perfil (`backendRequest`)**:
  - `fetch('${VITE_API_BASE_URL}${path}', { credentials: 'include' ... })`
  - agrega headers:
    - `x-sap-user: user.name`
    - `x-company-db: user.companyDb`
- **API de conciliación (`idaRequest`)**:
  - usa header `Token: VITE_IDA_TOKEN || FALLBACK_TOKEN`
  - usa header `Id: <ws-id>`
  - `POST VITE_API_URL || http://localhost:3010/api/Dynamic/process`

## 3.4 Control de acceso a rutas

- `ProtectedRoute` revisa `isAuthenticated` + `loading` desde `useAuth()`:
  - `loading=true` → muestra `Loading...`
  - no autenticado → redirect a `/login`
  - autenticado → renderiza children.

---

## 4) Capa de consumo de APIs

## 4.1 BaseURL y variables de entorno

- `VITE_API_URL`: endpoint de proceso dinámico (default `http://localhost:3010/api/Dynamic/process`).
- `VITE_IDA_TOKEN`: token para header `Token` en `idaRequest`.
- `VITE_API_BASE_URL`: base para perfil/avatar (default `http://localhost:3010`).

## 4.2 Cliente HTTP usado

- No se usa axios: todo está implementado con **`fetch` nativo**.
- Wrappers:
  - `idaRequest(...)` (negocio reconciliación)
  - `slRequest(...)` (SAP Service Layer)
  - `backendRequest(...)` (perfil/avatar)

## 4.3 Proxy de desarrollo (Vite)

- `/api` → `http://localhost:3010`
- `/uploads` → `http://localhost:3010`
- `/b1s` → `https://HDB01:50000` (SAP Service Layer)
- `/ida-proxy` también proxea a backend local (rewrite específico)

## 4.4 Endpoints consumidos (lista completa)

## 4.4.1 Endpoints HTTP “reales” desde frontend

1. `POST {VITE_API_URL || http://localhost:3010/api/Dynamic/process}`
   - Headers: `Token`, `Id`, `Content-Type: application/json`
   - Body base: `{ "engine": "Worker", ...params }`
   - `Id` define WS lógico (261, 262, 263, ...).

2. SAP Service Layer
   - `POST /b1s/v1/Login`
   - `POST /b1s/v1/Logout`

3. Perfil usuario
   - `GET {VITE_API_BASE_URL}/api/me/profile`
   - `PUT {VITE_API_BASE_URL}/api/me/profile`
   - `POST {VITE_API_BASE_URL}/api/me/avatar` (multipart/form-data)
   - `DELETE {VITE_API_BASE_URL}/api/me/avatar`

## 4.4.2 WS lógicos (Id) usados por módulo

| Módulo/Página | Función API | Método/URL real | `Id` | Parámetros enviados |
|---|---|---|---:|---|
| Dashboard/Reconciliation | `getDashboard` | `POST /api/Dynamic/process` | 265 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` |
| Orders Sales | `getOrdersSales` | `POST /api/Dynamic/process` | 261 | `type: "ORDER"`, `fecha_desde`, `fecha_hasta`, `limit` |
| Orders Inpayments | `getOrdersPayments` | `POST /api/Dynamic/process` | 262 | `type: "ORDER"`, `fecha_desde`, `fecha_hasta`, `limit` |
| Refunds Sales | `getRefundsSales` | `POST /api/Dynamic/process` | 261 | `type: "REFUND"`, `fecha_desde`, `fecha_hasta`, `limit` |
| Refunds Inpayments | `getRefundsPayments` | `POST /api/Dynamic/process` | 262 | `type: "REFUND"`, `fecha_desde`, `fecha_hasta`, `limit` |
| Fees Sales | `getFeesSales` | `POST /api/Dynamic/process` | 263 | `types` CSV fijo + `fecha_desde`, `fecha_hasta` |
| Fees Inpayments | `getFeesPayments` | `POST /api/Dynamic/process` | 264 | `types` CSV fijo + `fecha_desde`, `fecha_hasta` |
| Errors | `getErrors` | `POST /api/Dynamic/process` | 267 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` |
| Errors KPI extra | `getErrorsSummary279` | `POST /api/Dynamic/process` | 279 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records`, `only_exceptions=0`, `top_n=20` |
| Errors settlement detail | `getSettlementErrorsDetail` | `POST /api/Dynamic/process` | 268 | `settlementId`, `limit_rows`, `txn_types_csv`, `amount_desc_like` |
| Reports | `getReports` | `POST /api/Dynamic/process` | 271 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` |
| Accounting | `getAccounting` | `POST /api/Dynamic/process` | 269 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` |
| Dashboard/Accounting settlement detail | `getAccountingSettlementDetails` | `POST /api/Dynamic/process` | 266 | `settlementId` |
| Login | `slLogin` | `POST /b1s/v1/Login` | - | `{ UserName, Password, CompanyDB }` |
| Logout | `slLogout` | `POST /b1s/v1/Logout` | - | sin body |
| Profile read | `getMyProfile` | `GET /api/me/profile` | - | headers `x-sap-user`, `x-company-db` |
| Profile update | `upsertMyProfile` | `PUT /api/me/profile` | - | body parcial de perfil + headers identidad |
| Avatar upload/delete | `uploadMyAvatar`, `deleteMyAvatar` | `POST/DELETE /api/me/avatar` | - | multipart (upload) o vacío (delete) |

## 4.5 Ejemplos de payloads reales (request/response)

## a) Login Service Layer

Request:
```json
POST /b1s/v1/Login
{
  "UserName": "my.sap.user",
  "Password": "******",
  "CompanyDB": "SBO_COPA_LIVE"
}
```

Response esperada en código (campos usados):
```json
{
  "SessionId": "...",
  "Version": "...",
  "SessionTimeout": 30
}
```

## b) Reconciliation API (WS 265 - Dashboard)

Request:
```json
POST /api/Dynamic/process
Headers: {
  "Token": "<VITE_IDA_TOKEN>",
  "Id": "265"
}
Body: {
  "engine": "Worker",
  "fecha_desde": "01-01-2025",
  "fecha_hasta": "01-31-2026",
  "status": "ALL",
  "limit_records": 50
}
```

Response usada por pantalla:
```json
{
  "summary": { "...": "..." },
  "rows": [ { "settlementId": "...", "status": "..." } ],
  "charts": { "...": [] }
}
```

## c) Profile API

Request:
```json
GET /api/me/profile
Headers: {
  "x-sap-user": "SAPUSER",
  "x-company-db": "SBO_COPA_LIVE"
}
```

Update request:
```json
PUT /api/me/profile
{
  "fullName": "John Doe",
  "email": "john@company.com",
  "phone": "...",
  "department": "Finance",
  "jobTitle": "Analyst"
}
```

---

## 5) Manejo de errores y estados

## 5.1 Loading states

Patrón general por página:

- `setLoading(true)` antes de fetch.
- `finally { setLoading(false) }`.
- Render condicional de skeletons (`*Skeleton`) o empty states.

Ejemplos:
- Dashboard/Errors/Reports/Accounting muestran skeleton + fallback de “No records found”.
- Login cambia botón a `Signing in...`.
- UserProfile usa `profileLoading` y `avatarUploading`.

## 5.2 Retry y timeouts

- **No hay retry automático** implementado en wrappers.
- **No hay timeout explícito** (`AbortController`) en `fetch`.

## 5.3 Errores de red vs negocio

- `idaRequest`: si `!res.ok`, lanza `Error("IDA error <status>: <body>")`.
- `slRequest`/`backendRequest`: parsean JSON y priorizan mensajes de negocio:
  - `error.message.value`
  - `Message`
  - texto plano
  - fallback `HTTP <status>`
- En páginas, el error se maneja con:
  - estado `error` mostrado en UI (Dashboard, Reports, Login, etc.) o
  - `console.error` y fallback silencioso (algunas pantallas como Accounting/Errors).

## 5.4 Validaciones y mensajes

- Login: valida `required` en inputs y muestra `err.message`.
- UserProfile:
  - valida email regex básico.
  - avatar valida MIME (`jpeg/png/webp`) y máximo 3MB.
- Filtros de tabla: validación funcional por estado/date/ids en cliente (sin schema formal).

---

## 6) Flujo de datos por página

> Nota: “Output” describe lo que renderiza cada pantalla con la data consumida.

| Página | Endpoint(s) | Parámetros clave | Output renderizado |
|---|---|---|---|
| Login | `POST /b1s/v1/Login` | `UserName`, `Password`, `CompanyDB` | Estado auth + redirección a dashboard |
| Reconciliation (`/dashboard`) | WS 265 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` | KPI cards, tabla settlements paginada, charts, modal detail |
| Sales Orders (`/orders/sales`) | WS 261 (`type=ORDER`) | `fecha_desde`, `fecha_hasta` (hoy fijos en componente), filtros client-side (`status`, `settlementId`, `sku`, etc.) | KPIs, tabla, charts, modal order detail |
| Inpayments Orders (`/orders/payments`) | WS 262 (`type=ORDER`) | `fecha_desde`, `fecha_hasta` desde filtros; filtros locales por settlement/order/sku/status | KPIs, tabla, charts, modal payment detail |
| Sales Refunds (`/refunds/sales`) | WS 261 (`type=REFUND`) | `fecha_desde`, `fecha_hasta`; filtros locales (`status`, `sku`, `orderId`, `settlement`) | KPIs, tabla, charts, modal detail |
| Inpayments Refunds (`/refunds/payments`) | WS 262 (`type=REFUND`) | `fecha_desde`, `fecha_hasta`; filtros locales (`status`, `reason`, `order`, `settlement`) | KPIs, tabla, charts, modal detail |
| Errors / Exceptions (`/errors`) | WS 267 + WS 279 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` (+ `only_exceptions`, `top_n`) | KPIs, tabla errores, charts, modal detail |
| Error Settlement Detail (`/errors/settlements/:settlementId`) | WS 268 | `settlementId`, `limit_rows`, `txn_types_csv`, `amount_desc_like` | Info card, tabla detalle paginada, charts breakdown |
| Reports (`/reports`) | WS 271 | `fecha_desde`, `fecha_hasta`, `status/limit_records` (ojo: UI usa `limit_months/pending`) | KPI monthly, tabla mensual paginada, charts |
| Accounting (`/accounting`) | WS 269 | `fecha_desde`, `fecha_hasta`, `status`, `limit_records` | KPIs, tabla, charts, modal detail |
| Accounting Settlement Detail (`/accounting/settlements/:settlementId`) | WS 266 | `settlementId` | Info card, tabla detalle, charts breakdown |
| Dashboard Settlement Detail (`/dashboard/settlements/:settlementId`) | WS 266 | `settlementId` | Info card, KPIs, tabla detalle, charts extras |
| Profile (`/user-profile`) | `GET/PUT /api/me/profile`, `POST/DELETE /api/me/avatar` | headers identidad (`x-sap-user`,`x-company-db`) + payload perfil/avatar | Form de perfil, avatar upload/delete, mensajes estado |
| Payments (`/payments`) | N/A | N/A | Vista estática sin backend |

---

## 7) Exportación a PDF

- Implementación central: `src/utils/pdfExport/exportTableToPdf.js`.
- Librerías: `jsPDF`, `jspdf-autotable`.
- Flujo:
  1. Cada página arma `rows`, `columns`, `headerBlocks` (KPIs) y opcionalmente `chartImages`.
  2. `exportRowsToPdf` genera PDF en navegador y ejecuta `doc.save(fileName)`.
- **No llama backend** para generar PDF.
- Páginas con export PDF activo: Dashboard, Orders (sales/payments), Refunds (sales/payments), Fees (sales/payments), Errors, Reports, Accounting.

---

## 8) Diagrama textual del flujo actual

```txt
Usuario
  -> (UI React: Login + páginas protegidas)
  -> Frontend (Vite, Router, Context)
     -> Auth requests a SAP Service Layer (/b1s/v1/Login|Logout) vía proxy Vite/backend
     -> Data requests a backend process endpoint (/api/Dynamic/process, Id=<WS>)
     -> Profile requests a backend REST (/api/me/profile, /api/me/avatar)
  -> Backend actual (localhost:3010 en dev)
     -> Orquesta WS por Id (261/262/265/266/267/268/269/271/279)
     -> Integra SAP Service Layer y/o origen de conciliación
  -> DB / SAP / fuentes de datos (según implementación backend)
```

---

## 9) Lista de archivos clave para revisar

### Routing/auth/layout
- `src/App.jsx`
- `src/context/AuthContext.jsx`
- `src/components/pages/Login.jsx`
- `vite.config.js`

### API layer
- `src/api/base.js`
- `src/api/orders.js`
- `src/api/refunds.js`
- `src/api/fees.js`
- `src/api/dashboard.js`
- `src/api/error.js`
- `src/api/reports.js`
- `src/api/accounting.js`
- `src/api/userProfile.js`

### Pages / feature modules
- `src/components/pages/Dashboard.jsx`
- `src/components/pages/Orders.jsx`
- `src/components/orders/SalesOrders.jsx`
- `src/components/orders/SalesInpayemts.jsx`
- `src/components/pages/Refunds.jsx`
- `src/components/refunds/RefundsSales.jsx`
- `src/components/refunds/RefundsPayments.jsx`
- `src/components/pages/Fees.jsx`
- `src/components/fees/sales/SalesFees.jsx`
- `src/components/fees/inpayments/InpaymentsFees.jsx`
- `src/components/pages/Errors.jsx`
- `src/components/errors/settlement/SettlementInfo.jsx`
- `src/components/pages/Reports.jsx`
- `src/components/pages/Accounting.jsx`
- `src/components/accounting/SettlementDetail.jsx`
- `src/components/dashboard/SettlementDetail.jsx`
- `src/components/pages/UserProfile.jsx`

### PDF/export
- `src/utils/pdfExport/exportTableToPdf.js`
- `src/utils/pdfExport/*.js` (columnas por pantalla)

