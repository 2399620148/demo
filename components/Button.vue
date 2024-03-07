<template>
  <div :class="[customClass, props.class , {'opacity-50 cursor-not-allowed': disabled}]">
    <slot />
  </div>
</template>
<script setup>
  const props = defineProps({
    icon: String,
    size: String,
    class: String,
    plain: Boolean,
    round: Boolean,
    circle: Boolean,
    disabled: Boolean
  })
  
  // let classList = ["flex cursor-pointer items-center justify-center text-white"];
  let classList = ["flex items-center justify-center py-2 px-4 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 cursor-pointer tracking-wide select-none pointer-events-auto h-full"];

  if(props.plain) {
    classList.push('bg-white text-gray-600 hover:bg-gray-50 hover:text-gray-900 ring-1 ring-inset ring-gray-300')
  } else {
    classList.push('border-transparent bg-indigo-600 hover:bg-indigo-700 text-white')
  }

  if(props.round) {
    classList.push('rounded-full')
  } else {
    classList.push('rounded-md')
  }

  if(props.size === 'small') {
    classList.push('px-3 py-2')
  } else if(props.size === 'big') {
    classList.push('px-5 py-3')
  } else {
    classList.push('px-5 py-2.5')
  }

  if(props.circle) {
    classList.push('!w-10 !h-10 !px-0 !py-0 !rounded-full')
  }
  const customClass = classList.join(' ')

  // watch(() => props.class, (newVal) => {

  // })
</script>