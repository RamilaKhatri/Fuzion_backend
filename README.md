# Fuzion Café Backend

Node.js + Express + Sequelize + SQLite REST API with JWT authentication and an Admin Management Panel.

## Run

```bash
npm install
```

Create `.env`:

```env
PORT=5000
JWT_SECRET=put_a_long_random_secret_here
UPLOADTHING_TOKEN=your_uploadthing_token
```

For Render, add `JWT_SECRET` and `UPLOADTHING_TOKEN` under the service's Environment Variables. Do not commit `.env` or either secret.

Then create/refresh an admin:

```bash
node create-admin.js "admin@fuzion.com" "Admin@12345" "Fuzion Admin"
```

Start:

```bash
npm start
```

Open:

- Admin Login: `http://localhost:5000/`
- Dashboard: `http://localhost:5000/dashboard.html`
- API health: `http://localhost:5000/api/health`

## Main APIs

### Auth
- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/admin-login`

### Profile
- `GET /api/profile` (JWT)
- `PUT /api/profile` (JWT)

### Users (Admin)
- `GET /api/users`
- `GET /api/users/:id`
- `PUT /api/users/:id`
- `PATCH /api/users/:id/status`
- `DELETE /api/users/:id`

### Menu
- `GET /api/menu`
- `GET /api/menu/:id`
- `POST /api/menu` (Admin)
- `PUT /api/menu/:id` (Admin)
- `PATCH /api/menu/:id/availability` (Admin)
- `DELETE /api/menu/:id` (Admin)

### Bookings
- `POST /api/bookings`
- `GET /api/bookings` (Admin)
- `GET /api/bookings/:id` (Admin)
- `PUT /api/bookings/:id` (Admin)
- `PATCH /api/bookings/:id/status` (Admin)
- `DELETE /api/bookings/:id` (Admin)

### Enquiries
- `POST /api/enquiries`
- `GET /api/enquiries` (Admin)
- `GET /api/enquiries/:id` (Admin)
- `PUT /api/enquiries/:id` (Admin)
- `DELETE /api/enquiries/:id` (Admin)

### Orders
- `POST /api/orders`
- `GET /api/orders` (Admin)
- `GET /api/orders/:id` (Admin)
- `PUT /api/orders/:id` (Admin)
- `PATCH /api/orders/:id/status` (Admin)
- `DELETE /api/orders/:id` (Admin)

### Gallery
- `GET /api/gallery`
- `GET /api/gallery/:id`
- `POST /api/gallery` (Admin)
- `PUT /api/gallery/:id` (Admin)
- `DELETE /api/gallery/:id` (Admin)

### Projects
- Full CRUD under `/api/projects` (Admin)

### Dashboard
- `GET /api/admin/dashboard` (Admin)

## Postman

Import `postman/Fuzion-Cafe-Backend.postman_collection.json`. Set the `baseUrl` variable to `http://localhost:5000`. After admin login, copy the returned JWT into the `token` collection variable.
