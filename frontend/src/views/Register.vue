<template>
  <main class="register-container">
    <div class="register-form-wrapper">
      <h1 class="register-title">註冊帳號</h1>

      <RegisterForm
        :isSubmitting="isSubmitting"
        @submit-form="handleFormSubmit"
        @validation-error="handleValidationError"
      />
    </div>
  </main>
</template>

<script setup>
import RegisterForm from '@/components/features/RegisterForm.vue'
import Cookies from 'js-cookie'

import { membershipApi } from '@/server/api/membershipApi.js'
import { useDebounce } from '@/composable/useDebounce'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { ref } from 'vue'

const { debounce } = useDebounce()
const router = useRouter()
const store = useStore()
const isSubmitting = ref(false)

const handleValidationErrorOriginal = (error) => {
  try {
    store.dispatch('toast/showToast', {
      show: true,
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

    const { email } = formData
    Cookies.set('otpEmail', email, {
      sameSite: 'Strict', // 嚴格模式防止 CSRF 攻擊
    })

    //  API 請求
    await membershipApi.register(formData)

    store.dispatch('toast/showToast', {
      show: true,
      type: 'success',
      message: '已寄出驗證信件，請至信箱收取',
    })

    router.replace({ name: 'OtpForm' })
  } catch (error) {
    console.error('註冊失敗:', error)

    if (error.response.status === 460) {
      store.dispatch('toast/showToast', {
        show: true,
        type: 'error',
        message: '註冊失敗，此信箱已註冊',
      })
    } else {
      store.dispatch('toast/showToast', {
        show: true,
        type: 'error',
        message: '註冊失敗，請稍後再試',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleFormSubmit = debounce(handleFormSubmitOriginal, 500)
const handleValidationError = debounce(handleValidationErrorOriginal, 200)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.register-form-wrapper {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px $shadow-color;
}

.register-title {
  text-align: center;
  margin-bottom: 2rem;
  color: $primary-color;
  font-size: 1.75rem;
  font-weight: 600;
}

@media (max-width: 767px) {
  .register-container {
    padding: 1rem;
  }

  .register-form-wrapper {
    padding: 1.5rem;
    box-shadow: 0 2px 8px $shadow-color;
  }

  .register-title {
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
  }
}

@media (max-width: 375px) {
  .register-container {
    padding: 0.5rem;
  }

  .register-form-wrapper {
    padding: 1.25rem 1rem;
    border-radius: 6px;
  }
}
</style>
