<template>
  <main class="login-container">
    <div class="login-form-wrapper">
      <h1 class="login-title">登入帳號</h1>

      <LoginForm
        :isSubmitting="isSubmitting"
        @submit-form="handleFormSubmit"
        @validation-error="handleValidationError"
      />

      <!-- 前往註冊 -->
      <div class="form-footer">
        還沒有帳號？ <router-link :to="{ name: 'Register' }">註冊新帳號</router-link>
      </div>

      <!-- 忘記密碼 -->
      <div class="forgot-password-container">
        <router-link :to="{ name: 'ForgotPassword' }" class="forgot-password-link"
          >忘記密碼？</router-link
        >
      </div>
    </div>
  </main>
</template>

<script setup>
import LoginForm from '@/components/features/LoginForm.vue'

import { membershipApi } from '@/server/api/membershipApi.js'
import { useDebounce } from '@/composable/useDebounce'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const { debounce } = useDebounce()
const router = useRouter()
const store = useStore()

const isSubmitting = ref(false)

const handleValidationErrorOriginal = (error) => {
  try {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: error.message,
    })
  } catch (error) {
    console.error('驗證錯誤:', error)
  }
}

const handleFormSubmitOriginal = async (formData) => {
  try {
    isSubmitting.value = true

    // API 請求
    const response = await membershipApi.login(formData)
    const { username } = response
    const { token } = response.authorization

    store.dispatch('auth/login', { token, username })

    // 登入成功後 重新導向至使用者原本想進入的頁面（如果有）
    // 如果沒有 redirect 查詢參數 預設跳轉至首頁
    const redirectPath = router.currentRoute.value.query.redirect
    router.replace(redirectPath || { name: 'Home' })

    // 顯示登入成功的提示
    store.dispatch('toast/showToast', {
      type: 'success',
      message: '登入成功！',
    })
  } catch (error) {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: '請檢查信箱/帳號或密碼是否正確',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleFormSubmit = debounce(handleFormSubmitOriginal, 500)
const handleValidationError = debounce(handleValidationErrorOriginal, 200)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.login-form-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px $shadow-color;
}

.login-title {
  text-align: center;
  margin-bottom: 2rem;
  color: $primary-color;
  font-size: 1.75rem;
  font-weight: 600;
}

.form-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.875rem;

  a {
    color: $primary-color;
    text-decoration: none;
    font-weight: 500;

    &:hover {
      text-decoration: underline;
    }
  }
}

.forgot-password-container {
  margin-top: 1rem;
  text-align: center;
}

.forgot-password-link {
  color: $primary-color;
  font-size: 0.9rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 767px) {
  .login-container {
    padding: 1rem;
  }

  .login-form-wrapper {
    padding: 1.5rem;
    box-shadow: 0 2px 8px $shadow-color;
  }

  .login-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 375px) {
  .login-container {
    padding: 0.5rem;
  }

  .login-form-wrapper {
    padding: 1.25rem 1rem;
    border-radius: 6px;
  }

  .form-footer {
    margin-top: 1rem;
  }
}
</style>
