<template>
  <main class="reset-password">
    <div class="reset-card">
      <h1 class="reset-title">修改密碼</h1>
      <p class="reset-description">請設定一組新的密碼，確保您的帳戶安全</p>

      <form class="reset-form" @submit.prevent="handleResetPassword">
        <div class="input-group">
          <BaseInput
            label="舊密碼"
            type="password"
            id="old-password"
            placeholder="請輸入舊密碼"
            v-model="oldPassword"
          />
          <BaseInput
            label="新密碼"
            type="password"
            id="new-password"
            placeholder="請輸入新密碼"
            v-model="newPassword"
          >
            <PasswordStrengthChecker
              :password="newPassword"
              @update:is-valid="passwordValid = $event"
              @update:password-checks="passwordChecks = $event"
            />
          </BaseInput>
        </div>

        <div class="input-group">
          <BaseInput
            label="確認密碼"
            type="password"
            id="confirm-password"
            placeholder="請再次輸入新密碼"
            v-model="confirmPassword"
          >
            <transition name="fade-message">
              <span v-if="isPasswordMatched" class="error-message">{{ isPasswordMatched }}</span>
            </transition>
          </BaseInput>
        </div>

        <button type="submit" class="reset-button" :disabled="isSubmitting">
          {{ isSubmitting ? '重設中...' : '重設密碼' }}
        </button>
      </form>
    </div>
  </main>
</template>

<script setup>
import BaseInput from '@/components/common/BaseInput.vue'
import PasswordStrengthChecker from '@/components/common/PasswordStrengthChecker.vue'
import { membershipApi } from '@/server/api/membershipApi'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
import { useDebounce } from '@/composable/useDebounce'

const router = useRouter()
const store = useStore()

const { debounce } = useDebounce()
const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const passwordChecks = ref({})
const passwordValid = ref(false)
const isSubmitting = ref(false)

// 兩次密碼驗證
const isPasswordMatched = computed(() => {
  if (!confirmPassword.value) return null
  return newPassword.value !== confirmPassword.value ? '新密碼與確認密碼不一致' : null
})

const handleResetPasswordOriginal = async () => {
  if (!oldPassword.value || !newPassword.value || !confirmPassword.value) {
    store.dispatch('toast/showToast', {
      message: '請填寫所有欄位',
      type: 'error',
    })
    return
  }
  if (isPasswordMatched.value) {
    store.dispatch('toast/showToast', {
      message: isPasswordMatched.value,
      type: 'error',
    })
    return
  }
  if (!passwordValid.value) {
    store.dispatch('toast/showToast', {
      message: '密碼不符合要求',
      type: 'error',
    })
    return
  }
  if (!passwordChecks.value.hasOnlyAllowedSymbols) {
    store.dispatch('toast/showToast', {
      message: '密碼只能包含字母、數字和合法符號',
      type: 'error',
    })
    return
  }

  try {
    isSubmitting.value = true

    // api請求
    await membershipApi.updatePassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    })

    store.dispatch('modal/showModal', {
      title: '修改成功',
      content: '密碼已修改成功，5秒後將自動跳轉至登入頁面',
      buttonText: '前往登入',
      boxIcon: 'bx-check',
      buttonAction: 'close',
      buttonCallback: () => {
        router.replace({
          name: 'Login',
        })
      },
    })

    setTimeout(() => {
      router.replace({
        name: 'Login',
      })
      store.dispatch('modal/hideModal')
    }, 5000)
  } catch (error) {
    if (error.response.status === 401) {
      // 就密碼不正確
      store.dispatch('modal/showModal', {
        title: '舊密碼不正確',
        content: '連結已過期，請重新申請重設密碼',
        buttonText: '重新輸入',
        boxIcon: 'bx-x',
        buttonAction: 'close',
      })
    } else {
      store.dispatch('modal/showModal', {
        title: '舊密碼不正確',
        content: '連結已過期，請重新申請重設密碼',
        buttonText: '重新輸入',
        boxIcon: 'bx-x',
        buttonAction: 'close',
      })
    }
  } finally {
    isSubmitting.value = false
  }
}

const handleResetPassword = debounce(handleResetPasswordOriginal, 200)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/_variables.scss' as *;
@use '@/assets/styles/_mixins.scss' as *;

.reset-password {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 1.5rem;
}

.reset-card {
  width: 100%;
  max-width: 500px;
  padding: 3rem;
  background-color: $light-color;
  border-radius: 10px;
  box-shadow: 0 4px 20px $shadow-color;
}

.reset-title {
  color: $primary-color;
  font-size: 1.62rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.reset-description {
  color: $text-color;
  font-size: $font-size-normal;
  margin-bottom: 2rem;
  text-align: center;
  line-height: 1.5;
}

.reset-form {
  margin-bottom: 2rem;
}

.input-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    color: $text-color;
    font-weight: 500;
  }

  input {
    width: 100%;
    padding: 0.85rem 1rem;
    border: 1px solid darken-color($light-color, 15%);
    border-radius: 6px;
    font-size: $font-size-normal;
    transition:
      border-color 0.3s,
      box-shadow 0.3s;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 3px $primary-color-opacity;
    }

    &::placeholder {
      color: light-color($text-color, 40%);
    }
  }
}

.error-message {
  display: block;
  margin-top: 0.5rem;
  color: #e74c3c;
  font-size: 0.875rem;
  min-height: 1.2rem;
}

.reset-button {
  width: 100%;
  padding: 0.9rem;
  background-color: $primary-color;
  color: $light-color;
  border: none;
  border-radius: 6px;
  font-size: $font-size-normal;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.3s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: darken-color($primary-color, 10%);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px $primary-color-opacity;
  }

  &:hover:not(:disabled) {
    background-color: darken-color($primary-color, 10%);
  }
}

.back-link {
  text-align: center;
  margin-top: 1.5rem;

  a {
    color: $primary-color;
    text-decoration: none;
    font-size: 1rem;
    transition: color 0.3s ease;

    &:hover {
      color: darken-color($primary-color, 15%);
      text-decoration: underline;
    }
  }
}
</style>
