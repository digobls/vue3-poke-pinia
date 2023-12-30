<template>
  <NavbarMenu />

  <RouterView />
</template>

<script lang="ts">
import NavbarMenu from "@/components/Navbar.vue";

export default {
  components: {
    NavbarMenu
  }
};
</script>
