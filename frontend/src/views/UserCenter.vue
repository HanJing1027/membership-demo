<template>
  <div class="user-center">
    <h1>會員中心</h1>

    <div class="profile-card">
      <!-- 編輯控制按鈕 -->
      <div class="edit-controls">
        <button class="edit-btn" v-if="!isEditing" @click="startEditing">編輯檔案</button>
        <template v-else>
          <button class="save-btn" @click="saveUserData">儲存</button>
          <button class="cancel-btn" @click="cancelEditing">取消</button>
        </template>
      </div>

      <div class="profile-content">
        <!-- 左側頭像區 -->
        <div class="avatar-section">
          <div class="avatar">
            <template v-if="userDataOriginal.userAvatar">
              <img :src="userDataOriginal.userAvatar" alt="用戶頭像" />
            </template>
            <template v-else>
              <span class="avatar-default">{{ avatarDefault }}</span>
            </template>
          </div>

          <button class="change-avatar-btn" :disabled="!isEditing" @click="openFileInput">
            更換頭像
          </button>
          <input ref="fileInput" type="file" accept="image/*" style="display: none" />

          <div class="join-info">
            <p class="join-label">加入時間</p>
            <span class="join-date">{{ joinDate }}</span>
          </div>
        </div>

        <!-- 右側用戶資訊區 -->
        <div class="user-info-section">
          <h2>個人資料</h2>

          <!-- 會員名稱 -->
          <div class="info-group">
            <div class="info-label">會員名稱</div>
            <div v-if="!isEditing" class="info-value">{{ userDataOriginal.username }}</div>
            <div v-else class="info-edit">
              <input
                class="info-input"
                type="text"
                placeholder="請輸入會員名稱"
                v-model="editingUserData.username"
              />
            </div>
          </div>

          <!-- 電子信箱 -->
          <div class="info-group">
            <div class="info-label">電子郵件</div>
            <div class="info-value">{{ userDataOriginal.email }}</div>
          </div>

          <!-- 密碼 -->
          <div class="info-group">
            <div class="info-label">密碼</div>
            <div class="info-value">••••••••••••</div>
            <button class="change-password-btn">修改密碼</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { useDebounce } from '@/composable/useDebounce'
import { membershipApi } from '@/server/api/membershipApi'
import { ref, computed, onMounted } from 'vue'

const store = useStore()
const { debounce } = useDebounce()

const fileInput = ref(null) // 檔案選擇器
const isEditing = ref(false)
const editingUserData = ref(null) // 用來備份原始資料(取消時可復原)

const userDataOriginal = ref({
  username: '',
  email: '',
  userAvatar: null,
  createdAt: '',
})

const getUserData = async () => {
  const data = await membershipApi.getUserData()
  userDataOriginal.value = data.userInfo
}

const avatarDefault = computed(() => {
  return userDataOriginal.value.username.charAt(0).toUpperCase()
})

const joinDate = computed(() => {
  return userDataOriginal.value.createdAt.split('T')[0]
})

// 開始編輯
const startEditing = () => {
  isEditing.value = true
  // 建立編輯中使用的備份資料
  editingUserData.value = {
    username: userDataOriginal.value.username,
  }
}

// 取消編輯
const cancelEditing = () => {
  isEditing.value = false
  editingUserData.value = null // 清除備份資料
}

// 更換頭像(打開檔案選擇器)
const openFileInput = () => {
  fileInput.value.click()
}

// 保存用戶資料
const saveUserDataOriginal = async () => {
  try {
    await membershipApi.editingUserData(editingUserData.value)

    // 更新成功後，更新本地資料
    userDataOriginal.value.username = editingUserData.value.username // 測試
    // getUserData()
  } catch (error) {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: '保存失敗，請稍候再試',
    })
  } finally {
    isEditing.value = false
    editingUserData.value = null
  }
}

const saveUserData = debounce(saveUserDataOriginal, 200)

onMounted(() => {
  getUserData() // 獲取用戶資料
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.user-center {
  max-width: 1100px;
  margin: 0 auto;
  padding: 2rem 0;

  h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: $primary-color;
  }
}

.profile-card {
  background-color: $light-color;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px #0000001a;
  position: relative;
}

.edit-controls {
  position: absolute;
  top: 1.5rem;
  right: 2.5rem;
  display: flex;
  gap: 0.8rem;

  button {
    cursor: pointer;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .edit-btn {
    background-color: $primary-color;
    color: #fff;

    &:hover {
      background-color: darken-color($primary-color, 10%);
    }
  }

  .save-btn {
    color: $light-color;
    background-color: #4caf50;

    &:hover {
      background-color: darken-color(#4caf50, 5%);
    }
  }

  .cancel-btn {
    color: $light-color;
    background-color: #cbcbcb;

    &:hover {
      background-color: darken-color(#aaa, 10%);
    }
  }
}

.profile-content {
  display: flex;
  margin-top: 2rem;
}

.avatar-section {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;

  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #e0e0e0;
    box-shadow: 0 4px 12px #0000001a;
    overflow: hidden;
    margin-bottom: 1.5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      background-color: #fff;
    }

    .avatar-default {
      width: 100%;
      height: 100%;
      font-size: 5.5rem;
      font-weight: 600;
      color: $light-color;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  .change-avatar-btn {
    cursor: pointer;
    padding: 0.6rem 1.2rem;
    color: $text-color;
    background-color: #f5f5f5;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    transition: all 0.2s ease;

    &:hover {
      background-color: darken-color(#f5f5f5, 5%);
    }

    &:disabled {
      background-color: #e0e0e0;
      cursor: auto;
    }
  }

  .join-info {
    margin-top: 1.5rem;
    text-align: center;
    color: $text-color;
    line-height: 1.25;

    .join-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .join-date {
      font-size: 1.125rem;
      font-weight: 600;
    }
  }
}

.user-info-section {
  flex: 1;
  margin-left: 2.5rem;
  padding-left: 2.5rem;
  border-left: 1px solid #ccc;

  h2 {
    color: $text-color;
    font-size: 1.85rem;
    font-weight: 600;
    margin-bottom: 2rem;
  }

  .info-group {
    position: relative;
    margin-bottom: 1.5rem;

    .info-label {
      color: #8b8b8b;
      font-size: 0.875rem;
      font-weight: 400;
      margin-bottom: 0.5rem;
    }

    .info-value {
      font-size: 1.125rem;
      font-weight: 600;
      color: $text-color;
    }

    .change-password-btn {
      position: absolute;
      top: 0;
      right: 0;
      // transform: translateY(-50%);
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: $primary-color;
      font-weight: 500;
      letter-spacing: 1px;

      &:hover {
        text-decoration: underline;
      }
    }

    .info-edit {
      .info-input {
        width: 100%;
        max-width: 350px;
        padding: 0.75rem;
        border-radius: 6px;
        border: 1px solid #ccc;
        outline: none;
        color: $text-color;
        transition: border-color 0.2s ease;

        &::placeholder {
          color: #aaa;
        }

        &:focus {
          border-color: $primary-color;
          box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
        }
      }
    }
  }
}
</style>
