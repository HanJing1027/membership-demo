<template>
  <div class="app">
    <ToastMessage :toast="toast" />
    <BaseModal :modal="modal" />
    <Header />
    <router-view />
  </div>
</template>

<script setup>
import Header from '@/components/layout/Header.vue'
import ToastMessage from '@/components/common/ToastMessage.vue'
import BaseModal from '@/components/common/BaseModal.vue'

import { computed, onMounted } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

onMounted(() => {
  store.dispatch('auth/initAuth')
})

// 獲取 toast 狀態
const toast = computed(() => store.getters['toast/getToast'])

// 獲取 modal 狀態
const modal = computed(() => store.getters['modal/getModal'])
</script>

<style scoped></style>
