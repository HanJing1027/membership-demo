# 會員管理系統 Demo

這是一個使用 Vue 3 + Laravel 構建的會員管理系統，主要就是會員註冊、登入、個人資料管理這些功能。

## 📌 技術棧

### Frontend

- **Vue 3**
- **Vite**
- **Vue Router**
- **Vuex**
- **Sass**
- **Axios**
- **Boxicons**
- **js-cookie**

### Backend

- **Laravel**
- **MySQL**
- **JWT**
- **RESTful API**

## 📌 專案架構

```
frontend/
├── src/
│   ├── assets/           # 靜態資源
│   │   └── styles/       # 樣式文件
│   │       ├── main.scss      # 主樣式
│   │       ├── _variables.scss # SCSS 變數
│   │       ├── _reset.scss    # CSS Reset
│   │       └── _mixins.scss   # SCSS 混合器
│   ├── components/       # 組件
│   │   ├── common/       # 通用組件
│   │   ├── features/     # 功能組件
│   │   ├── layout/       # 佈局組件
│   │   └── specific/     # 特定功能組件
│   ├── composable/       # 組合式函數
│   │   └── useDebounce.js # 防抖處理
│   ├── router/           # 路由配置
│   │   ├── index.js      # 路由主檔
│   │   ├── routes.js     # 路由定義
│   │   ├── guards/       # 路由守衛
│   │   └── modules/      # 模組化路由
│   ├── server/           # API 相關
│   │   └── api/          # API 接口
│   ├── store/            # Vuex 狀態管理
│   │   ├── index.js      # Store 主檔
│   │   └── modules/      # 狀態模組
│   └── views/            # 頁面組件
└── vite.config.js        # Vite 配置
```

## 📌 核心功能

### 會員認證系統

- **註冊流程**
  - 填寫基本資料，然後會寄驗證信
  - 要輸入 OTP 驗證碼才能完成註冊
  - 密碼強度檢測，太弱的密碼不給過
- **登入系統**
  - 用 JWT Token 做認證，有自動刷新機制
  - 登入狀態會存在 Cookie 裡，重開瀏覽器不用重新登入
- **忘記密碼**
  - 輸入信箱寄重設連結
  - 點連結後可以設新密碼
- **安全驗證**
  - OTP 驗證碼有時效性，過期就要重新要求
  - 密碼強度即時檢測，會提示需要哪些字元

### 會員中心

- **個人資料管理**
  - 可以改會員名稱
  - 上傳頭像，支援圖片預覽
- **密碼管理**
  - 修改密碼，要輸入舊密碼才能改
  - 密碼強度檢測，跟註冊時一樣
- **帳戶資訊**
  - 顯示加入時間
  - 其他基本資訊

### 系統功能

- **響應式設計**
  - 手機、平板、桌機都能正常使用
  - 手機版有漢堡選單
- **訊息提示**
  - 成功、錯誤都有相應的提示
  - 桌機版從右下角彈出，手機版從上方彈出
- **錯誤處理**
  - 404 頁面有做處理，不會一片空白
  - API 錯誤會顯示友善的錯誤訊息

## 📌 頁面說明

### 公開頁面

- [`Home.vue`](src/views/Home.vue) - 首頁，簡單介紹
- [`Login.vue`](src/views/Login.vue) - 登入頁面
- [`Register.vue`](src/views/Register.vue) - 註冊頁面
- [`ForgotPassword.vue`](src/views/ForgotPassword.vue) - 忘記密碼
- [`SecurityInfo.vue`](src/views/SecurityInfo.vue) - 安全須知頁面
- [`SupportCenter.vue`](src/views/SupportCenter.vue) - 客服中心

### 認證流程頁面

- [`OtpForm.vue`](src/views/OtpForm.vue) - OTP 驗證頁面
- [`CheckEmail.vue`](src/views/CheckEmail.vue) - 檢查信箱提示頁
- [`ResetPassword.vue`](src/views/ResetPassword.vue) - 重設密碼
- [`RegisterSuccess.vue`](src/views/RegisterSuccess.vue) - 註冊成功頁面，有打勾動畫

### 會員專區（需要登入）

- [`UserCenter.vue`](src/views/UserCenter.vue) - 會員中心主頁
- [`UpdatePassword.vue`](src/views/UpdatePassword.vue) - 修改密碼頁面

## 📌 組件設計

### 通用組件

- [`BaseInput.vue`](src/components/common/BaseInput.vue) - 基礎輸入框，統一樣式
- [`BaseModal.vue`](src/components/common/BaseModal.vue) - 基礎彈窗
- [`ToastMessage.vue`](src/components/common/ToastMessage.vue) - 提示訊息
- [`OtpInput.vue`](src/components/common/OtpInput.vue) - OTP 輸入框，可以自動跳到下一格
- [`PasswordStrengthChecker.vue`](src/components/common/PasswordStrengthChecker.vue) - 密碼強度檢測

### 功能組件

- [`LoginForm.vue`](src/components/features/LoginForm.vue) - 登入表單
- [`RegisterForm.vue`](src/components/features/RegisterForm.vue) - 註冊表單
- [`ImageUploadModal.vue`](src/components/features/ImageUploadModal.vue) - 圖片上傳彈窗

### 布局組件

- [`Header.vue`](src/components/layout/Header.vue) - 頁面頭部，會根據登入狀態顯示不同內容

## 📌 技術實作

### 狀態管理

用 Vuex 管理這些狀態：

- **auth.js** - 登入狀態、使用者資訊、Token 管理
- **toast.js** - 提示訊息的顯示和隱藏
- **modal.js** - 彈窗的控制

### API 管理

- 用 Axios 做請求攔截器，自動帶 Token
- 統一錯誤處理，API 出錯會自動顯示錯誤訊息
- Token 過期會自動刷新

### 路由管理

- **路由守衛** - 檢查是否需要登入才能進入某些頁面
- **動態標題** - 每個頁面都有對應的標題
- **模組化路由** - 按功能分組管理，比較好維護

### 防抖處理

用 [`useDebounce.js`](src/composable/useDebounce.js) 處理：

- 註冊、登入按鈕防抖，避免重複提交
- 搜尋輸入防抖（雖然這專案沒有搜尋功能）

### 已知問題

- 頭像上傳後需要重新整理才會更新（已修正，用版本號強制重新載入）
