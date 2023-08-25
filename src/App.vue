<template>
  <Navbar-menu/>

  <RouterView />
</template>

<script setup lang="ts">
import { RouterView } from 'vue-router'
import NavbarMenu from "@/components/Navbar.vue";

</script>

<style scoped>

</style>
