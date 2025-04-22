<template>
  <main class="home">
    <section class="hero">
      <div class="hero-content">
        <h1>歡迎使用會員系統</h1>
        <p class="subtitle">簡單、快速、安全的會員管理解決方案</p>
        <div class="actions">
          <router-link v-if="!isAuthenticated" :to="{ name: 'Register' }" class="btn btn-primary">
            <i class="bx bx-log-in-circle"></i> 立即註冊
          </router-link>

          <div v-else class="welcome-message">
            <i class="bx bx-user"></i>
            <span
              >歡迎回來，<strong>{{ user }}</strong></span
            >
          </div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="feature-card" @click="() => router.push({ name: 'UserCenter' })">
        <i class="bx bx-user-circle feature-icon"></i>
        <h3>會員管理</h3>
        <p>輕鬆管理您的個人資訊</p>
      </div>

      <div class="feature-card" @click="() => router.push({ name: 'SecurityInfo' })">
        <i class="bx bx-shield-quarter feature-icon"></i>
        <h3>安全保障</h3>
        <p>您的資料安全是我們的首要任務</p>
      </div>

      <div class="feature-card" @click="() => router.push({ name: 'SupportCenter' })">
        <i class="bx bx-support feature-icon"></i>
        <h3>專業支援</h3>
        <p>隨時為您解答問題</p>
      </div>
    </section>
  </main>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { computed } from 'vue'

const router = useRouter()
const store = useStore()

const isAuthenticated = computed(() => store.getters['auth/isAuthenticated'])
const user = computed(() => store.getters['auth/currentUser'])
</script>

<style scoped lang="scss">
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.home {
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.hero {
  text-align: center;
  padding: 4rem 1rem;

  h1 {
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 1rem;
    color: $primary-color;
  }

  .subtitle {
    font-size: 1.25rem;
    margin-bottom: 2rem;
    color: $text-color;
  }
}

.actions {
  margin-top: 2rem;

  .btn {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    border-radius: 4px;
    text-decoration: none;
    font-weight: bold;
    transition: all 0.3s ease;

    i {
      font-size: 1.25rem;
    }
  }

  .btn-primary {
    background-color: $primary-color;
    color: white;

    &:hover {
      background-color: darken-color($primary-color, 10%);
      transform: translateY(-2px);
    }
  }

  .welcome-message {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: $light-color;
    border-left: 4px solid $primary-color;
    border-radius: 4px;
    font-size: 1.1rem;

    i {
      font-size: 1.25rem;
      color: $primary-color;
    }

    strong {
      color: $primary-color;
      font-weight: 600;
    }
  }
}

.features {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
  margin-top: 3rem;
}

.feature-card {
  cursor: pointer;
  background-color: white;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: 0 4px 6px $shadow-color;
  text-align: center;
  flex: 1;
  min-width: 250px;
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-5px);
  }

  .feature-icon {
    font-size: 2.5rem;
    color: $primary-color;
    margin-bottom: 1rem;
  }

  h3 {
    margin-bottom: 0.5rem;
  }

  p {
    color: lighten-color($text-color, 20%);
  }
}
</style>
