<template>
  <header class="header">
    <div class="header-left">
      <router-link to="/" class="logo-link">
        <div class="logo">
          <span>進撃の巨人</span>
        </div>
      </router-link>
    </div>

    <div class="desktop-nav">
      <router-link :to="{ name: 'Home' }" class="nav-link">首頁</router-link>
      <router-link :to="{ name: 'SecurityInfo' }" class="nav-link">安全資訊</router-link>
      <router-link :to="{ name: 'SupportCenter' }" class="nav-link">支援中心</router-link>

      <template v-if="!isLoggedIn">
        <router-link :to="{ name: 'Login' }" class="nav-link">登入</router-link>
      </template>

      <template v-else>
        <router-link :to="{ name: 'UserCenter' }" class="nav-link">會員中心</router-link>
        <a href="#" class="nav-link" @click.prevent="logout">登出</a>
      </template>
    </div>

    <div class="mobile-nav">
      <button class="open-btn" @click="toggleMobileMenu">
        <i class="bx bx-menu"></i>
      </button>

      <div class="mobile-menu" :class="{ open: isMobileMenuOpen }">
        <button class="close-btn" @click="toggleMobileMenu">
          <i class="bx bx-x"></i>
        </button>

        <router-link :to="{ name: 'Home' }" class="mobile-nav-link">首頁</router-link>
        <router-link :to="{ name: 'SecurityInfo' }" class="mobile-nav-link">安全資訊</router-link>
        <router-link :to="{ name: 'SupportCenter' }" class="mobile-nav-link">支援中心</router-link>

        <template v-if="!isLoggedIn">
          <router-link :to="{ name: 'Login' }" class="mobile-nav-link">登入</router-link>
        </template>

        <template v-else>
          <router-link :to="{ name: 'UserCenter' }" class="mobile-nav-link">會員中心</router-link>
          <a href="#" class="mobile-nav-link" @click.prevent="logout">登出</a>
        </template>
      </div>

      <div
        class="mobile-nav-mask"
        :class="{ show: isMobileMenuOpen }"
        @click="toggleMobileMenu"
      ></div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()
const route = useRoute()
const store = useStore()

const isLoggedIn = computed(() => store.getters['auth/isAuthenticated'])
const isMobileMenuOpen = ref(false)

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const logout = async () => {
  store.dispatch('auth/logout')

  if (route.meta.requiresAuth) {
    router.push({ name: 'Home' })
  }

  store.dispatch('toast/showToast', {
    show: true,
    type: 'success',
    message: '登出成功！',
  })
}
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

.header-left {
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

.desktop-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;

  .nav-link {
    text-decoration: none;
    color: $text-color;
    font-weight: 500;
    transition: color 0.2s ease;
  }

  .nav-link:hover {
    color: $primary-color;
  }
}

.mobile-nav {
  display: none;
  position: relative;

  .open-btn {
    cursor: pointer;
    width: 25px;
    height: 25px;
    border: none;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: center;

    i {
      font-size: 1.55rem;
      color: $text-color;
    }
  }

  .mobile-menu {
    position: fixed;
    top: 0;
    right: -100%;
    // right: 0;
    background-color: $light-color;
    z-index: 100;
    overflow-y: auto; // 好習慣預設未來會增加 page
    width: 70%;
    height: 100vh;
    padding: 50px 20px 20px;
    transition: right 0.3s ease;

    &.open {
      right: 0;
    }

    .close-btn {
      position: absolute;
      top: 15px;
      right: 20px;
      width: 36px;
      height: 36px;
      border: none;
      background-color: #0000000d;
      border: 1px solid #c8c8c8;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      i {
        font-size: 1.55rem;
        color: $text-color;
        transition: color 0.2s ease;
      }
    }
  }

  .mobile-nav-link {
    cursor: pointer;
    display: flex;
    text-decoration: none;
    color: $text-color;
    font-size: 1.125rem;
    font-weight: 500;
    padding: 1.2rem 0;
    border-bottom: 1px solid #eee;
    transition: color 0.2s ease;

    &:hover {
      color: $primary-color;
    }
  }
}

.mobile-nav-mask {
  position: fixed;
  visibility: hidden;
  opacity: 0;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #00000032;
  z-index: 90;
  transition: all 0.3s ease;

  &.show {
    opacity: 1;
    visibility: visible;
  }
}

/* 響應式設計 */
@media screen and (max-width: 768px) {
  .desktop-nav {
    display: none;
  }

  .mobile-nav {
    display: block;
  }
}
</style>
