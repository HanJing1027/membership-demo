<template>
  <div class="register-success-container">
    <svg class="success-icon" viewBox="0 0 120 120">
      <circle class="success-circle" cx="60" cy="60" r="57" />
      <path class="success-check" d="M30 65 L50 85 L90 40" />
    </svg>
    <h1 class="success-title">帳號啟用成功！</h1>
    <p class="success-message">你的帳號已成功啟用，快來體驗我們的服務吧！</p>
    <button @click="goToHome" class="login-button">前往登入</button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
const router = useRouter()

const goToHome = () => {
  router.replace({
    name: 'Login',
  })
}
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.success-icon {
  width: 120px;
  height: 120px;
  margin-bottom: 2rem;

  .success-circle {
    fill: none;
    stroke: $primary-color;
    stroke-width: 6;
    stroke-dasharray: 400; // 長度
    stroke-dashoffset: 400; // 偏移
    animation: draw-circle 1.2s ease forwards;
  }

  .success-check {
    fill: none;
    stroke: $primary-color;
    stroke-width: 8;
    stroke-linecap: round;
    stroke-linejoin: round;
    stroke-dasharray: 100; // 長度
    stroke-dashoffset: 100; // 偏移
    animation: draw-check 0.8s ease forwards 1s; // 延遲 1 秒後開始打勾
  }
}

@keyframes draw-circle {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes draw-check {
  to {
    stroke-dashoffset: 0;
  }
}

@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }
}

.register-success-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 2rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;

  .success-title {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: $text-color;
    opacity: 0; // 初始隱藏
    animation: fade-in 0.7s ease forwards 1.6s; // 打勾動畫結束後顯示
  }

  .success-message {
    font-size: 1.2rem;
    line-height: 1.6;
    margin-bottom: 2.5rem;
    color: $text-color;
    opacity: 0; // 初始隱藏
    animation: fade-in 0.7s ease forwards 1.9s; // 打勾動畫結束後顯示
  }

  .login-button {
    background-color: $primary-color;
    color: white;
    border: none;
    border-radius: 8px;
    padding: 0.8rem 2.5rem;
    font-size: 1.1rem;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.3s ease;
    opacity: 0; // 初始隱藏
    animation: fade-in 0.7s ease forwards 1.9s; // 打勾動畫結束後顯示
    transform-origin: center;
    pointer-events: none;

    // 添加點擊反饋
    &:active {
      transform: scale(0.98);
    }

    &:hover {
      background-color: darken-color($primary-color, 10%);
    }
  }

  // RWD
  @media (max-width: 768px) {
    padding: 1.5rem;

    .success-icon {
      width: 100px;
      height: 100px;
    }

    .success-title {
      font-size: 2rem;
    }

    .success-message {
      font-size: 1rem;
    }
  }

  @media (max-width: 480px) {
    padding: 1rem;

    .success-icon {
      width: 90px;
      height: 90px;
    }

    .success-title {
      font-size: 1.8rem;
      margin-bottom: 0.8rem;
    }

    .success-message {
      margin-bottom: 2rem;
    }

    .login-button {
      padding: 0.7rem 2rem;
      font-size: 1rem;
      width: 100%;
      max-width: 250px;
    }
  }
}
</style>
