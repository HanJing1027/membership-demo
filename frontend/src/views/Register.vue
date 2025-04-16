<template>
  <ToastMessage :toast="toast" />
  <div class="register-container">
    <div class="register-form-wrapper">
      <h1 class="register-title">註冊帳號</h1>

      <RegisterForm
        :isSubmitting="isSubmitting"
        @submit-form="handleFormSubmit"
        @validation-error="handleValidationError"
      />
    </div>
  </div>
</template>

<script setup>
import ToastMessage from '@/components/common/ToastMessage.vue'
import RegisterForm from '@/components/features/RegisterForm.vue'

import { ref } from 'vue'

const isSubmitting = ref(false)

const toast = ref({
  show: false,
  type: 'sccess',
  message: '',
})

const handleValidationError = (error) => {
  try {
    toast.value = {
      show: true,
      type: 'error',
      message: error.message,
    }
  } catch (error) {
    console.error('驗證錯誤:', error)
  } finally {
    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }
}

const handleFormSubmit = async (formData) => {
  try {
    isSubmitting.value = true

    //  API 請求

    toast.value = {
      show: true,
      type: 'success',
      message: '註冊成功！5秒後跳轉到登入頁面',
    }
  } catch (error) {
    console.error('註冊失敗:', error)

    toast.value = {
      show: true,
      type: 'error',
      message: '註冊失敗，請稍後再試。',
    }
  } finally {
    isSubmitting.value = false

    setTimeout(() => {
      toast.value.show = false
    }, 3000)
  }
}
</script>

<style lang="scss" scoped>
@import '@/assets/styles/variables.scss';

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
</style>
