<template>
  <div class="guest-filter">
    <label>Huéspedes</label>
    <div class="guest-controls">
      <button @click="decrement" :disabled="guests <= 1">−</button>
      <span>{{ guests }}</span>
      <button @click="increment">+</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';

const props = defineProps<{
  modelValue?: number;
}>();

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void;
}>();

const guests = ref(props.modelValue || 2);

function increment() {
  if (guests.value < 20) {
    guests.value++;
    emit('update:modelValue', guests.value);
  }
}

function decrement() {
  if (guests.value > 1) {
    guests.value--;
    emit('update:modelValue', guests.value);
  }
}
</script>

<style scoped>
.guest-filter {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}
.guest-filter label {
  font-size: 0.85rem;
  color: #666;
}
.guest-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
.guest-controls button {
  width: 32px;
  height: 32px;
  border: 1px solid #ddd;
  background: #fff;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
}
.guest-controls button:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.guest-controls span {
  min-width: 24px;
  text-align: center;
  font-weight: 500;
}
</style>
