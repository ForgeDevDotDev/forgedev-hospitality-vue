<template>
  <div class="my-bookings">
    <h1>Mis Reservas</h1>

    <div v-if="bookingsStore.loading" class="loading">Cargando reservas...</div>
    <div v-else-if="bookingsStore.error" class="error">{{ bookingsStore.error }}</div>

    <div v-else-if="bookingsStore.bookings.length" class="bookings-list">
      <div v-for="booking in bookingsStore.bookings" :key="booking.id" class="booking-card" :class="{ cancelled: booking.status === 'CANCELLED' }">
        <div class="booking-header">
          <h3>{{ booking.room?.name || 'Habitación' }}</h3>
          <span :class="['status-badge', `status-${booking.status.toLowerCase()}`]">{{ booking.status }}</span>
        </div>
        <p class="property-name">{{ booking.room?.property?.name || '—' }}</p>
        <div class="booking-dates">
          <span>📅 {{ formatDate(booking.checkIn) }} → {{ formatDate(booking.checkOut) }}</span>
          <span>👥 {{ booking.numGuests }} huéspedes</span>
        </div>
        <div class="booking-price">
          <span>Total: {{ formatPrice(booking.totalPrice) }}</span>
        </div>
        <button
          v-if="booking.status === 'CONFIRMED'"
          class="btn btn-secondary"
          @click="cancelBooking(booking.id)"
        >
          Cancelar reserva
        </button>
      </div>
    </div>

    <div v-else class="no-bookings">
      <p>No tienes reservas todavía.</p>
      <router-link to="/" class="btn btn-primary">Buscar hoteles</router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { useBookingsStore } from '@/stores/bookings';

const bookingsStore = useBookingsStore();

onMounted(() => {
  bookingsStore.fetchBookings();
});

function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  // BUG: Inconsistent date format — uses toLocaleDateString without specifying locale
  // Some places use es-ES, here it uses the browser default
  return date.toLocaleDateString();
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

async function cancelBooking(id: string) {
  if (!confirm('¿Estás seguro de cancelar esta reserva?')) return;
  try {
    await bookingsStore.cancelBooking(id);
  } catch (err: any) {
    alert('Error al cancelar: ' + err.message);
  }
}
</script>

<style scoped>
.my-bookings {
  max-width: 800px;
}
.bookings-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
.booking-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.booking-card.cancelled {
  opacity: 0.6;
}
.booking-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}
.status-badge {
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
}
.status-confirmed {
  background: #d4edda;
  color: #155724;
}
.status-cancelled {
  background: #f8d7da;
  color: #721c24;
}
.property-name {
  color: #666;
  font-size: 0.9rem;
}
.booking-dates {
  display: flex;
  gap: 1.5rem;
  margin: 0.75rem 0;
}
.booking-price {
  font-weight: 700;
  margin-bottom: 0.75rem;
}
.no-bookings {
  text-align: center;
  padding: 3rem;
}
</style>
