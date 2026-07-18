<template>
  <div class="booking-flow">
    <h1>Reservar habitación</h1>

    <div v-if="loading" class="loading">Cargando...</div>

    <div v-else-if="!room" class="error">
      <p>No se pudo cargar la habitación. <router-link to="/">Volver</router-link></p>
    </div>

    <div v-else class="booking-steps">
      <!-- Step 1: Confirm room and dates -->
      <div class="step">
        <h2>1. Confirmar habitación</h2>
        <div class="room-info">
          <h3>{{ room.name }}</h3>
          <p>{{ room.description }}</p>
          <p>Capacidad: {{ room.capacity }} personas</p>
          <p>Precio base: {{ formatPrice(room.basePrice) }} / noche</p>
        </div>
        <div class="date-display">
          <span>Check-in: {{ checkIn }}</span>
          <span>Check-out: {{ checkOut }}</span>
          <span>Noches: {{ nights }}</span>
        </div>
      </div>

      <!-- Step 2: Guest info + confirm -->
      <div class="step">
        <h2>2. Datos del huésped</h2>
        <BookingForm
          :room="room"
          :check-in="checkIn"
          :check-out="checkOut"
          @submit="createBooking"
        />
      </div>

      <p v-if="error" class="error">{{ error }}</p>
      <p v-if="success" class="success">✅ Reserva confirmada! <router-link to="/my-bookings">Ver mis reservas</router-link></p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useBookingsStore } from '@/stores/bookings';
import { roomsApi, guestsApi } from '@/api';
import BookingForm from '@/components/BookingForm.vue';

const route = useRoute();
const router = useRouter();
const bookingsStore = useBookingsStore();

const room = ref<{ id: string; name: string; description: string; capacity: number; basePrice: number } | null>(null);
const loading = ref(true);
const error = ref('');
const success = ref(false);

const checkIn = computed(() => (route.query.checkIn as string) || '');
const checkOut = computed(() => (route.query.checkOut as string) || '');

const nights = computed(() => {
  if (!checkIn.value || !checkOut.value) return 0;
  const ci = new Date(checkIn.value);
  const co = new Date(checkOut.value);
  return Math.ceil((co.getTime() - ci.getTime()) / (1000 * 60 * 60 * 24));
});

onMounted(async () => {
  const roomId = route.query.roomId as string;
  if (!roomId) {
    error.value = 'No room selected';
    loading.value = false;
    return;
  }
  try {
    const res = await roomsApi.get(roomId);
    room.value = res.data.data;
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

async function createBooking(data: Record<string, unknown>) {
  error.value = '';
  success.value = false;
  try {
    // First create or find the guest
    const guestData = data.guest as Record<string, string>;
    let guestId: string;
    try {
      const guestRes = await guestsApi.create({
        firstName: guestData.firstName,
        lastName: guestData.lastName,
        email: guestData.email,
        phone: guestData.phone,
      });
      guestId = guestRes.data.data.id;
    } catch (err: any) {
      // If guest already exists (email conflict), we need to look them up
      // FIXME: This doesn't handle that case — should fetch guests by email
      // For now, just rethrow
      throw err;
    }

    await bookingsStore.createBooking({
      roomId: data.roomId,
      guestId,
      checkIn: data.checkIn,
      checkOut: data.checkOut,
      numGuests: data.numGuests,
      specialRequests: data.specialRequests,
    });
    success.value = true;
  } catch (err: any) {
    error.value = err.message || 'Error al crear la reserva';
  }
}
</script>

<style scoped>
.booking-flow {
  max-width: 700px;
}
.step {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.room-info h3 {
  margin-bottom: 0.5rem;
}
.date-display {
  display: flex;
  gap: 1.5rem;
  margin-top: 1rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
}
.success {
  color: #28a745;
  font-size: 1.1rem;
}
</style>
