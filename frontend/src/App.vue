<template>
  <div class="app">
    <ToastMessage :toast="toast" />
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import ToastMessage from './components/common/ToastMessage.vue'
import Cookies from 'js-cookie'

import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('auth/initAuth')
})

// 獲取 toast 狀態
const toast = computed(() => store.getters['toast/getToast'])
</script>

<style scoped></style>
