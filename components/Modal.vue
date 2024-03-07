<template>
  <TransitionRoot appear :show="isOpen" as="template">
    <div @click="closeModal" class="relative z-[9999]">

      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center -mt-6">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div class="transform transition-all bg-white rounded-xl relative" :style="{ 'width': props.width + 'px', 'height': props.auto ? 'auto' : props.height + 'px' }" @click.stop="">
              <div class="h-[64px] flex flex-col items-center justify-center" :class="{ '!h-20': extra }" v-if="props.title">
                <p class="text-lg font-bold text-black opacity-90">{{title}}</p>
                <p class="text-sm text-gray-500" v-if="extra">{{extra}}</p>
              </div>

              <div class="absolute right-4 top-5 w-7 h-7 cursor-pointer text-gray-600 hover:text-gray-900 " @click="closeModal">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
              </div>
              <div :style="{ 'height': props.auto ? 'auto' : props.height - 64 + 'px' }">
                <slot />
              </div>
            </div>
          </TransitionChild>
        </div>
      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
  import {
    TransitionRoot,
    TransitionChild,
    Dialog,
    DialogPanel,
    DialogTitle,
  } from '@headlessui/vue'

  const props = defineProps({
    visible: {
      type: Boolean,
      default: false
    },
    title: String,
    extra: {
      type: String,
    },
    class: String,
    auto: {
      type: Boolean,
      default: true
    },
    width: {
      type: Number,
      default: 600
    },
    height: {
      type: Number,
      default: 400
    },
  })

  const emit = defineEmits(['close']);

  const isOpen = ref(false)

  function closeModal() {
    emit('close', true)
    isOpen.value = false;
    document.body.style.overflow = 'inherit'
  }
  function openModal() {
    isOpen.value = true;
    document.body.style.overflow = 'hidden'
  }

  watch(() => props.visible, (newVal) => {
    if(newVal) {
      openModal()
    } else {
      closeModal()
    }
  })
</script>