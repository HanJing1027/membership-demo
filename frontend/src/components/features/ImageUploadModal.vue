<template>
  <transition name="modal-fade">
    <div v-if="isOpen" class="modal" @click.self="closeModal">
      <div class="modal-container">
        <div class="modal-header">
          <h3>更換頭像</h3>
          <button class="close-btn" @click="closeModal"><i class="bx bx-x"></i></button>
        </div>

        <div class="modal-body">
          <div class="image-preview-wrapper" @click="openFileInput">
            <!-- 已上傳 -->
            <div v-if="previewImage" class="preview-container">
              <img :src="previewImage" alt="圖片預覽" />
            </div>

            <!-- 尚未上傳 -->
            <div v-else class="no-image">
              <div class="upload-icon">
                <i class="bx bx-cloud-upload"></i>
                <p>尚未選擇圖片</p>
              </div>
            </div>
          </div>

          <div class="upload-controls">
            <button class="select-btn" @click="openFileInput">選擇圖片</button>
            <p>支援 JPG、PNG 格式，檔案大小上限 2MB</p>
            <input
              ref="fileInput"
              type="file"
              accept="image/*"
              @change="handleFileUpload"
              style="display: none"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="cancel-btn" @click="closeModal">取消</button>
          <button class="confirm-btn" @click="confirmUpload" :disabled="!imageFile || isUploading">
            {{ isUploading ? '上傳中...' : '確認上傳' }}
          </button>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { ref } from 'vue'
import { useDebounce } from '@/composable/useDebounce'

const emits = defineEmits(['close', 'uploadError', 'uploadImage'])

const props = defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
  isUploading: {
    type: Boolean,
    default: false,
  },
})

const { debounce } = useDebounce()

const fileInput = ref(null)
const previewImage = ref(null)
const imageFile = ref(null)
const isUploading = ref(false)

const openFileInput = () => {
  fileInput.value.click()
}

const closeModal = () => {
  if (props.isUploading) return

  // 清除檔案和預覽
  imageFile.value = null
  previewImage.value = null

  emits('close')
}

const handleFileUpload = () => {
  const file = fileInput.value.files[0]

  // 檔案類型檢查
  const validTypes = ['image/jpeg', 'image/png']
  if (!validTypes.includes(file.type)) {
    emits('uploadError', {
      type: 'typeError',
      message: '檔案格式僅支援 JPG、PNG',
    })
    return
  }
  // 檢查大小檔案
  const maxSize = 2 * 1024 * 1024 // 2MB
  if (file.size > maxSize) {
    emits('uploadError', {
      type: 'sizeError',
      message: '檔案大小不可超過(2MB)',
    })
    return
  }

  // 保存檔案
  imageFile.value = file

  // 預覽
  const reader = new FileReader()
  reader.onload = (event) => {
    previewImage.value = event.target.result
  }

  reader.readAsDataURL(file)
}

// 確認上傳
const confirmUploadOriginal = () => {
  emits('uploadImage', {
    file: imageFile.value,
    preview: previewImage.value,
  })
}

const confirmUpload = debounce(confirmUploadOriginal, 500)
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;
@use '@/assets/styles/mixins.scss' as *;

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition:
    opacity 0.3s ease,
    transform 0.3s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

.modal-fade-enter-from .modal-container,
.modal-fade-leave-to .modal-container {
  transform: translateY(20px);
  opacity: 0;
}

.modal-fade-enter-active .modal-container,
.modal-fade-leave-active .modal-container {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  background-color: #00000080;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-container {
  width: 90%;
  max-width: 500px;
  border-radius: 8px;
  background-color: $light-color;
  box-shadow: 0 5px 15px $shadow-color;
  // padding: 1rem 1.5rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #ccc;

  h3 {
    margin: 0;
    font-size: 1.25rem;
    font-weight: 600;
    color: $text-color;
  }

  .close-btn {
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    color: $text-color;
    background: transparent;
    border: none;
    font-size: 1.8rem;
  }
}

.modal-body {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.image-preview-wrapper {
  cursor: pointer;
  width: 250px;
  height: 250px;
  border-radius: 50%;
  background-color: #f8f8f8;
  border: 2px dashed #ccc;
  margin-bottom: 1.5rem;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 10px $shadow-color;

  .preview-container {
    width: 100%;
    height: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover; // 保持圖片比例
      object-position: center; // 保持圖片居中
    }
  }

  .no-image {
    text-align: center;
    color: $text-color;

    .upload-icon {
      font-size: 2.25rem;
      margin-bottom: 0.5rem;
    }

    p {
      font-size: 1rem;
      font-weight: 500;
    }
  }
}

.upload-controls {
  text-align: center;

  .select-btn {
    cursor: pointer;
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
    font-weight: 500;
    border: none;
    border-radius: 4px;
    color: $light-color;
    background-color: $primary-color;
    margin-bottom: 1rem;
  }

  p {
    color: $text-color;
    font-size: 0.875rem;
    font-weight: 500;
  }
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #ccc;

  button {
    cursor: pointer;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    font-weight: 500;
    transition: all 0.2s ease;
  }

  .cancel-btn {
    background-color: #eee;
    color: $text-color;

    &:hover {
      background-color: darken-color(#eee, 10%);
    }
  }

  .confirm-btn {
    background-color: $primary-color;
    color: $light-color;

    &:hover {
      background-color: darken-color($primary-color, 10%);
    }

    &:disabled {
      background-color: #ccc;
      cursor: not-allowed;
    }
  }
}
</style>
