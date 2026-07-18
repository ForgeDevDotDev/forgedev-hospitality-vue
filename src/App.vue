<template>
  <div id="app">
    <nav class="navbar" v-if="!isLoginPage">
      <router-link to="/" class="brand">🏨 ForgeDev Hospitality</router-link>
      <router-link to="/">Buscar</router-link>
      <router-link to="/my-bookings">Mis Reservas</router-link>
      <router-link to="/admin">Admin</router-link>
    </nav>
    <main class="container">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const isLoginPage = computed(() => route.name === 'login');
</script>
