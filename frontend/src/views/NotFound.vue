<template>
  <div class="not-found-container">
    <div class="not-found-content">
      <h1 class="error-code">404</h1>
      <div class="error-message">找不到您要的頁面</div>
      <p class="error-description">您要瀏覽的頁面可能已被移除或暫時無法使用</p>
      <router-link :to="{ name: 'Home' }" class="back-home-btn">
        <i class="bx bx-home-alt"></i> 返回首頁
      </router-link>
    </div>
  </div>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.not-found-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 80vh;
  padding: 2rem;
}

.not-found-content {
  text-align: center;
  max-width: 600px;
  animation: fadeIn 0.8s ease-in-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  font-size: 8rem;
  font-weight: 700;
  margin: 0;
  color: $primary-color;
  text-shadow: 4px 4px 0 #0000001a;
  animation: float 4s ease-in-out infinite;
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-15px);
  }
}

.error-message {
  font-size: 1.8rem;
  color: $text-color;
  margin: 1rem 0;
  font-weight: 600;
}

.error-description {
  color: #7f8c8d;
  margin-bottom: 2rem;
  font-size: 1.1rem;
  line-height: 1.6;
}

.back-home-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: $primary-color;
  color: #fff;
  text-decoration: none;
  border-radius: 4px;
  font-weight: 500;
  transition: all 0.3s ease;
  box-shadow: 0 2px 10px #0000001a;

  i {
    font-size: 1.2rem;
  }

  &:hover {
    background-color: darken-color($primary-color, 10%);
    transform: translateY(-2px);
  }

  &:active {
    transform: translateY(0);
  }
}

// 響應式設計
@media (max-width: 768px) {
  .error-code {
    font-size: 6rem;
  }

  .error-message {
    font-size: 1.5rem;
  }
}

@media (max-width: 480px) {
  .error-code {
    font-size: 4rem;
  }

  .error-message {
    font-size: 1.2rem;
  }

  .error-description {
    font-size: 1rem;
  }
}
</style>
