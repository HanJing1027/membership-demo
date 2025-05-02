<template>
  <main class="otp-container">
    <h1 class="otp-title">驗證您的帳號</h1>

    <div class="otp-message">
      <p>我們已經將驗證碼發送至您的電子信箱</p>
      <div class="mail-tip">
        <i class="bx bx-envelope"></i>
        <p>
          若未收到信，請查看<span class="focus">垃圾郵件</span>或<span class="focus">促銷</span
          >資料夾
        </p>
      </div>
      <p class="email">{{ regEmail }}</p>
    </div>

    <form class="otp-form">
      <OtpInput v-model="otpCode" :length="6" />
      <p v-if="errorMessage" class="error-message">驗證碼無效，請重新輸入</p>
      <button
        :disabled="!isValidOtpCode"
        @click.prevent="handleSendOtpCode"
        type="submit"
        class="submit-button"
      >
        {{ isSubmitting ? '驗證中' : '驗證' }}
      </button>
    </form>

    <div class="otp-resend-container">
      <p v-if="countdown > 0">重新發送驗證碼 ({{ countdown }}秒)</p>
      <button v-else class="resend-btn" @click="handleResendOtpCode" :disabled="isResending">
        {{ isResending ? '重新發送中...' : '重新發送驗證碼' }}
      </button>
    </div>
  </main>
</template>

<script setup>
import OtpInput from '@/components/common/OtpInput.vue'

import { computed, ref, onMounted, onUnmounted } from 'vue'
import { membershipApi } from '@/server/api/membershipApi'
import { useDebounce } from '@/composable/useDebounce'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const { debounce } = useDebounce()
const router = useRouter()
const store = useStore()
const email = sessionStorage.getItem('registerEmail')
const otpCode = ref('')
const countdown = ref(0)
const timer = ref(null)
const errorMessage = ref(null)
const isSubmitting = ref(false)
const isResending = ref(false)

const regEmail = computed(() => {
  // 將 email 部分顯示改為 * (脫敏處理)
  return email.replace(/(.{3})(.*)(?=@)/, (match, p1, p2) => {
    return p1 + '*'.repeat(p2.length)
  })
})

const startCountdown = () => {
  countdown.value = 2 // 60秒倒數

  // 設置計時器
  timer.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      clearInterval(timer.value)
    }
  }, 1000)
}

const isValidOtpCode = computed(() => {
  // 驗證碼必須填滿
  return otpCode.value.length === 6
})

const handleSendOtpCodeOriginal = async () => {
  try {
    if (!isValidOtpCode.value) return

    isSubmitting.value = true

    // api請求
    await membershipApi.verifyOtp({ otp: otpCode.value, email: email })

    // 驗證成功後，清除暫存的信箱
    sessionStorage.removeItem('registerEmail')

    // 成功後跳轉頁面
    router.replace({ name: 'RegisterSuccess' })
  } catch (error) {
    errorMessage.value = '驗證碼錯誤，請重新輸入'
  } finally {
    isSubmitting.value = false
  }
}

const handleResendOtpCodeOriginal = async () => {
  if (isResending.value) return

  try {
    isResending.value = true

    await membershipApi.resendOtp({ email: email })

    store.dispatch('toast/showToast', {
      message: '驗證碼已重新發送',
      type: 'success',
    })
  } catch (error) {
    store.dispatch('toast/showToast', {
      message: '驗證碼發送失敗，請稍後再試',
      type: 'error',
    })
  } finally {
    startCountdown() // 重新倒數
    isResending.value = false
  }
}

const handleSendOtpCode = debounce(handleSendOtpCodeOriginal, 200)
const handleResendOtpCode = debounce(handleResendOtpCodeOriginal, 200)

onMounted(() => {
  startCountdown()
})

onUnmounted(() => {
  clearInterval(timer.value)
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.otp-container {
  max-width: 450px;
  margin: 2rem auto;
  padding: 2rem;
  background-color: white;
  border-radius: 12px;
  box-shadow: 0 2px 8px #0000001a;
  text-align: center;
}

.otp-title {
  font-size: 1.8rem;
  color: #333;
  margin-bottom: 1rem;
}

.otp-message {
  margin-bottom: 2rem;
  color: #555;

  .email {
    font-weight: bold;
    color: #000;
    margin-top: 0.5rem;
  }
}

.mail-tip {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0.7rem 0;
  padding: 8px 12px;
  background-color: #f8f9fa;
  border-radius: 6px;
  font-size: 0.9rem;

  i {
    font-size: 1.2rem;
    margin-right: 0.5rem;
    color: $primary-color;
  }

  p {
    margin: 0;
    color: #666;
  }

  .focus {
    color: $primary-color;
    font-weight: 600;
  }
}

.otp-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 1.5rem;
}

.error-message {
  color: #e74c3c;
  margin-bottom: 1rem;
  font-size: 0.9rem;
}

.submit-button {
  width: 100%;
  padding: 0.8rem;
  letter-spacing: 15px;
  text-align: center;
  text-indent: 15px; // 補償偏移
  background-color: $primary-color;
  color: #fff;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: darken-color($primary-color, 10%);
  }

  &:disabled {
    background-color: lighten-color($primary-color, 20%);
    cursor: not-allowed;
  }
}

.otp-resend-container {
  color: #666;
  font-size: 0.9rem;
}

.resend-btn {
  background: none;
  border: none;
  color: $primary-color;
  cursor: pointer;
  font-size: 0.9rem;
  text-decoration: underline;

  transition: color 0.15s ease;

  &:not(:disabled):hover {
    color: darken-color($primary-color, 10%);
  }
}
</style>
