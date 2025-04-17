<template>
  <header class="header">
    <div class="header-left">
      <router-link to="/" class="logo-link">
        <div class="logo">
          <span>進撃の巨人</span>
        </div>
      </router-link>
    </div>

    <div class="header-right">
      <template v-if="!isLoggedIn">
        <router-link :to="{ name: 'Login' }" class="nav-link">登入</router-link>
      </template>

      <template v-else>
        <router-link :to="{ name: 'UserCenter' }" class="nav-link">會員中心</router-link>
        <a href="#" class="nav-link" @click.prevent="logout">登出</a>
      </template>
    </div>
  </header>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const store = useStore()

const isLoggedIn = computed(() => store.getters['auth/isAuthenticated'])
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 2rem;
  background-color: $light-color;
  box-shadow: 0 2px 4px $shadow-color;
}

.header-left,
.header-right {
  display: flex;
  align-items: center;
}

.logo-link {
  text-decoration: none;
  color: inherit;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: $font-size-large;
  font-weight: bold;
  color: $primary-color;
}

.logo i {
  font-size: 1.5rem;
}

.header-right {
  gap: 1.5rem;
}

.nav-link {
  text-decoration: none;
  color: $text-color;
  font-weight: 500;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: $primary-color;
}
</style>
