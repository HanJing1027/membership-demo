<template>
  <Transition name="toast">
    <div class="toast" v-if="toast.show">
      <div class="toast-content" :class="toast.type">
        <i class="bx" :class="toast.type === 'success' ? 'bx-check-circle' : 'bx-error-circle'"></i>
        <span>{{ toast.message }}</span>
      </div>
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  toast: {
    type: Object,
  },
})
</script>

<style lang="scss" scoped>
.toast {
  position: fixed;
  z-index: 9999;
  bottom: 30px;
  right: 30px;
  max-width: 350px;
  min-width: 300px;
  pointer-events: none;

  @media screen and (max-width: 768px) {
    top: 30px;
    right: 50%;
    transform: translateX(50%);
  }

  .toast-content {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px;
    border-radius: 8px;
    border: 1px solid;
    box-shadow: 0 0 10px 5px #00000016;

    &.success {
      border-color: #52c41a;
      color: #52c41a;
      background-color: #f6ffed;
    }

    &.error {
      border-color: #ff4d4f;
      color: #ff4d4f;
      background-color: #fff0f0;
    }

    i {
      font-size: 1.125rem;
    }

    span {
      font-size: 0.875rem;
      letter-spacing: 3px;
    }
  }
}

// 桌面版動畫 (從右側滑入，向右側滑出)
.toast-enter-from {
  opacity: 0;
  transform: translateX(350px);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.4s ease-in-out;
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(350px);
}

// 手機版動畫 (從上往下移動進入，往上移動離開)
@media screen and (max-width: 768px) {
  .toast-enter-from {
    opacity: 0;
    transform: translate(50%, -50px);
  }

  .toast-leave-to {
    opacity: 0;
    transform: translate(50%, -50px);
  }
}
</style>
