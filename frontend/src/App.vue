<template>
  <div class="app">
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'

import { onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('auth/initAuth')
})
</script>

<style scoped></style>
