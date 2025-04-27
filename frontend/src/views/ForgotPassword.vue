<template>
  <main class="forgot-password-container">
    <div class="forgot-password-form">
      <h1 class="title">忘記密碼</h1>

      <p class="description">請輸入您註冊時使用的電子郵件地址，我們將發送密碼重設連結給您。</p>

      <form @submit.prevent="handleResetLink" novalidate class="reset-form">
        <BaseInput
          label="電子郵件"
          type="email"
          id="email"
          v-model="email"
          placeholder="請輸入您的電子郵件地址"
        />

        <div class="form-actions">
          <button type="submit" class="submit-button" :disabled="isSubmitting">
            {{ isSubmitting ? '發送信件中...' : '發送重設連結' }}
          </button>
          <p class="error-message" v-if="isUnknownEamil">此信箱尚未註冊</p>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'
import { useDebounce } from '@/composable/useDebounce'
import { membershipApi } from '@/server/api/membershipApi'
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const { debounce } = useDebounce()
const store = useStore()
const router = useRouter()
const email = ref('')
const isSubmitting = ref(false)
const isUnknownEamil = ref(false)

const validateEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
})

const handleResetLinkOriginal = async () => {
  try {
    isSubmitting.value = true
    // throw error('This is a test error')

    if (!validateEmail.value) {
      store.dispatch('toast/showToast', {
        message: '請輸入有效的電子郵件地址!',
        type: 'error',
      })
      return
    }

    // api 請求
    await membershipApi.forgotPassword(validateEmail.value)

    store.dispatch('toast/showToast', {
      message: '重設連結已發送至您的電子郵件!',
      type: 'success',
    })

    router.replace({
      name: 'CheckEmail',
    })
  } catch (error) {
    // 狀態碼檢查 404
    if (error.response.status === 404) {
      isUnknownEamil.value = true
      return
    }

    store.dispatch('toast/showToast', {
      message: '發送失敗，稍後再試!',
      type: 'error',
    })
  } finally {
    isSubmitting.value = false
  }
}

const handleResetLink = debounce(handleResetLinkOriginal, 200)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.forgot-password-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 150px);
  padding: 2rem;
}

.forgot-password-form {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: white;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  margin-bottom: 1.5rem;
  color: $primary-color;
  font-size: 1.75rem;
  font-weight: 600;
}

.description {
  text-align: center;
  margin-bottom: 2rem;
  color: $text-color;
  font-size: 0.95rem;
  line-height: 1.5;
}

.form-group {
  margin-bottom: 1.5rem;
}

.reset-form {
  width: 100%;
}

.form-actions {
  margin-top: 1.5rem;
  width: 100%;
}

.error-message {
  color: #e74c3c;
  text-align: center;
  font-size: 0.85rem;
  margin-top: 0.5rem;
  margin-bottom: 0;
}

.submit-button {
  display: block;
  width: 100%;
  padding: 0.85rem;
  background-color: $primary-color;
  color: white;
  font-size: 1rem;
  font-weight: 500;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition:
    background-color 0.2s,
    transform 0.1s;

  &:hover {
    background-color: darken-color($primary-color, 5%);
  }

  &:active {
    transform: translateY(1px);
  }

  &:disabled {
    background-color: light-color($primary-color, 10%);
    cursor: not-allowed;
  }
}

@media (max-width: 767px) {
  .forgot-password-container {
    padding: 1rem;
  }

  .forgot-password-form {
    padding: 1.5rem;
  }

  .title {
    font-size: 1.5rem;
  }

  .form-actions {
    margin-top: 1.25rem;
  }

  .submit-button {
    padding: 0.75rem;
    font-size: 0.95rem;
  }
}
</style>
