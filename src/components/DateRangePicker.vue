<template>
  <div class="date-range-picker">
    <div class="date-input">
      <label>Check-in</label>
      <input type="date" v-model="checkInDate" @change="onDateChange" />
    </div>
    <div class="date-input">
      <label>Check-out</label>
      <input type="date" v-model="checkOutDate" @change="onDateChange" />
    </div>
    <p v-if="error" class="error-msg">{{ error }}</p>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelCheckIn?: string;
  modelCheckOut?: string;
}>();

const emit = defineEmits<{
  (e: 'update', checkIn: string, checkOut: string): void;
}>();

const checkInDate = ref(props.modelCheckIn || '');
const checkOutDate = ref(props.modelCheckOut || '');
const error = ref('');

function onDateChange() {
  // BUG: If the user selects the same date for check-in and check-out,
  // no error is shown here, and the search shows available rooms.
  // But the booking API should reject it (and does, via the buggy availability check)
  // — this creates a confusing UX where rooms appear available but booking fails.
  if (checkInDate.value && checkOutDate.value) {
    if (checkOutDate.value < checkInDate.value) {
      error.value = 'La fecha de salida debe ser posterior a la de entrada';
      return;
    }
    // FIXME: Should also check if checkIn === checkOut (same day)
    // Right now it allows it, which leads to a 0-night stay
    error.value = '';
    emit('update', checkInDate.value, checkOutDate.value);
  }
}
</script>

<style scoped>
.date-range-picker {
  display: flex;
  gap: 1rem;
  align-items: flex-end;
}
.date-input {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.date-input label {
  font-size: 0.85rem;
  color: #666;
}
.date-input input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.error-msg {
  color: #dc3545;
  font-size: 0.85rem;
}
</style>
