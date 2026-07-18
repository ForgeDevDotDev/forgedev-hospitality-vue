<template>
  <div class="property-detail">
    <div v-if="propertiesStore.loading" class="loading">Cargando...</div>
    <div v-else-if="propertiesStore.error" class="error">{{ propertiesStore.error }}</div>
    <div v-else-if="property" class="property-content">
      <h1>{{ property.name }}</h1>
      <p class="location">📍 {{ property.address }}, {{ property.city }}, {{ property.country }}</p>
      <div class="stars">
        <span v-for="n in property.starRating" :key="n">⭐</span>
      </div>
      <p class="description">{{ property.description }}</p>

      <!-- Amenities -->
      <div v-if="property.amenities && property.amenities.length" class="amenities-section">
        <h2>Comodidades</h2>
        <div class="amenities-list">
          <span v-for="amenity in property.amenities" :key="amenity.id" class="amenity-tag">
            {{ amenity.name }}
          </span>
        </div>
      </div>

      <!-- Rooms -->
      <div class="rooms-section">
        <h2>Habitaciones disponibles</h2>
        <div v-if="searchStore.hasDates" class="date-info">
          <span>📅 {{ searchStore.checkIn }} → {{ searchStore.checkOut }}</span>
          <span>👥 {{ searchStore.guests }} huéspedes</span>
        </div>
        <div v-else class="date-info">
          <span>Selecciona fechas para ver disponibilidad</span>
        </div>

        <div class="rooms-list">
          <div v-for="room in property.rooms" :key="room.id" class="room-card">
            <h3>{{ room.name }}</h3>
            <p>{{ room.description }}</p>
            <p class="room-info">Capacidad: {{ room.capacity }} personas · Habitación {{ room.roomNumber }}</p>
            <div class="room-price">
              <span class="price">{{ formatPrice(room.basePrice) }}</span>
              <!-- BUG: Shows per-night price without clarifying it's per night, not total -->
              <span class="price-label">por noche</span>
            </div>
            <button class="btn btn-primary" @click="bookRoom(room)">
              Reservar
            </button>
          </div>
        </div>
      </div>

      <!-- TODO: Add reviews section here -->
      <!-- FIXME: Reviews feature was planned but never implemented -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePropertiesStore } from '@/stores/properties';
import { useSearchStore } from '@/stores/search';

const route = useRoute();
const router = useRouter();
const propertiesStore = usePropertiesStore();
const searchStore = useSearchStore();

const property = computed(() => propertiesStore.currentProperty);

onMounted(() => {
  const id = route.params.id as string;
  propertiesStore.fetchProperty(id);
});

function formatPrice(price: number): string {
  return new Intl.NumberFormat('es-ES', { style: 'currency', currency: 'EUR' }).format(price);
}

function bookRoom(room: { id: string; name: string; basePrice: number; capacity: number }) {
  // Navigate to booking flow with query params
  router.push({
    path: '/booking',
    query: {
      roomId: room.id,
      propertyId: property.value?.id,
      checkIn: searchStore.checkIn || '',
      checkOut: searchStore.checkOut || '',
      guests: String(searchStore.guests),
    },
  });
}
</script>

<style scoped>
.property-detail {
  max-width: 800px;
}
.location {
  color: #666;
  margin: 0.5rem 0;
}
.stars {
  margin: 0.5rem 0;
}
.description {
  margin: 1rem 0;
  line-height: 1.6;
}
.amenities-section {
  margin: 2rem 0;
}
.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.amenity-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.75rem;
  border-radius: 4px;
  font-size: 0.85rem;
}
.rooms-section {
  margin: 2rem 0;
}
.date-info {
  display: flex;
  gap: 1.5rem;
  padding: 0.75rem;
  background: #f9f9f9;
  border-radius: 4px;
  margin-bottom: 1rem;
}
.rooms-list {
  display: grid;
  gap: 1rem;
}
.room-card {
  background: #fff;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.room-info {
  color: #666;
  font-size: 0.85rem;
}
.room-price {
  margin: 0.75rem 0;
}
.price {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e94560;
}
.price-label {
  color: #999;
  font-size: 0.85rem;
}
</style>
