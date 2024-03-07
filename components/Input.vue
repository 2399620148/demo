<template>

  <div class="h-auto relative bg-white rounded-md" :class="class" v-if="type === 'textarea'">
    
    <div class="pt-4 h-full w-full border rounded-md" :class="{ 'border-indigo-300': isActive && !isBlur}">
      <textarea :name="name" class="w-full h-full leading-6 px-4 text-sm text-gray-900 focus-visible:outline-0 focus-visible:border-indigo-300 rounded-md" :class="{ 'text-gray-300 cursor-not-allowed': disabled }" :maxlength="maxlength" @focus="handleFocus" @blur="handleBlur" v-model="inputValue" :disabled="disabled" @input="updateValue($event.target.value)"></textarea>
    </div>

    <template v-if="label">
      <div class="absolute h-12 flex items-center text-gray-400 px-1 top-0 left-3 text-sm z-0 label-text" :class="{ 'text-xs z-10 -translate-y-6 text-indigo-500': isActive}">
        <span class="relative" :class="{ 'text-gray-400': isBlur, 'z-10': isActive  }">{{label}}</span>
        <span class="h-[1px] w-full absolute left-0 top-6 bg-white" v-if="isActive"></span>
      </div>

      <div class="absolute h-12 flex items-center text-gray-300 px-1 top-1.5 left-3 !text-sm z-0 label-text" v-if="placeholder && isActive && !inputValue">
        {{placeholder}}
      </div>
    </template>
    <template v-else>
      <div class="absolute h-12 flex items-center text-gray-300 px-1 top-1.5 left-3 !text-sm z-0 label-text" v-if="placeholder && !inputValue">
        {{placeholder}}
      </div>
    </template>

  </div>

  <div class="h-12 relative bg-white rounded-md" :class="class" v-else>

    <template v-if="type === 'password'">
      <input :type="type" :name="name" autocomplete="current-password" class="h-full w-full border px-4 py-4 rounded-md text-sm text-gray-900 focus-visible:outline-0 focus-visible:border-indigo-300 relative bg-transparent z-[1]"  :maxlength="maxlength" @focus="handleFocus" @blur="handleBlur" @input="updateValue($event.target.value)" v-model="inputValue" :autofocus="false" />
    </template>
    
    <template v-else>
      <input :type="type" :name="name" class="h-full w-full border px-4 py-4 rounded-md text-sm text-gray-900 focus-visible:outline-0 focus-visible:border-indigo-300 relative bg-transparent z-[1]" :class="{ 'text-gray-300 cursor-not-allowed': disabled, '!rounded-full': round }" :maxlength="maxlength" @focus="handleFocus" @blur="handleBlur" v-model="inputValue" :autocomplete="autocomplete" @input="updateValue($event.target.value)" :autofocus="false" :disabled="disabled" />
    </template>

    
    <template v-if="label">
      <div class="absolute h-12 flex items-center text-gray-400 px-1 top-0 left-3 text-sm z-0 label-text" :class="{ 'text-xs z-10 -translate-y-6 text-indigo-500': isActive}">
        <span class="relative" :class="{ 'text-gray-400': isBlur, 'z-10': isActive  }">{{label}}</span>
        <span class="h-[1px] w-full absolute left-0 top-6 bg-white" v-if="isActive"></span>
      </div>
      <div class="absolute h-12 flex items-center text-gray-300 px-1 top-0 left-3 text-sm z-0 label-text" v-if="placeholder && isActive && !inputValue">
        {{placeholder}}
      </div>
    </template>
    <template v-else>
      <div class="absolute h-12 flex items-center text-gray-300 px-1 top-0 left-3 text-sm z-0 label-text" v-if="placeholder && !inputValue">
        {{placeholder}}
      </div>
    </template>
    
  </div>

  
</template>

<script setup>

  const props = defineProps({
    name: {
      type: String,
      default: null
    },
    type: {
      type: String,
      default: 'text'
    },
    label: {
      type: String,
      default: null
    },
    placeholder: {
      type: String,
      default: null
    },
    class: {
      type: String
    },
    customStyle: {
      type: String,
      default: null
    },
    maxlength: {
      type: Number,
      default: 30
    },
    disabled: {
      type: Boolean,
      default: false
    },
    focus: {
      type: Boolean,
      default: false
    },
    value: {
      type: String,
      default: ''
    },
    autocomplete: {
      type: String,
      default: 'off'
    },
    round: {
      type: Boolean,
      default: false
    },
    modelValue: String,
  })
  
  const defaultValue = props.value || props.modelValue;
  const inputValue = ref(defaultValue);
  const isActive = ref(defaultValue ? true : false);
  const isBlur = ref(true);
  const emits = defineEmits(['update:modelValue','focus','blur'])

  watch(() => props.modelValue, (newVal) => {
    inputValue.value = newVal || ''
    if(isBlur.value) {
      isActive.value = !!newVal
    }
  })

  if(props.focus) {
    handleFocus();
  }
  
  function handleFocus () {
    isBlur.value = false
    isActive.value = true

    emits('focus', true)
  }

  function handleBlur () {
    isBlur.value = true;
    if(inputValue.value) {
      isActive.value = true
    } else {
      isActive.value = false
    }
    emits('blur', true)
  }

  function updateValue(value) {
    // inputValue.value = value;
    emits('update:modelValue', value);
  }
</script>

<style>
.label-text {
  transition: all .2s cubic-bezier(.4,0,.2,1),max-width .324s cubic-bezier(.4,0,.2,1);
}
</style>