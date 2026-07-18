<template>
  <form @submit.prevent="submit" class="booking-form">
    <h2>Complete su reserva</h2>

    <div class="form-group">
      <label>Nombre</label>
      <input v-model="form.firstName" type="text" required placeholder="Juan" />
    </div>

    <div class="form-group">
      <label>Apellidos</label>
      <input v-model="form.lastName" type="text" required placeholder="García" />
    </div>

    <div class="form-group">
      <label>Email</label>
      <input v-model="form.email" type="email" required placeholder="juan@email.com" />
    </div>

    <div class="form-group">
      <label>Teléfono</label>
      <input v-model="form.phone" type="tel" placeholder="+34 666 123 456" />
    </div>

    <div class="form-group">
      <label>Número de huéspedes</label>
      <input v-model.number="form.numGuests" type="number" min="1" :max="room?.capacity || 10" />
    </div>

    <div class="form-group">
      <label>Peticiones especiales</label>
      <textarea v-model="form.specialRequests" rows="3" placeholder="Cama extra, llegada tardía, etc."></textarea>
    </div>

    <div class="booking-summary">
      <div class="summary-row">
        <span> Habitación:</span>
        <span>{{ room?.name || '—' }}</span>
      </div>
      <div class="summary-row">
        <span>Check-in:</span>
        <span>{{ checkIn }}</span>
      </div>
      <div class="summary-row">
        <span>Check-out:</span>
        <span>{{ checkOut }}</span>
      </div>
      <div class="summary-row">
        <span>Noches:</span>
        <span>{{ nights }}</span>
      </div>
      <!-- BUG: Shows price per night here but calls it "total" -->
      <div class="summary-row total">
        <span>Total:</span>
        <span>{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <button type="submit" class="btn btn-primary" :disabled="loading">
      {{ loading ? 'Reservando...' : 'Confirmar Reserva' }}
    </button>
    <p v-if="error" class="error">{{ error }}</p>
  </form>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';

const props = defineProps<{
  room?: { id: string; name: string; basePrice: number; capacity: number };
  checkIn: string;
  checkOut: string;
}>();

const emit = defineEmits<{
  (e: 'submit', data: Record<string, unknown>): void;
}>();

const loading = ref(false);
const error = ref('');

const form = reactive({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  numGuests: 1,
  specialRequests: '',
});

const nights = computed(() => {
  if (!props.checkIn || !props.checkOut) return 0;
  const ci = new Date(props.checkIn);
  const co = new Date(props.checkOut);
  const diff = co.getTime() - ci.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
});

// BUG: This shows the per-night base price but labels it as "Total"
// The actual total should account for seasonal pricing rules from the backend
const totalPrice = computed(() => {
  if (!props.room || nights.value <= 0) return 0;
  return props.room.basePrice * nights.value;
});

// FIXME: Inconsistent currency formatting — should match PropertyCard
function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

async function submit() {
  loading.value = true;
  error.value = '';
  try {
    emit('submit', {
      roomId: props.room?.id,
      checkIn: props.checkIn,
      checkOut: props.checkOut,
      numGuests: form.numGuests,
      specialRequests: form.specialRequests,
      guest: {
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        phone: form.phone,
      },
    });
  } catch (err: any) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}
</script>

<style scoped>
.booking-form {
  background: #fff;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.form-group {
  margin-bottom: 1rem;
}
.form-group label {
  display: block;
  margin-bottom: 0.25rem;
  font-weight: 500;
}
.form-group input,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.booking-summary {
  background: #f9f9f9;
  padding: 1rem;
  border-radius: 4px;
  margin: 1rem 0;
}
.summary-row {
  display: flex;
  justify-content: space-between;
  padding: 0.25rem 0;
}
.summary-row.total {
  font-weight: 700;
  font-size: 1.1rem;
  border-top: 1px solid #ddd;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
}
</style>
