<template>
  <form class="register-form" novalidate @submit.prevent="handleSubmit">
    <BaseInput label="用戶名" type="text" id="username" v-model="form.username" />

    <BaseInput label="電子郵件" type="email" id="email" v-model="form.email" />

    <BaseInput label="密碼" type="password" id="password" v-model="form.password">
      <PasswordStrengthChecker
        :password="form.password"
        @update:is-valid="passwordValid = $event"
        @update:password-checks="passwordChecks = $event"
      />
    </BaseInput>

    <BaseInput label="確認密碼" type="password" id="confirmPassword" v-model="form.confirmPassword">
      <transition name="fade-message">
        <span v-if="isPasswordMatched" class="error-message">{{ isPasswordMatched }}</span>
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
import PasswordStrengthChecker from '@/components/common/PasswordStrengthChecker.vue'

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
const passwordValid = ref(false)
const passwordChecks = ref({})

// mail 格式驗證
const validateEmail = computed(() => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.value.email)
})

// 兩次密碼驗證
const isPasswordMatched = computed(() => {
  if (!form.value.confirmPassword) return null
  return form.value.password !== form.value.confirmPassword ? '密碼與確認密碼不一致' : null
})

const handleSubmit = () => {
  if (!form.value.username || !form.value.email || !form.value.password) {
    emit('validation-error', new Error('請填寫所有欄位'))
    return
  }

  if (!validateEmail.value) {
    emit('validation-error', new Error('請輸入有效的電子郵件地址'))
    return
  }

  if (isPasswordMatched.value) {
    emit('validation-error', new Error('兩次密碼不一致'))
    return
  }

  if (!passwordValid.value) {
    emit('validation-error', new Error('密碼不符合要求'))
    return
  }

  if (!passwordChecks.value.hasOnlyAllowedSymbols) {
    emit('validation-error', new Error('密碼只能包含字母、數字和合法符號'))
    return
  }

  if (!form.value.confirmPassword) {
    emit('validation-error', new Error('請輸入確認密碼'))
    return
  }

  // 解構提取所需欄位，排除 confirmPassword
  const { confirmPassword, ...formData } = form.value

  emit('submit-form', formData)
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
