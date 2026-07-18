<template>
  <div class="calendar">
    <div class="calendar-header">
      <button @click="prevMonth" :disabled="!canPrev">‹</button>
      <span>{{ monthName }} {{ year }}</span>
      <button @click="nextMonth">›</button>
    </div>
    <div class="calendar-grid">
      <div class="calendar-cell calendar-day-header" v-for="day in dayHeaders" :key="day">{{ day }}</div>
      <!-- BUG: When month changes, the calendar doesn't properly recalculate the offset
           because currentMonth and currentYear are updated but selectedDate
           doesn't reset, causing stale state in computed properties -->
      <div
        v-for="(cell, i) in calendarCells"
        :key="i"
        :class="['calendar-cell', { empty: !cell, selected: isDateSelected(cell), booked: isDateBooked(cell) }]"
        @click="selectDate(cell)"
      >
        {{ cell ? cell.day : '' }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  bookedDates?: { checkIn: string; checkOut: string }[];
  selectable?: boolean;
}>();

const emit = defineEmits<{
  (e: 'select', date: string): void;
}>();

const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());
const selectedDate = ref<string | null>(null);

const monthName = computed(() => {
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  return months[currentMonth.value];
});

const dayHeaders = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

const canPrev = computed(() => {
  const now = new Date();
  return currentYear.value > now.getFullYear() ||
    (currentYear.value === now.getFullYear() && currentMonth.value > now.getMonth());
});

interface CalendarCell {
  day: number;
  month: number;
  year: number;
  dateStr: string;
}

const calendarCells = computed<(CalendarCell | null)[]>(() => {
  const cells: (CalendarCell | null)[] = [];
  const firstDay = new Date(currentYear.value, currentMonth.value, 1);
  // BUG: getDay() returns 0-6 (Sun-Sat) but our calendar starts Monday
  // So the offset calculation is wrong — it should be (firstDay.getDay() + 6) % 7
  let offset = firstDay.getDay() - 1;
  if (offset < 0) offset = 6;

  for (let i = 0; i < offset; i++) {
    cells.push(null);
  }

  const daysInMonth = new Date(currentYear.value, currentMonth.value + 1, 0).getDate();
  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${currentYear.value}-${String(currentMonth.value + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    cells.push({ day, month: currentMonth.value, year: currentYear.value, dateStr });
  }

  return cells;
});

function isDateSelected(cell: CalendarCell | null): boolean {
  if (!cell || !selectedDate.value) return false;
  return cell.dateStr === selectedDate.value;
}

function isDateBooked(cell: CalendarCell | null): boolean {
  if (!cell || !props.bookedDates) return false;
  return props.bookedDates.some(booking => {
    const ci = new Date(booking.checkIn);
    const co = new Date(booking.checkOut);
    const d = new Date(cell.dateStr);
    return d >= ci && d < co;
  });
}

function selectDate(cell: CalendarCell | null) {
  if (!cell || isDateBooked(cell)) return;
  selectedDate.value = cell.dateStr;
  emit('select', cell.dateStr);
}

function prevMonth() {
  if (!canPrev.value) return;
  if (currentMonth.value === 0) {
    currentMonth.value = 11;
    currentYear.value--;
  } else {
    currentMonth.value--;
  }
}

function nextMonth() {
  if (currentMonth.value === 11) {
    currentMonth.value = 0;
    currentYear.value++;
  } else {
    currentMonth.value++;
  }
}
</script>

<style scoped>
.calendar {
  background: #fff;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
.calendar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: #1a1a2e;
  color: #fff;
}
.calendar-header button {
  background: none;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0 0.5rem;
}
.calendar-header button:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.calendar-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 1px;
  background: #ddd;
}
.calendar-cell {
  background: #fff;
  padding: 0.75rem;
  text-align: center;
  font-size: 0.85rem;
  cursor: pointer;
}
.calendar-cell:hover {
  background: #f0f0f0;
}
.calendar-cell.selected {
  background: #e94560;
  color: #fff;
}
.calendar-cell.booked {
  background: #f8d7da;
  color: #721c24;
  cursor: not-allowed;
}
.calendar-cell.empty {
  background: #f9f9f9;
  cursor: default;
}
.calendar-day-header {
  background: #1a1a2e;
  color: #fff;
  font-weight: 600;
  cursor: default;
}
</style>
