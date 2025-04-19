<template>
  <form class="">
    <BaseInput label="帳號/信箱" type="email" id="email" v-model="form.email" />

    <BaseInput label="密碼" type="password" id="password" v-model="form.password" />

    <div class="form-actions">
      <button
        @click.prevent="handleSubmit"
        type="submit"
        class="btn btn-primary"
        :disabled="isSubmitting"
      >
        <i class="bx bx-user"></i> {{ isSubmitting ? '處理中...' : '登入' }}
      </button>
    </div>

    <div class="form-footer">
      還沒有帳號？ <router-link :to="{ name: 'Register' }">註冊新帳號</router-link>
    </div>
  </form>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'

import { ref } from 'vue'

const emit = defineEmits(['submit-form', 'validation-error'])

const props = defineProps({
  isSubmitting: {
    type: Boolean,
    default: false,
  },
})

const form = ref({
  email: '',
  password: '',
})

const handleSubmit = () => {
  // 驗證表單
  if (!form.value.email || !form.value.password) {
    emit('validation-error', new Error('請填寫所有欄位'))
    return
  }

  // 提交表單
  emit('submit-form', form.value)
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

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

// RWD 樣式
@media (max-width: 767px) {
  .form-actions {
    margin-top: 1.5rem;

    .btn {
      padding: 0.7rem;
      font-size: 0.95rem;
    }
  }

  .form-footer {
    margin-top: 1.25rem;
    font-size: 0.85rem;
  }
}

@media (max-width: 480px) {
  .form-actions {
    margin-top: 1.25rem;

    .btn {
      padding: 0.65rem;
      font-size: 0.9rem;

      i {
        font-size: 1.1rem;
      }
    }
  }

  .form-footer {
    margin-top: 1rem;
  }
}

@media (max-width: 375px) {
  .login-form {
    padding: 0 0.25rem;
  }

  .form-actions .btn {
    padding: 0.6rem;
  }
}
</style>
