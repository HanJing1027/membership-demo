<template>
  <div class="security-container">
    <div class="security-header">
      <h1>保護您的資訊安全</h1>
      <p class="subtitle">在數位時代，個人資訊安全至關重要</p>
    </div>

    <div class="security-features">
      <div v-for="(card, index) in cards" :key="index" class="security-card">
        <i :class="`bx ${card.icon} feature-icon`"></i>
        <h3>{{ card.title }}</h3>
        <p>{{ card.description }}</p>
      </div>
    </div>

    <div class="security-info">
      <h2>安全最佳實踐</h2>
      <ul class="security-tips">
        <li v-for="(tip, index) in tips" :key="index">
          <i :class="`bx ${tip.icon}`"></i>
          <span>{{ tip.text }}</span>
        </li>
      </ul>
    </div>

    <div class="security-contact">
      <h2>有安全疑慮？</h2>
      <p>如果您有任何安全問題或有疑慮，可以與我們聯繫詢問</p>
      <div class="contact-button"><i class="bx bx-envelope"></i>0123456@example.com</div>
    </div>
  </div>
</template>

<script setup>
const cards = [
  {
    icon: 'bx-lock-alt',
    title: '密碼管理',
    description: '使用強密碼並定期更換，考慮使用密碼管理工具來生成和儲存複雜密碼',
  },
  {
    icon: 'bx-check-shield',
    title: '雙因素認證',
    description: '啟用雙因素認證為您的重要帳戶增加額外的安全層級，防止未授權的存取',
  },
  {
    icon: 'bx-data',
    title: '個資保護',
    description: '謹慎分享個人資料，了解各平台的隱私設定，並定期檢視授權的應用程式',
  },
  {
    icon: 'bx-sync',
    title: '軟體更新',
    description: '保持您的裝置和應用程式更新到最新版本，這些更新通常包含重要的安全修補',
  },
]

const tips = [
  {
    icon: 'bx-check',
    text: '定期更換密碼，並使用強密碼（包含大小寫字母、數字和特殊符號）',
  },
  {
    icon: 'bx-check',
    text: '不要在不同網站使用相同的密碼',
  },
  {
    icon: 'bx-check',
    text: '請勿在公共設備上保存登入狀態',
  },
  {
    icon: 'bx-check',
    text: '對可疑的電子郵件或訊息保持警覺',
  },
  {
    icon: 'bx-check',
    text: '確保您的設備擁有最新的安全更新',
  },
]
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.security-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 1.5rem;
}

.security-header {
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
    max-width: 600px;
    margin: 0 auto;
  }
}

.security-features {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-bottom: 4rem;
}

.security-card {
  background-color: white;
  border-radius: 8px;
  padding: 2rem;
  text-align: center;
  box-shadow: 0 4px 12px $shadow-color;
  transition:
    transform 0.3s,
    box-shadow 0.3s;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  }

  .feature-icon {
    font-size: 3rem;
    color: $primary-color;
    margin-bottom: 1rem;
  }

  h3 {
    font-size: 1.4rem;
    margin-bottom: 1rem;
    font-weight: 600;
    color: #333;
  }

  p {
    color: #666;
    line-height: 1.6;
  }
}

.security-info {
  background-color: white;
  border-radius: 8px;
  padding: 2.5rem;
  margin-bottom: 3rem;
  box-shadow: 0 4px 12px $shadow-color;

  h2 {
    color: $primary-color;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1.5rem;
    text-align: center;
  }
}

.security-tips {
  list-style: none;
  padding: 0;

  li {
    display: flex;
    align-items: flex-start;
    margin-bottom: 1rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid #f0f0f0;

    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
      border-bottom: none;
    }

    i {
      color: #4caf50;
      font-size: 1.2rem;
      margin-right: 0.75rem;
      flex-shrink: 0;
      margin-top: 0.2rem;
    }

    span {
      line-height: 1.6;
      color: #444;
    }
  }
}

.security-contact {
  text-align: center;
  background-color: white;
  border-radius: 8px;
  padding: 2.5rem;
  box-shadow: 0 4px 12px $shadow-color;

  h2 {
    color: $primary-color;
    font-size: 1.8rem;
    font-weight: 600;
    margin-bottom: 1rem;
  }

  p {
    margin-bottom: 1.5rem;
    color: #666;
    max-width: 600px;
    margin-left: auto;
    margin-right: auto;
  }

  .contact-button {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.75rem 1.5rem;
    background-color: $primary-color;
    color: white;
    border-radius: 4px;
    font-weight: 500;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
    transition: all 0.3s;

    &:hover {
      background-color: darken-color($primary-color, 10%);
      transform: translateY(-2px);
    }

    i {
      font-size: 1.2rem;
    }
  }
}

// RWD 設計
@media (max-width: 768px) {
  .security-header {
    h1 {
      font-size: 2rem;
    }

    .subtitle {
      font-size: 1rem;
    }
  }

  .security-features {
    gap: 1.5rem;
  }

  .security-card {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .security-container {
    padding: 2rem 1rem;
  }

  .security-header h1 {
    font-size: 1.75rem;
  }

  .security-info,
  .security-contact {
    padding: 1.5rem;
  }
}
</style>
