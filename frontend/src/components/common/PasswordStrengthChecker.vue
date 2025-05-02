<template>
  <div class="password-feedback-container">
    <transition name="fade-slide">
      <div v-if="password" class="password-strength">
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
</template>

<script setup>
import { computed, watch } from 'vue'

const props = defineProps({
  password: {
    type: String,
    default: '',
  },
})

const emit = defineEmits(['update:is-valid', 'update:password-checks'])

// 密碼驗證檢查
const passwordChecks = computed(() => {
  const password = props.password

  // 合法特殊符號
  const symbolRegex = /^[a-zA-Z0-9!@#$%^&*(),.?":{}|<>]*$/

  return {
    hasNumber: /[0-9]/.test(password),
    hasLength: password.length >= 8 && password.length <= 16,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasSpecial: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasOnlyAllowedSymbols: symbolRegex.test(password), // 檢查是否只包含合法特殊符號
  }
})

// 判斷密碼是否符合所有要求
const isPasswordChecked = computed(() => {
  const checks = passwordChecks.value
  return checks.hasNumber && checks.hasLength && checks.hasUppercase && checks.hasLowercase
})

// 密碼強度計算
const passwordStrength = computed(() => {
  const password = props.password
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

// 將密碼有效性和檢查結果更新到父組件上
watch(
  [isPasswordChecked, passwordChecks],
  () => {
    emit('update:is-valid', isPasswordChecked.value)
    emit('update:password-checks', passwordChecks.value)
  },
  { immediate: true }
)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

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

.password-feedback-container {
  position: relative;
  min-height: 0;
  margin-bottom: 1.5rem;
}

.password-strength {
  position: relative;
  width: 100%;
  z-index: 5;
  background-color: $light-color;
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
</style>
