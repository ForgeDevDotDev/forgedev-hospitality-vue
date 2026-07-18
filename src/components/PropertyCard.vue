<template>
  <div class="property-card" @click="$emit('click', property.id)">
    <div class="card-image">
      <img :src="propertyImage" :alt="property.name" />
    </div>
    <div class="card-body">
      <h3>{{ property.name }}</h3>
      <p class="location">📍 {{ property.city }}, {{ property.country }}</p>
      <div class="stars">
        <span v-for="n in property.starRating" :key="n">⭐</span>
      </div>
      <p class="description">{{ property.description }}</p>
      <!-- BUG: Sometimes shows per-night price, sometimes total, depending on where the card is used -->
      <div class="price">
        <span class="price-amount">{{ formatPrice(property.rooms?.[0]?.basePrice || 0) }}</span>
        <!-- FIXME: This label is misleading — it always says "per night" but
             the value could be the lowest room base price, not the actual booking price -->
        <span class="price-label">/ noche</span>
      </div>
      <div v-if="property.amenities && property.amenities.length" class="amenities">
        <span v-for="amenity in property.amenities.slice(0, 4)" :key="amenity.id" class="amenity-tag">
          {{ amenity.name }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  property: {
    id: string;
    name: string;
    description: string;
    city: string;
    country: string;
    starRating: number;
    rooms?: { basePrice: number }[];
    amenities?: { id: string; name: string }[];
  };
}>();

defineEmits<{
  (e: 'click', id: string): void;
}>();

// Placeholder images using picsum
const propertyImage = computed(() => {
  const seed = props.property.id || 'default';
  return `https://picsum.photos/seed/${seed}/400/200`;
});

// FIXME: Inconsistent currency formatting — should use Intl.NumberFormat
function formatPrice(price: number): string {
  return `€${price.toFixed(2)}`;
}
</script>

<style scoped>
.property-card {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: transform 0.2s;
}
.property-card:hover {
  transform: translateY(-2px);
}
.card-image img {
  width: 100%;
  height: 200px;
  object-fit: cover;
}
.card-body {
  padding: 1rem;
}
.location {
  color: #666;
  font-size: 0.9rem;
  margin: 0.25rem 0;
}
.stars {
  margin: 0.25rem 0;
}
.description {
  color: #555;
  font-size: 0.85rem;
  margin: 0.5rem 0;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.price {
  margin: 0.5rem 0;
}
.price-amount {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e94560;
}
.price-label {
  color: #999;
  font-size: 0.85rem;
}
.amenities {
  display: flex;
  gap: 0.25rem;
  flex-wrap: wrap;
}
.amenity-tag {
  background: #f0f0f0;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #555;
}
</style>
