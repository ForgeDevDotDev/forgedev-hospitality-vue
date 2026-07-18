import { defineStore } from 'pinia';
import { bookingsApi } from '@/api';

interface Booking {
  id: string;
  roomId: string;
  guestId: string;
  checkIn: string;
  checkOut: string;
  status: string;
  totalPrice: number;
  numGuests: number;
  specialRequests?: string;
  room?: {
    id: string;
    name: string;
    property?: {
      id: string;
      name: string;
      city: string;
    };
  };
  guest?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export const useBookingsStore = defineStore('bookings', {
  state: () => ({
    bookings: [] as Booking[],
    currentBooking: null as Booking | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchBookings(params?: Record<string, unknown>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await bookingsApi.list(params);
        this.bookings = res.data.data;
      } catch (err: any) {
        this.error = err.message;
      } finally {
        this.loading = false;
      }
    },
    async createBooking(data: Record<string, unknown>) {
      this.loading = true;
      this.error = null;
      try {
        const res = await bookingsApi.create(data);
        this.bookings.push(res.data.data);
        return res.data.data;
      } catch (err: any) {
        this.error = err.message;
        throw err;
      } finally {
        this.loading = false;
      }
    },
    async cancelBooking(id: string) {
      try {
        await bookingsApi.cancel(id);
        const idx = this.bookings.findIndex((b) => b.id === id);
        if (idx !== -1) this.bookings[idx].status = 'CANCELLED';
      } catch (err: any) {
        this.error = err.message;
        throw err;
      }
    },
  },
});
