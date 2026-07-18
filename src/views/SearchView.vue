<template>
  <div class="search-view">
    <h1>Buscar hoteles</h1>

    <div class="filters">
      <input
        v-model="searchStore.city"
        type="text"
        placeholder="Ciudad (ej. Madrid)"
      />
      <DateRangePicker
        :model-check-in="searchStore.checkIn || ''"
        :model-check-out="searchStore.checkOut || ''"
        @update="onDatesChange"
      />
      <GuestFilter
        v-model="searchStore.guests"
      />
      <select v-model.number="searchStore.minStars">
        <option :value="0">Todas las categorías</option>
        <option :value="3">★★★</option>
        <option :value="4">★★★★</option>
        <option :value="5">★★★★★</option>
      </select>
      <button @click="search">Buscar</button>
    </div>

    <AmenitiesFilter
      v-if="amenities.length"
      :amenities="amenities"
      :selected="searchStore.selectedAmenities"
      @toggle="searchStore.toggleAmenity"
    />

    <!-- BUG: No loading state shown while search is in progress -->
    <!-- FIXME: Should show a spinner or skeleton loader -->
    <div v-if="propertiesStore.error" class="error">{{ propertiesStore.error }}</div>

    <div v-if="propertiesStore.properties.length" class="property-grid">
      <PropertyCard
        v-for="property in propertiesStore.properties"
        :key="property.id"
        :property="property"
        @click="goToProperty"
      />
    </div>
    <div v-else-if="!propertiesStore.loading" class="no-results">
      <p>No se encontraron hoteles. Prueba con otros filtros.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { usePropertiesStore } from '@/stores/properties';
import { useSearchStore } from '@/stores/search';
import { amenitiesApi } from '@/api';
import PropertyCard from '@/components/PropertyCard.vue';
import DateRangePicker from '@/components/DateRangePicker.vue';
import GuestFilter from '@/components/GuestFilter.vue';
import AmenitiesFilter from '@/components/AmenitiesFilter.vue';

const router = useRouter();
const propertiesStore = usePropertiesStore();
const searchStore = useSearchStore();
const amenities = ref<{ id: string; name: string }[]>([]);

onMounted(async () => {
  try {
    const res = await amenitiesApi.list();
    amenities.value = res.data.data;
  } catch (err) {
    console.error('Failed to load amenities', err);
  }
  // Load all properties initially
  await propertiesStore.fetchProperties();
});

function onDatesChange(checkIn: string, checkOut: string) {
  searchStore.setDates(checkIn, checkOut);
}

async function search() {
  const params: Record<string, unknown> = {
    guests: searchStore.guests,
  };
  if (searchStore.city) params.city = searchStore.city;
  if (searchStore.minStars > 0) params.minStars = searchStore.minStars;
  if (searchStore.selectedAmenities.length) params.amenities = searchStore.selectedAmenities.join(',');
  if (searchStore.checkIn && searchStore.checkOut) {
    params.checkIn = searchStore.checkIn;
    params.checkOut = searchStore.checkOut;
    await propertiesStore.searchProperties(params);
  } else {
    await propertiesStore.fetchProperties(params);
  }
}

function goToProperty(id: string) {
  router.push(`/properties/${id}`);
}
</script>
