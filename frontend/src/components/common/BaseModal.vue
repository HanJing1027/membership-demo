<template>
  <div class="modal-mask" v-if="modal.show">
    <div class="modal-card">
      <div class="modal-header">
        <i class="bx" :class="modal.boxIcon"></i>
      </div>
      <div class="modal-body">
        <h1 class="modal-title">{{ modal.title }}</h1>
        <p class="modal-content">{{ modal.content }}</p>
        <button class="modal-btn" v-if="modal.buttonText" @click="handleBtn">
          {{ modal.buttonText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useDebounce } from '@/composable/useDebounce'

const { debounce } = useDebounce()
const store = useStore()

const props = defineProps({
  modal: {
    type: Object,
    required: true,
    default: () => ({
      show: false,
      title: '',
      content: '',
      boxIcon: '',
      buttonText: '',
      buttonAction: null,
      buttonCallback: null,
    }),
  },
})

const handleBtnOriginal = () => {
  store.dispatch('modal/handleButtonAction', {
    action: props.modal.buttonAction,
    callback: props.modal.buttonCallback,
  })
}

const handleBtn = debounce(handleBtnOriginal, 200)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  padding: 1rem;
}

.modal-card {
  max-width: 450px;
  width: 100%;
  padding: 1rem;
  background-color: $light-color;
  border-radius: 8px;
  box-shadow: 0 4px 16px $shadow-color;
  text-align: center;
  animation: fadeIn 0.3s ease;
}

.modal-header {
  margin-bottom: 1.5rem;

  i {
    font-size: 4.78rem;
    color: $primary-color;
  }
}

.modal-title {
  color: $primary-color;
  font-size: 1.65rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.modal-body {
  width: 100%;
  text-align: center;
}

.modal-content {
  color: $text-color;
  font-size: 1rem;
  margin-bottom: 1.5rem;
  line-height: 1.5;
}

.modal-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  min-width: 120px;
  padding: 0.6rem 1.2rem;
  background-color: $primary-color;
  color: $light-color;
  border: none;
  border-radius: 6px;
  font-size: 0.95rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-top: 0.5rem;

  &:hover {
    background-color: darken-color($primary-color, 10%);
  }

  &:active {
    transform: scale(0.98);
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 3px $primary-color-opacity;
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
