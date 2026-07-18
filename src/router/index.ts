import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'search',
    component: () => import('@/views/SearchView.vue'),
  },
  {
    path: '/properties/:id',
    name: 'property-detail',
    component: () => import('@/views/PropertyDetailView.vue'),
  },
  {
    path: '/booking',
    name: 'booking-flow',
    component: () => import('@/views/BookingFlowView.vue'),
  },
  {
    path: '/my-bookings',
    name: 'my-bookings',
    component: () => import('@/views/MyBookingsView.vue'),
  },
  {
    path: '/admin',
    name: 'admin-dashboard',
    component: () => import('@/views/AdminDashboardView.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
