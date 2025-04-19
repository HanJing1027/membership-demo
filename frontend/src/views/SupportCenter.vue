<template>
  <div class="support-container">
    <div class="support-header">
      <h1>支援中心</h1>
      <p class="subtitle">我們隨時為您提供協助</p>
    </div>

    <div class="support-sections">
      <div class="support-section">
        <h2><i class="bx bx-help-circle"></i> 常見問題</h2>
        <div class="faq-list">
          <div v-for="(item, index) in faqItems" :key="index" class="faq-item">
            <div class="faq-question" @click="item.isOpen = !item.isOpen">
              <span>{{ item.question }}</span>
              <i :class="item.isOpen ? 'bx bx-chevron-up' : 'bx bx-chevron-down'"></i>
            </div>
            <transition name="appear">
              <div class="faq-answer" v-show="item.isOpen">
                {{ item.answer }}
              </div>
            </transition>
          </div>
        </div>
      </div>

      <div class="support-section">
        <h2><i class="bx bx-envelope"></i> 聯絡我們</h2>
        <p>如果您有任何問題或需要協助，請透過以下方式與我們聯繫：</p>

        <div class="contact-methods">
          <div class="contact-method">
            <i class="bx bx-envelope-open"></i>
            <div>
              <h3>電子郵件</h3>
              <p>0123456@example.com</p>
            </div>
          </div>

          <div class="contact-method">
            <i class="bx bx-phone"></i>
            <div>
              <h3>電話</h3>
              <p>07-1234-5678</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive } from 'vue'

const faqItems = reactive([
  {
    question: '如何重設密碼？',
    answer: '您可以在登入頁面點擊「忘記密碼」，然後依照電子郵件中的指示進行操作。',
    isOpen: false,
  },
  {
    question: '會員資料如何修改？',
    answer: '登入後前往會員中心，點擊「編輯個人資料」即可進行修改。',
    isOpen: false,
  },
  {
    question: '如何確保帳戶安全？',
    answer: '建議定期更換密碼，開啟雙重認證，並避免在公共裝置上保持登入狀態。',
    isOpen: false,
  },
  {
    question: '忘記帳號怎麼辦？',
    answer: '請使用您註冊時的電子郵件聯繫我們，我們將協助您找回帳號。',
    isOpen: false,
  },
])
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.support-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 2rem 1.5rem;
}

.support-header {
  text-align: center;
  margin-bottom: 3rem;

  h1 {
    color: $primary-color;
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #666;
  }
}

.support-sections {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
}

.support-section {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  box-shadow: 0 4px 12px $shadow-color;

  h2 {
    display: flex;
    align-items: center;
    color: $primary-color;
    font-size: 1.5rem;
    font-weight: 600;
    margin-bottom: 1.5rem;

    i {
      margin-right: 0.5rem;
      font-size: 1.8rem;
    }
  }
}

.faq-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.faq-item {
  border-bottom: 1px solid #eee;
  padding-bottom: 1rem;

  &:last-child {
    border-bottom: none;
    padding-bottom: 0;
  }
}

.faq-question {
  display: flex;
  justify-content: space-between;
  align-items: center;
  cursor: pointer;
  padding: 0.5rem 0;
  font-weight: 500;

  i {
    color: $primary-color;
    font-size: 1.2rem;
  }
}

.faq-answer {
  padding: 0.5rem 0 0.5rem 0;
  color: #666;
  line-height: 1.6;
}

.appear-enter-active,
.appear-leave-active {
  transition: all 0.3s ease;
  max-height: 200px;
  overflow: hidden;
}

.appear-enter-from,
.appear-leave-to {
  max-height: 0;
  opacity: 0;
  padding: 0;
}

.contact-methods {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-top: 1.5rem;
}

.contact-method {
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 250px;
  padding: 1rem;
  background-color: #f9f9f9;
  border-radius: 6px;

  i {
    font-size: 2rem;
    color: $primary-color;
    margin-right: 1rem;
  }

  h3 {
    margin-bottom: 0.25rem;
    font-size: 1.1rem;
    font-weight: 600;
  }

  p {
    color: #666;
  }
}

@media (max-width: 768px) {
  .support-container {
    padding: 1.5rem 1rem;
  }

  .support-header h1 {
    font-size: 2rem;
  }

  .support-section {
    padding: 1.5rem;
  }
}
</style>
