<template>
  <form class="register-form" @submit.prevent="handleSubmit">
    <BaseInput label="用戶名" type="text" id="username" v-model="form.username" />

    <BaseInput label="電子郵件" type="email" id="email" v-model="form.email" />

    <BaseInput label="密碼" type="password" id="password" v-model="form.password" />

    <BaseInput label="確認密碼" type="password" id="confirmPassword" v-model="form.confirmPassword">
      <span v-if="passwordError" class="error-message">{{ passwordError }}</span>
    </BaseInput>

    <div class="form-actions">
      <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
        <i class="bx bx-user-plus"></i> {{ isSubmitting ? '處理中...' : '註冊' }}
      </button>
    </div>

    <div class="form-footer">已有帳號？ <router-link to="/login">前往登入</router-link></div>
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

const passwordError = computed(() => {
  if (form.value.confirmPassword && form.value.password !== form.value.confirmPassword) {
    return '兩次密碼輸入不一致'
  }
})

const handleSubmit = () => {
  if (passwordError.value) {
    emit('validation-error', new Error('密碼不一致'))
    return
  }

  emit('submit-form', { ...form.value })
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
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
      background-color: darken($primary-color, 10%);
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
</style>
