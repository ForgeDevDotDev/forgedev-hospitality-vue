# ForgeDev Hospitality Vue

> Vue 3 frontend for the Hospitality domain — hotel booking platform with search, availability calendar, and reservation flow

**Part of [ForgeDev](https://forgedev.dev)** — Structured work simulation for junior developers.

---

## 📜 License

This project is dual-licensed:

| Version | License | Use Case |
|---------|---------|----------|
| Community | AGPL-3.0 | Free for personal and open-source use. Network service modifications must be published. |
| Commercial | Commercial License | For organizations that want to use this project without AGPL obligations. Contact **info@forgedev.dev** |

See [LICENSE](./LICENSE), [COMMERCIAL-LICENSE.md](./COMMERCIAL-LICENSE.md), and [CLA.md](./CLA.md) for details.

---

## 🤝 Contributing

Contributions are welcome! Please read:

- [CONTRIBUTING.md](./CONTRIBUTING.md) — Contribution guide, revenue sharing model, and PR process
- [CLA.md](./CLA.md) — Contributor License Agreement (must sign before merging)

---

## 🏗 Project Structure

```
forgedev-hospitality-vue/
├── src/
│   ├── api/
│   │   └── index.ts            # Axios API module (properties, rooms, bookings, guests, pricing, amenities)
│   ├── assets/
│   │   └── main.css            # Global styles
│   ├── components/
│   │   ├── PropertyCard.vue    # Hotel property card
│   │   ├── BookingCalendar.vue # Monthly calendar with booked dates
│   │   ├── DateRangePicker.vue # Check-in / check-out date picker
│   │   ├── GuestFilter.vue     # Guest count selector
│   │   ├── BookingForm.vue     # Guest info + booking confirmation form
│   │   └── AmenitiesFilter.vue # Amenity checkbox filter
│   ├── router/
│   │   └── index.ts            # Vue Router config
│   ├── stores/
│   │   ├── properties.ts       # Properties store (list, search, CRUD)
│   │   ├── bookings.ts         # Bookings store (create, list, cancel)
│   │   └── search.ts           # Search filter state (dates, guests, city, amenities)
│   ├── views/
│   │   ├── SearchView.vue      # Property search with filters
│   │   ├── PropertyDetailView.vue # Property details + room list
│   │   ├── BookingFlowView.vue # Booking flow (room → guest info → confirm)
│   │   ├── MyBookingsView.vue  # User's bookings list + cancel
│   │   └── AdminDashboardView.vue # Property management dashboard
│   ├── App.vue                 # Root component with navbar
│   └── main.ts                 # App entry point
├── package.json
├── vite.config.ts
└── tsconfig.json
```

### Getting Started

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:3000)
npm run dev
```

### Key Features

- **Search** with date, guest, city, star rating, and amenity filters
- **Property detail** with room list and availability
- **Booking flow** with guest information form
- **My Bookings** list with cancel functionality
- **Admin dashboard** for property, amenity, and pricing rule management

---

## 🔗 Links

- **ForgeDev:** https://forgedev.dev
- **GitHub Org:** https://github.com/ForgeDevDotDev
- **Contact:** info@forgedev.dev

---

## 📁 Related Repositories

Vue frontend for the **Hospitality** domain. Connects to:

| Repo | Role |
|------|------|
| forgedev-hospitality-backend | Backend API |
| forgedev-hospitality-react | React frontend (same domain) |
