import { defineStore } from 'pinia';

export const useSearchStore = defineStore('search', {
  state: () => ({
    checkIn: null as string | null,
    checkOut: null as string | null,
    guests: 2,
    city: '' as string,
    minStars: 0,
    selectedAmenities: [] as string[],
    // BUG: searchResults is not cleared when navigating away from search
    // so stale results can persist
    searchResults: [] as any[],
  }),
  getters: {
    hasDates: (state) => !!state.checkIn && !!state.checkOut,
    hasFilters: (state) =>
      !!state.city || state.minStars > 0 || state.selectedAmenities.length > 0,
  },
  actions: {
    setDates(checkIn: string, checkOut: string) {
      this.checkIn = checkIn;
      this.checkOut = checkOut;
    },
    setGuests(count: number) {
      this.guests = count;
    },
    setCity(city: string) {
      this.city = city;
    },
    setMinStars(stars: number) {
      this.minStars = stars;
    },
    toggleAmenity(amenity: string) {
      const idx = this.selectedAmenities.indexOf(amenity);
      if (idx === -1) {
        this.selectedAmenities.push(amenity);
      } else {
        this.selectedAmenities.splice(idx, 1);
      }
    },
    // TODO: Add a resetFilters action — currently filters persist when navigating away
    reset() {
      this.checkIn = null;
      this.checkOut = null;
      this.guests = 2;
      this.city = '';
      this.minStars = 0;
      this.selectedAmenities = [];
      // FIXME: Should also clear searchResults but doesn't
    },
  },
});
