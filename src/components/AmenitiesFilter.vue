<template>
  <div class="amenities-filter">
    <label class="filter-label">Comodidades</label>
    <div class="amenities-list">
      <label v-for="amenity in amenities" :key="amenity.id" class="amenity-checkbox">
        <input
          type="checkbox"
          :value="amenity.name"
          :checked="selected.includes(amenity.name)"
          @change="toggle(amenity.name)"
        />
        {{ amenity.name }}
      </label>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  amenities: { id: string; name: string }[];
  selected: string[];
}>();

const emit = defineEmits<{
  (e: 'toggle', amenity: string): void;
}>();

function toggle(amenity: string) {
  emit('toggle', amenity);
}
</script>

<style scoped>
.amenities-filter {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
.filter-label {
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
}
.amenities-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
}
.amenity-checkbox {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.85rem;
  cursor: pointer;
}
</style>
