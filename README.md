# food waste app

web application for community food sharing - web technologies project, ase 2025-2026

## overview

this app helps reduce food waste by allowing users to track their fridge inventory and share items about to expire with specific circles. instead of throwing food away, users mark items as available for friends to claim.

## key features

- **fridge management**: track items with expiration dates and automated status alerts (expiring soon/expired).
- **barcode scanning**: instant product entry using external api (openfoodfacts).
- **marketplace**: explore and claim available products from other community members.
- **whatsapp integration**: direct communication for product pickup coordination via whatsapp links.
- **friend groups**: create and join private groups with member moderation (kick members) and shared dietary preferences.
- **premium dark mode**: fully integrated dark theme with persistent switch.
- **social sharing**: share available items to facebook, whatsapp, and twitter.

## tech stack

- **frontend**: react.js (vite) + tailwind css + lucide icons.
- **backend**: node.js + express.
- **database**: postgresql (supabase) managed via sequelize orm.
- **hosting**: vercel (frontend) and render (backend).

## core api endpoints

### authentication

- `POST /api/auth/register` - create account
- `POST /api/auth/login` - session start

### product management

- `GET /api/products` - own fridge items
- `GET /api/products/explore` - marketplace items
- `POST /api/products` - add manual item
- `GET /api/products/scan/:barcode` - fetch external data
- `PATCH /api/products/:id/available` - toggle marketplace visibility
- `POST /api/products/:id/claim` - claim community item

### user & social

- `GET /api/users/profile` - fetch bio, tags, phone
- `POST /api/users/profile` - update contact info
- `GET /api/groups` - list joined circles
- `GET /api/groups/:id/members` - view group details (admin restricted)
- `POST /api/groups` - create new circle
- `POST /api/groups/:id/join` - enroll by id
- `DELETE /api/groups/:id/members/:userId` - remove member (admin only)

## project timeline

- **november**: specifications and architecture setup.
- **december (early)**: backend development and rest api implementation.
- **december (late)**: frontend development, third-party integrations, and final deployment.
