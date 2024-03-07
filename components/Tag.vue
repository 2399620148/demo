<template>
  <div class="h-6 leading-6 text-sm px-2 rounded" :class="classString">{{text}}</div>
</template>

<script setup>
  const props = defineProps({
    class: String,
    text: String,
    plain: {
      type: Boolean,
      default: false
    }
  })

  const classString = ref(props.class);

  if(props.plain) {
    classString.value = `${classString.value} !bg-transparent`
  } else {
    classString.value = `${classString.value} bg-orange-500 text-white`
  }
</script>