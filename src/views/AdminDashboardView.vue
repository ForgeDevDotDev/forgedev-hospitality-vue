<template>
  <div class="admin-dashboard">
    <h1>Panel de Administración</h1>

    <div class="admin-tabs">
      <button :class="{ active: tab === 'properties' }" @click="tab = 'properties'">Propiedades</button>
      <button :class="{ active: tab === 'amenities' }" @click="tab = 'amenities'">Comodidades</button>
      <button :class="{ active: tab === 'pricing' }" @click="tab = 'pricing'">Tarifas</button>
    </div>

    <!-- Properties tab -->
    <div v-if="tab === 'properties'" class="tab-content">
      <!-- NOTE: This section uses inline styles instead of the main stylesheet -->
      <!-- FIXME: Should be moved to the component's <style> section -->
      <div style="margin-bottom: 1.5rem; display: flex; justify-content: space-between; align-items: center;">
        <h2 style="font-size: 1.25rem;">Propiedades ({{ properties.length }})</h2>
        <button style="background: #e94560; color: white; border: none; padding: 0.5rem 1rem; border-radius: 4px; cursor: pointer;" @click="showAddProperty = !showAddProperty">
          {{ showAddProperty ? 'Cancelar' : '+ Nueva Propiedad' }}
        </button>
      </div>

      <div v-if="showAddProperty" style="background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div class="form-group">
          <label>Nombre</label>
          <input v-model="newProperty.name" type="text" placeholder="Hotel Ejemplo" />
        </div>
        <div class="form-group">
          <label>Ciudad</label>
          <input v-model="newProperty.city" type="text" placeholder="Madrid" />
        </div>
        <div class="form-group">
          <label>Dirección</label>
          <input v-model="newProperty.address" type="text" />
        </div>
        <div class="form-group">
          <label>Categoría</label>
          <select v-model.number="newProperty.starRating">
            <option :value="3">★★★</option>
            <option :value="4">★★★★</option>
            <option :value="5">★★★★★</option>
          </select>
        </div>
        <div class="form-group">
          <label>Descripción</label>
          <textarea v-model="newProperty.description" rows="3"></textarea>
        </div>
        <button class="btn btn-primary" @click="addProperty">Guardar</button>
      </div>

      <div class="properties-admin-list">
        <div v-for="prop in properties" :key="prop.id" class="admin-card">
          <h3>{{ prop.name }}</h3>
          <p>📍 {{ prop.city }} · {{ '⭐'.repeat(prop.starRating) }}</p>
          <p>{{ prop.rooms?.length || 0 }} habitaciones</p>
          <button class="btn btn-secondary" @click="deleteProperty(prop.id)">Eliminar</button>
        </div>
      </div>
    </div>

    <!-- Amenities tab -->
    <div v-if="tab === 'amenities'" class="tab-content">
      <h2>Comodidades ({{ amenities.length }})</h2>
      <div class="amenities-admin">
        <div v-for="am in amenities" :key="am.id" class="amenity-item">
          {{ am.name }}
          <button class="btn btn-secondary" @click="deleteAmenity(am.id)">×</button>
        </div>
      </div>
      <div class="add-amenity">
        <input v-model="newAmenity" type="text" placeholder="Nueva comodidad" />
        <button class="btn btn-primary" @click="addAmenity">Añadir</button>
      </div>
    </div>

    <!-- Pricing tab -->
    <div v-if="tab === 'pricing'" class="tab-content">
      <h2>Reglas de Tarifas</h2>
      <p class="hint">Selecciona una propiedad para ver sus reglas de precios.</p>
      <select v-model="selectedPropertyId" @change="loadPricingRules">
        <option value="">— Seleccionar —</option>
        <option v-for="prop in properties" :key="prop.id" :value="prop.id">{{ prop.name }}</option>
      </select>
      <div v-if="pricingRules.length" class="pricing-rules-list">
        <div v-for="rule in pricingRules" :key="rule.id" class="pricing-rule-card">
          <h3>{{ rule.name }}</h3>
          <p>Tipo: {{ rule.type }}</p>
          <p>Multiplicador: ×{{ rule.multiplier }}</p>
          <p v-if="rule.startDate">Desde: {{ rule.startDate }}</p>
          <p v-if="rule.endDate">Hasta: {{ rule.endDate }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { usePropertiesStore } from '@/stores/properties';
import { amenitiesApi, pricingRulesApi } from '@/api';

const propertiesStore = usePropertiesStore();
const properties = ref<any[]>([]);
const tab = ref('properties');
const showAddProperty = ref(false);

const newProperty = ref({
  name: '',
  city: '',
  address: '',
  starRating: 3,
  description: '',
});

const amenities = ref<any[]>([]);
const newAmenity = ref('');
const selectedPropertyId = ref('');
const pricingRules = ref<any[]>([]);

onMounted(async () => {
  await propertiesStore.fetchProperties();
  properties.value = propertiesStore.properties;
  const amRes = await amenitiesApi.list();
  amenities.value = amRes.data.data;
});

async function addProperty() {
  try {
    await propertiesStore.createProperty({
      ...newProperty.value,
      country: 'Spain',
    });
    newProperty.value = { name: '', city: '', address: '', starRating: 3, description: '' };
    showAddProperty.value = false;
    properties.value = propertiesStore.properties;
  } catch (err: any) {
    alert('Error: ' + err.message);
  }
}

async function deleteProperty(id: string) {
  if (!confirm('¿Eliminar esta propiedad?')) return;
  try {
    await propertiesStore.deleteProperty(id);
    properties.value = propertiesStore.properties;
  } catch (err: any) {
    alert('Error: ' + err.message);
  }
}

async function addAmenity() {
  if (!newAmenity.value.trim()) return;
  try {
    const res = await amenitiesApi.create({ name: newAmenity.value });
    amenities.value.push(res.data.data);
    newAmenity.value = '';
  } catch (err: any) {
    alert('Error: ' + err.message);
  }
}

async function deleteAmenity(id: string) {
  try {
    await amenitiesApi.delete(id);
    amenities.value = amenities.value.filter((a) => a.id !== id);
  } catch (err: any) {
    alert('Error: ' + err.message);
  }
}

async function loadPricingRules() {
  if (!selectedPropertyId.value) {
    pricingRules.value = [];
    return;
  }
  try {
    const res = await pricingRulesApi.list({ propertyId: selectedPropertyId.value });
    pricingRules.value = res.data.data;
  } catch (err: any) {
    console.error(err);
  }
}
</script>

<style scoped>
.admin-tabs {
  display: flex;
  gap: 0;
  margin-bottom: 1.5rem;
  border-bottom: 2px solid #ddd;
}
.admin-tabs button {
  padding: 0.75rem 1.5rem;
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  cursor: pointer;
  font-size: 0.95rem;
}
.admin-tabs button.active {
  border-bottom-color: #e94560;
  color: #e94560;
  font-weight: 600;
}
.tab-content h2 {
  margin-bottom: 1rem;
}
.admin-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
}
.amenities-admin {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}
.amenity-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background: #fff;
  padding: 0.5rem 0.75rem;
  border-radius: 4px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}
.add-amenity {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}
.add-amenity input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
.hint {
  color: #666;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
}
.pricing-rule-card {
  background: #fff;
  padding: 1rem;
  border-radius: 8px;
  margin-bottom: 0.75rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
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
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
}
</style>
