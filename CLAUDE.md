# CLAUDE.md — Entre Peces

## Qué es este proyecto

**Entre Peces** es un marketplace web de acuariofilia para Colombia. Aplicación React SPA que permite buscar, filtrar y comprar peces, plantas, camarones y accesorios de acuario. Los productos se sincronizan desde Google Sheets.

## Tech Stack

- **Frontend:** React 19 + TypeScript + Vite 6 + Tailwind CSS 4 + Motion (Framer Motion)
- **Icons:** Lucide React + SVGs custom (Shrimp, Pump, WhatsApp, Facebook, Instagram)
- **Backend:** Python HTTP server (`server/register.py`, puerto 3001) — registro, login y pedidos via Google Sheets API
- **Base de datos:** Google Sheets (Spreadsheet ID: `1VJQQYndKRoIC4Y9itm57hqGN2yspitCuBMdDHFxbn9M`)
- **Hojas:** ENTREPECES (productos), Clientes Registrados (usuarios), Pedidos del dia (órdenes)

## Comandos

```bash
# Desarrollo (frontend + API)
npm run dev                          # Vite en puerto 3000
python server/register.py            # API en puerto 3001

# Build
npm run build                        # Producción → /dist
npm run preview                      # Preview del build

# Sync de productos desde Google Sheets
python scripts/sync_products.py      # Manual
scripts/sync_weekly.bat              # Automático (Windows Task Scheduler, lunes 10am)

# Type check
npm run lint
```

## Arquitectura

```
src/
  App.tsx              — Componente principal (~2200 líneas, monolítico)
  HeroCarousel.tsx     — Carrusel hero con 3 slides de Discos
  CompatibilityTable.tsx — Matriz de compatibilidad 25×25 especies
  types.ts             — Product, CartItem, Category, User
  constants.ts         — Catálogo hardcoded (fallback si products.json falla)
  index.css            — Theme: brand-blue, brand-dark, brand-light

server/
  register.py          — API endpoints: /api/register, /api/login, /api/order

scripts/
  sync_products.py     — Lee Sheet ENTREPECES → genera public/products.json
  sync_weekly.bat      — Sync semanal + git push
```

## Flujo de datos

1. **Productos:** Google Sheet (ENTREPECES) → `sync_products.py` → `public/products.json` → App
2. **Usuarios:** Formulario → `/api/register` o `/api/login` → Google Sheet (Clientes Registrados)
3. **Pedidos:** Carrito → formulario entrega → `/api/order` → Google Sheet (Pedidos del dia)
4. **Persistencia local:** Cart, user, favorites en `localStorage`

## Columnas del Sheet ENTREPECES

- A=Científico, C=Nombre Común, F=Tamaño, G=Precio, J=LINK DE IMAGEN

## Categorías (11)

Peces, Plantas, Camarones, Plantados, Termostatos, Filtros, Alimentos, Acondicionadores, Gravilla, Medidores, Lamparas

## Pagos

- **Nequi** (activo) — QR en `/payment/nequi-qr.jpg`
- **Bold** (activo) — Link de pago por WhatsApp
- **Daviplata** / **Bitcoin** — Próximamente

## Convenciones

- WhatsApp de contacto: `+57 312 438 0879`
- Envío gratis desde COP $200,000
- Moneda: COP (pesos colombianos)
- Idioma de la app: Español
- API_URL en dev: `http://localhost:3001`
- Google helper: `~/.openclaw/workspace/skills/google-auth/scripts/google_helper.py`
- Imágenes de productos en postimg.cc
- `referrerPolicy="no-referrer"` en todas las imágenes externas

## Notas importantes

- App.tsx es monolítico — toda la UI está en un solo archivo
- El server Python requiere credenciales de Google en `~/.openclaw/`
- No modificar `public/products.json` manualmente — se regenera con sync
- `constants.ts` es fallback y no se sincroniza
