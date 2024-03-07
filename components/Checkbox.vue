<template>
  <div class="inline-flex flex-row cursor-pointer select-none" @click="handleToggle">
    <div class="w-5 h-5 rounded border flex items-center justify-center overflow-hidden relative" :class="classString">
      <CheckIcon class="w-3.5 h-3.5 text-white absolute top-0.5 left-0.5" v-if="ischecked" />
    </div>
    <div class="text-gray-500 text-sm ml-1.5">{{label}}</div>
  </div>
</template>

<script setup>
  import { ClockIcon, ChevronRightIcon, CheckIcon } from '@heroicons/vue/24/solid';
  const props = defineProps({
    label: String,
    class: String,
    checked: Boolean
  })
  const ischecked = ref(false)
  const classString = ref('');

  function handleToggle () {
    ischecked.value = !ischecked.value;
    classString.value = ischecked.value ? props.class + ' bg-red-500 border-red-500' : props.class;
  }

</script>