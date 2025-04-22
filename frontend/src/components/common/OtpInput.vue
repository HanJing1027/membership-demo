<template>
  <div class="otp-inputs">
    <input
      v-for="(space, index) in otpValues"
      :key="index"
      :ref="(dom) => setInputRef(dom, index)"
      class="otp-input"
      type="text"
      maxlength="1"
      v-model="otpValues[index]"
      @input="handleNextFocus(index)"
      @keydown.backspace="handleBackspace(index)"
    />
  </div>
</template>

<script setup>
import { watch, ref, onBeforeUpdate } from 'vue'

const modelValue = defineModel({
  type: String,
  default: '',
})

const props = defineProps({
  length: {
    type: Number,
    default: 6,
  },
})

// 初始化輸入框的值
const otpValues = ref(Array.from({ length: props.length }, () => ''))
const inputRefs = ref([]) // 存放 DOM 元素的 Arr

// 清空 inputRefs，避免出現重複的引用
onBeforeUpdate(() => {
  inputRefs.value = []
})

// 把 DOM 元素存到對應的陣列位置
const setInputRef = (dom, index) => {
  inputRefs.value[index] = dom
}

watch(
  // 把父組件傳來的值(modelValue)字串轉換成陣列
  modelValue,
  (newVal) => {
    otpValues.value = newVal
      .split('') // 拆成單一個字元陣列
      .concat(Array.from({ length: props.length }, () => '')) // 補空陣列（確保長度）
      .slice(0, props.length) // 切到固定長度
  },
  { immediate: true }
)

watch(
  otpValues,
  (newVal) => {
    // 將陣列組合變回字串
    modelValue.value = newVal.join('')
  },
  { deep: true }
)

// 往前輸入
const handleNextFocus = (index) => {
  // 限制輸入
  if (!/[0-9]/.test(otpValues.value[index])) {
    otpValues.value[index] = ''
    return
  }
  // 確保最後一個輸入框不會自動切換
  if (index < props.length - 1) {
    // 自動切換到下一個輸入框
    inputRefs.value[index + 1].focus()
  }
}

// 往後刪除
const handleBackspace = (index) => {
  1
  // 如果目前輸入格是空的且不是第一格
  if (!otpValues.value[index] && index > 0) {
    // 自動切換到上一個輸入框
    inputRefs.value[index - 1].focus()
  }
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.otp-inputs {
  display: flex;
  gap: 8px;
  margin-bottom: 1.5rem;
}

.otp-input {
  width: 45px;
  height: 50px;
  font-size: 1.5rem;
  text-align: center;
  border: 2px solid #ccc;
  border-radius: 8px;
  background: #f9f9f9;

  &:focus {
    border-color: $primary-color;
    outline: none;
    background: #fff;
  }
}
</style>
