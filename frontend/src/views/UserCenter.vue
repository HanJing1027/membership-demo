<template>
  <main class="user-center">
    <h1>會員中心</h1>

    <div class="profile-card">
      <!-- 編輯控制按鈕 -->
      <div class="edit-controls">
        <button class="edit-btn" v-if="!isEditing" @click="startEditing">編輯檔案</button>
        <template v-else>
          <button class="save-btn" @click="saveUserData">
            {{ isSaving ? '存儲中...' : '儲存' }}
          </button>
          <button class="cancel-btn" @click="cancelEditing">取消</button>
        </template>
      </div>

      <div class="profile-content">
        <!-- 左側頭像區 -->
        <div class="avatar-section">
          <div class="avatar">
            <!--  舊頭像 -->
            <template v-if="userDataOriginal.userAvatar">
              <img :src="setAvatarUrl" alt="用戶頭像" />
            </template>
            <!-- 無頭像 -->
            <template v-else>
              <span class="avatar-default">{{ avatarDefault }}</span>
            </template>
          </div>

          <button class="change-avatar-btn" @click="openImageUploadModal">更換頭像</button>

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
            <button class="change-password-btn" @click="goToUpdatePage">修改密碼</button>
          </div>
        </div>
      </div>
    </div>

    <ImageUploadModal
      :isOpen="isImageModalOpen"
      :isUploading="isAvatarUploading"
      @close="closeImageUploadModal"
      @uploadError="handleUploadError"
      @uploadImage="habdleUploadAvatar"
    />
  </main>
</template>

<script setup>
import ImageUploadModal from '@/components/features/ImageUploadModal.vue'

import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import { useDebounce } from '@/composable/useDebounce'
import { membershipApi } from '@/server/api/membershipApi'
import { ref, computed, onMounted } from 'vue'

const store = useStore()
const router = useRouter()
const { debounce } = useDebounce()

const isEditing = ref(false)
const isSaving = ref(false)
const editingUserData = ref(null) // 用來備份原始資料(取消時可復原)
const isImageModalOpen = ref(false)
const isAvatarUploading = ref(false) // 上傳狀態
const avatarVersion = ref(0) // 添加圖片版本控制參數

const AVATAR_BASE_URL = import.meta.env.VITE_API_BASE_AVATAR_URL

const userDataOriginal = ref({
  username: '',
  email: '',
  userAvatar: null,
  createdAt: '',
})

const setAvatarUrl = computed(() => {
  return `${AVATAR_BASE_URL}/${userDataOriginal.value.userAvatar}?v=${avatarVersion.value}`
})

const goToUpdatePage = () => {
  router.push({ name: 'UpdatePassword' })
}

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

// 打開圖片上傳模器
const openImageUploadModal = () => {
  isImageModalOpen.value = true
}

// 關閉圖片上傳模器
const closeImageUploadModal = () => {
  isImageModalOpen.value = false
}

// 處理圖片上傳錯誤
const handleUploadError = async (data) => {
  if (data.type === 'sizeError') {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: data.message,
    })
  }

  if (data.type === 'typeError') {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: data.message,
    })
  }
}

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

// 保存用戶資料
const saveUserDataOriginal = async () => {
  try {
    isSaving.value = true

    if (editingUserData.value.username === '') {
      store.dispatch('toast/showToast', {
        type: 'error',
        message: '會員名稱不得為空',
      })
      return
    }

    await membershipApi.editingUserData(editingUserData.value)

    userDataOriginal.value.username = editingUserData.value.username
  } catch (error) {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: '保存失敗，請稍候再試',
    })
  } finally {
    isSaving.value = false
    isEditing.value = false
    editingUserData.value = null
  }
}

const saveUserData = debounce(saveUserDataOriginal, 200)

// 處理上傳頭像
const habdleUploadAvatar = async (data) => {
  try {
    isAvatarUploading.value = true

    const formData = new FormData()
    formData.append('avatar', data.file)

    const response = await membershipApi.uploadAvatar(formData)

    // 更新本地用戶資料中的頭像路徑
    if (response.avatarPath) {
      userDataOriginal.value.userAvatar = response.avatarPath
    } else {
      await getUserData()
    }

    avatarVersion.value++ // 增加版本號，強制瀏覽器重新請求圖片

    store.dispatch('toast/showToast', {
      type: 'success',
      message: '頭像上傳成功',
    })
  } catch (error) {
    store.dispatch('toast/showToast', {
      type: 'error',
      message: '頭像上傳失敗，請稍候再試',
    })
  } finally {
    isImageModalOpen.value = false // 關閉
    isAvatarUploading.value = false
  }
}

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
  padding: 2rem 1rem; // 添加左右內邊距，避免在小螢幕上貼邊

  h1 {
    text-align: center;
    font-size: 2.5rem;
    font-weight: 600;
    margin-bottom: 2rem;
    color: $primary-color;

    @media (max-width: 768px) {
      font-size: 2rem; // 小螢幕上減小標題字體
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.75rem;
    }
  }
}

.profile-card {
  background-color: $light-color;
  border-radius: 12px;
  padding: 2.5rem;
  box-shadow: 0 4px 20px #0000001a;
  position: relative;

  @media (max-width: 768px) {
    padding: 2rem 1.5rem; // 在小螢幕上減少內邊距
  }

  @media (max-width: 480px) {
    padding: 1.5rem 1rem;
  }
}

.edit-controls {
  position: absolute;
  top: 1.5rem;
  right: 2.5rem;
  display: flex;
  gap: 0.8rem;

  @media (max-width: 768px) {
    position: relative;
    top: 0;
    right: 0;
    justify-content: flex-end;
    margin-bottom: 1.5rem;
  }

  button {
    cursor: pointer;
    padding: 0.6rem 1.2rem;
    border-radius: 6px;
    border: none;
    font-weight: 500;
    transition: all 0.2s ease;

    @media (max-width: 480px) {
      padding: 0.5rem 1rem; // 小螢幕上稍微減小按鈕大小
      font-size: 0.9rem;
    }
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

  @media (max-width: 1024px) {
    flex-direction: column; // 在平板和手機上改為直向排列
    align-items: center;
    margin-top: 1rem;
  }
}

.avatar-section {
  width: 250px;
  display: flex;
  flex-direction: column;
  align-items: center;

  @media (max-width: 1024px) {
    width: 100%;
    margin-bottom: 2rem;
  }

  .avatar {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background-color: #e0e0e0;
    box-shadow: 0 4px 12px #0000001a;
    overflow: hidden;
    margin-bottom: 1.5rem;

    @media (max-width: 480px) {
      width: 120px;
      height: 120px;
      margin-bottom: 1rem;
    }

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

      @media (max-width: 480px) {
        font-size: 4rem;
      }
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

    @media (max-width: 480px) {
      padding: 0.5rem 1rem;
      font-size: 0.9rem;
    }

    &:hover {
      background-color: darken-color(#f5f5f5, 5%);
    }
  }

  .join-info {
    margin-top: 1.5rem;
    text-align: center;
    color: $text-color;
    line-height: 1.25;

    @media (max-width: 480px) {
      margin-top: 1rem;
    }

    .join-label {
      font-size: 0.875rem;
      font-weight: 500;
    }

    .join-date {
      font-size: 1.125rem;
      font-weight: 600;

      @media (max-width: 480px) {
        font-size: 1rem;
      }
    }
  }
}

.user-info-section {
  flex: 1;
  margin-left: 2.5rem;
  padding-left: 2.5rem;
  border-left: 1px solid #ccc;

  @media (max-width: 1024px) {
    width: 100%;
    margin-left: 0;
    padding-left: 0;
    border-left: none;
    border-top: 1px solid #ccc;
    padding-top: 2rem;
  }

  h2 {
    color: $text-color;
    font-size: 1.85rem;
    font-weight: 600;
    margin-bottom: 2rem;

    @media (max-width: 768px) {
      font-size: 1.5rem;
      margin-bottom: 1.5rem;
    }

    @media (max-width: 480px) {
      font-size: 1.3rem;
      margin-bottom: 1.2rem;
    }
  }

  .info-group {
    position: relative;
    margin-bottom: 1.5rem;

    @media (max-width: 480px) {
      margin-bottom: 1.2rem;
    }

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

      @media (max-width: 480px) {
        font-size: 1rem;
      }
    }

    .change-password-btn {
      position: absolute;
      top: 0;
      right: 0;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: $primary-color;
      font-weight: 500;
      letter-spacing: 1px;

      @media (max-width: 768px) {
        position: static; // 在手機版上改為靜態定位
        display: block;
        margin-top: 0.5rem;
      }

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

        @media (max-width: 768px) {
          max-width: 100%; // 在小螢幕上佔滿寬度
        }

        @media (max-width: 480px) {
          padding: 0.6rem;
          font-size: 0.95rem;
        }

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
