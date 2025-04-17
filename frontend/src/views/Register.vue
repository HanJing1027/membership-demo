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

import { membershipApi } from '@/server/api/membershipApi.js'
import { useRouter } from 'vue-router'
import { ref } from 'vue'

const router = useRouter()
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

    const userData = { ...formData }
    if (!userData.username || !userData.email || !userData.password) {
      toast.value = {
        show: true,
        type: 'error',
        message: '請填寫所有必填欄位',
      }
      return
    }

    //  API 請求
    await membershipApi.register(formData)

    toast.value = {
      show: true,
      type: 'success',
      message: '註冊成功！5秒後跳轉到登入頁面',
    }

    setTimeout(() => {
      router.push({
        name: 'Login',
      })
    }, 5000)
  } catch (error) {
    console.error('註冊失敗:', error)

    toast.value = {
      show: true,
      type: 'error',
      message: '註冊失敗，請稍後再試',
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
