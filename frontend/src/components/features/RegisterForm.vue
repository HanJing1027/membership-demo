<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <BaseInput label="用戶名" type="text" id="username" v-model="form.username" />

    <BaseInput label="電子郵件" type="email" id="email" v-model="form.email" />

    <BaseInput label="密碼" type="password" id="password" v-model="form.password">
      <div class="password-feedback-container">
        <transition name="fade-slide">
          <div v-if="form.password" class="password-strength">
            <div class="strength-bar">
              <div
                class="strength-progress"
                :style="{
                  width: `${passwordStrength.percentage}%`,
                  backgroundColor: passwordStrength.color,
                }"
              ></div>
            </div>

            <div class="strength-label" :style="{ color: passwordStrength.color }">
              密碼強度：{{ passwordStrength.label }}
            </div>

            <ul class="password-requirements">
              <li :class="{ 'requirement-met': passwordChecks.hasNumber }">至少1個數字</li>
              <li :class="{ 'requirement-met': passwordChecks.hasLength }">長度限 8 ~ 16 字元</li>
              <li :class="{ 'requirement-met': passwordChecks.hasUppercase }">至少1個大寫字母</li>
              <li :class="{ 'requirement-met': passwordChecks.hasLowercase }">至少1個小寫字母</li>
              <li :class="{ 'requirement-met': passwordChecks.hasSpecial }">建議1個特殊字元</li>
            </ul>
          </div>
        </transition>
      </div>
    </BaseInput>

    <BaseInput label="確認密碼" type="password" id="confirmPassword" v-model="form.confirmPassword">
      <transition name="fade-message">
        <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
      </transition>
    </BaseInput>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <i class="bx bx-user-plus"></i> {{ isSubmitting ? '處理中...' : '註冊' }}
      </button>
    </div>

    <div class="form-footer">
      已有帳號？ <router-link :to="{ name: 'Login' }">前往登入</router-link>
    </div>
  </form>
</template>

<script setup>
import { computed, ref } from 'vue'
import BaseInput from '@/components/common/BaseInput.vue'

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

// 定義事件
const emit = defineEmits(['submit-form', 'validation-error'])

const form = ref({
  username: '',
  email: '',
  password: '',
  confirmPassword: '',
})

// 密碼驗證檢查
const passwordChecks = computed(() => {
  const password = form.value.password

  // 合法特殊符號
  const symbolRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/

  return {
    hasNumber: /[0-9]/.test(password),
    hasLength: password.length >= 8 && password.length <= 16,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasOnlyAllowedSymbols: symbolRegex.test(password),
  }
})

// 判斷密碼是否符合所有要求
const isPasswordChecked = computed(() => {
  const checks = passwordChecks.value
  return checks.hasNumber && checks.hasLength && checks.hasUppercase && checks.hasLowercase
})

// 密碼強度計算
const passwordStrength = computed(() => {
  const password = form.value.password
  if (!password) return

  // 計算強度
  const checks = passwordChecks.value
  let score = 0
  let strengthPercentage
  let strengthLabel
  let strengthColor

  if (checks.hasLength) score++
  if (checks.hasNumber) score++
  if (checks.hasUppercase) score++
  if (checks.hasLowercase) score++
  if (checks.hasSpecial) score++

  switch (score) {
    case 0:
      strengthPercentage = 0
      strengthLabel = '無'
      strengthColor = '#e74c3c'
      break
    case 1:
      strengthPercentage = 20
      strengthLabel = '非常弱'
      strengthColor = '#e74c3c'
      break
    case 2:
      strengthPercentage = 40
      strengthLabel = '弱'
      strengthColor = '#e67e22'
      break
    case 3:
      strengthPercentage = 60
      strengthLabel = '中等'
      strengthColor = '#f1c40f'
      break
    case 4:
      strengthPercentage = 80
      strengthLabel = '強'
      strengthColor = '#2ecc71'
      break
    default:
      strengthPercentage = 100
      strengthLabel = '非常強'
      strengthColor = '#27ae60'
  }

  return {
    percentage: strengthPercentage,
    label: strengthLabel,
    color: strengthColor,
  }
})

const passwordError = computed(() => {
  if (!form.value.confirmPassword) {
    return '請輸入確認密碼'
  }

  if (form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
    return '兩次密碼輸入不一致'
  }
})

const handleSubmit = () => {
  // 檢查所有必填的欄位
  if (!form.value.username || !form.value.email || !form.value.password) {
    emit('validation-error', new Error('請填寫所有欄位'))
    return
  }

  if (passwordError.value) {
    emit('validation-error', new Error('兩次密碼不一致'))
    return
  }

  if (!isPasswordChecked.value) {
    emit('validation-error', new Error('密碼不符合要求'))
    return
  }

  if (!passwordChecks.value.hasOnlyAllowedSymbols) {
    emit('validation-error', new Error('密碼只能包含字母、數字和合法符號'))
    return
  }

  // 空確認密碼檢查
  if (!form.value.confirmPassword) {
    emit('validation-error', new Error('請輸入確認密碼'))
    return
  }

  emit('submit-form', form.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

// 錯誤訊息的過渡效果
.fade-message-enter-active,
.fade-message-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease,
    max-height 0.3s ease;
  max-height: 2rem;
  overflow: hidden;
}

.fade-message-enter-from,
.fade-message-leave-to {
  opacity: 0;
  transform: translateY(-5px);
  max-height: 0;
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
  min-height: 1.2rem;
}

.password-feedback-container {
  position: relative;
  min-height: 0; // 初始高度為0
  margin-bottom: 1.5rem; // 在下方預留固定空間
}

// 調整過渡效果
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition:
    opacity 0.35s ease,
    transform 0.35s ease-out;
  transform-origin: top;
}

.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px) scaleY(0.95);
}

.password-strength {
  position: relative;
  width: 100%;
  z-index: 5;
  background-color: white;
  border-radius: 4px;
  box-shadow: 0 2px 6px #0000001a;
  padding: 0.8rem 1rem;
  margin-top: 0.5rem;

  .strength-bar {
    height: 5px;
    background-color: #eee;
    margin-bottom: 5px;

    .strength-progress {
      height: 100%;
      transition:
        width 0.3s,
        background-color 0.3s;
    }
  }

  .strength-label {
    font-size: 0.875rem;
    margin-bottom: 8px;
  }

  .password-requirements {
    padding-left: 1.2rem;
    margin-top: 0.5rem;
    font-size: 0.8rem;
    color: #777;

    li {
      margin-bottom: 4px;
      transition: color 0.3s;

      &.requirement-met {
        color: #27ae60;

        &::before {
          content: '✓ ';
        }
      }
    }
  }
}

.form-actions {
  margin-top: 2rem;

  .btn {
    width: 100%;
    padding: 0.75rem;
    border: none;
    border-radius: 4px;
    font-size: 1rem;
    font-weight: 500;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 0.5rem;
    cursor: pointer;
    transition: all 0.3s;

    &:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }

    i {
      font-size: 1.25rem;
    }
  }

  .btn-primary {
    background-color: $primary-color;
    color: white;

    &:hover:not(:disabled) {
      background-color: darken-color($primary-color, 10%);
    }
  }
}

.form-footer {
  text-align: center;
  margin-top: 1.5rem;
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

@media (max-width: 767px) {
  .register-form {
    padding: 0 0.5rem;
  }

  .password-strength {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
    box-shadow: none;
    border: 1px solid #eee;
  }

  .form-actions .btn {
    padding: 0.65rem;
  }
}

@media (max-width: 375px) {
  .password-requirements {
    padding-left: 0.8rem !important;
    font-size: 0.75rem !important;
  }

  .strength-label {
    font-size: 0.8rem !important;
  }
}
</style>
