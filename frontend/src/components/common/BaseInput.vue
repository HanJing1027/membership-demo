<template>
  <div class="form-group">
    <label :for="id">{{ label }}</label>
    <input
      :type="type"
      :id="id"
      class="form-input"
      v-model="inputModel"
      :placeholder="placeholder"
    />
    <slot></slot>
  </div>
</template>

<script setup>
const inputModel = defineModel()

const props = defineProps({
  label: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    default: 'text',
  },
  id: {
    type: String,
    required: true,
  },
  placeholder: {
    type: String,
    default: '',
  },
})
</script>

<style lang="scss" scoped>
@use '@/assets/styles/variables.scss' as *;

.form-group {
  margin-bottom: 1.5rem;

  label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 500;
    color: #333;
  }

  .form-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 4px;
    font-size: 1rem;
    transition: border-color 0.3s;

    &:focus {
      outline: none;
      border-color: $primary-color;
      box-shadow: 0 0 0 2px rgba($primary-color, 0.1);
    }

    &::placeholder {
      color: #aaa;
    }
  }
}

@media (max-width: 767px) {
  .form-group {
    margin-bottom: 1.25rem;

    .form-input {
      padding: 0.65rem;
      font-size: 0.95rem;
    }
  }
}
</style>
