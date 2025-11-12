# Food Waste App

Web app for reducing food waste through community sharing - Web Technologies project, ASE 2025-2026

## About

Web application that helps people reduce food waste by sharing with their community. The idea: got something in your fridge that's about to expire? Instead of throwing it away, mark it as available and let your friends claim it.

## Features

**Core functionality:**
- Fridge inventory organized by categories
- Expiration date tracking + notifications
- Mark products as available for sharing
- Other users can claim products
- Friend groups with tags (vegetarian, carnivore, etc.)
- Social media sharing (Instagram, Facebook)

## Tech Stack

**Frontend:** React.js  
**Backend:** Node.js + Express  
**Database:** PostgreSQL/MySQL with Sequelize ORM  
**Deployment:** TBD

## Database Structure (draft)

**Users** - user accounts  
**Products** - product list with expiration dates  
**Categories** - food categories  
**FriendGroups** - friend groups  
**Notifications** - expiration alerts

*more details to be added later

## API Endpoints (initial plan)

**Auth:**
- POST /api/auth/register
- POST /api/auth/login

**Products:**
- GET /api/products - get my products
- POST /api/products - add product
- PUT /api/products/:id - update product
- DELETE /api/products/:id - delete product
- PATCH /api/products/:id/available - mark as available
- POST /api/products/:id/claim - claim product

**Groups & Friends:** TBD

## Timeline

**Now (Nov 16):** Specs + repository setup  
**By Dec 6:** Functional backend with REST API  
**By late Dec:** React frontend + complete integrations

*Note: will update README as I go based on commits and implementations.