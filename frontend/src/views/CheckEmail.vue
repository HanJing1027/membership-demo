<template>
  <main class="check-email-container">
    <div class="check-email-card">
      <div class="email-icon">
        <i class="bx bx-mail-send"></i>
      </div>
      <h1>請檢查您的電子郵件</h1>
      <p class="email-description">
        我們已經寄出一封重設密碼的郵件給您，記得去收件匣看看，請按照信裡的指示操作感謝配合！
      </p>
      <router-link to="/login" class="back-button">
        <i class="bx bxs-chevrons-left"></i>前往登入
      </router-link>
    </div>
  </main>
</template>

<script setup></script>

<style lang="scss" scoped>
@use '@/assets/styles/variables' as *;
@use '@/assets/styles/mixins' as *;

.check-email-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 80vh;
  padding: 1rem;
  max-width: 600px;
  margin: 0 auto;
  text-align: center;
}

.check-email-card {
  max-width: 480px;
  width: 100%;
  padding: 2.5rem;
  text-align: center;
  animation: fadeIn 0.4s ease-in;
}

.email-icon {
  margin-bottom: 1.5rem;

  i {
    font-size: 7.375rem;
    color: $primary-color;
  }
}

h1 {
  font-size: 1.75rem;
  font-weight: 600;
  margin-bottom: 1rem;
  color: $primary-color;
}

.email-description {
  color: $text-color;
  line-height: 1.6;
  margin-bottom: 2rem;
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background-color: $primary-color;
  color: $light-color;
  text-decoration: none;
  border-radius: 8px;
  font-weight: 500;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    background-color: darken-color($primary-color, 10%);
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

@media (max-width: 640px) {
  .check-email-card {
    padding: 1.5rem;
  }

  h1 {
    font-size: 1.5rem;
  }
}
</style>
