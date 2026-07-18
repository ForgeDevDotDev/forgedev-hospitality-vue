import { defineStore } from 'pinia';
import { propertiesApi } from '@/api';

interface Property {
  id: string;
  name: string;
  description: string;
  address: string;
  city: string;
  country: string;
  starRating: number;
  phone?: string;
  email?: string;
  rooms?: Room[];
  amenities?: Amenity[];
}

interface Room {
  id: string;
  name: string;
  description: string;
  capacity: number;
  basePrice: number;
  roomNumber: string;
  floor?: number;
}

interface Amenity {
  id: string;
  name: string;
  icon?: string;
}

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: [] as Property[],
    currentProperty: null as Property | null,
    loading: false,
    error: null as string | null,
  }),
  getters: {
    getPropertyById: (state) => (id: string) =>
      state.properties.find((p) => p.id === id),
  },
  actions: {
    async fetchProperties(params?: Record<string, unknown>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await propertiesApi.list(params);
        this.properties = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async searchProperties(params: Record<string, unknown>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await propertiesApi.search(params);
        this.properties = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async fetchProperty(id: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await propertiesApi.get(id);
        this.currentProperty = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async createProperty(data: Record<string, unknown>) {
      try {
        const res = await propertiesApi.create(data);
        this.properties.push(res.data.data);
        return res.data.data;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      }
    },
    async updateProperty(id: string, data: Record<string, unknown>) {
      try {
        const res = await propertiesApi.update(id, data);
        const idx = this.properties.findIndex((p) => p.id === id);
        if (idx !== -1) this.properties[idx] = res.data.data;
        return res.data.data;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      }
    },
    async deleteProperty(id: string) {
      try {
        await propertiesApi.delete(id);
        this.properties = this.properties.filter((p) => p.id !== id);
      } catch (err: any) {
        this.error = err.message;
        throw err;
      }
    },
  },
});
