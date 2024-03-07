<template>
  <main class="flex min-h-full w-full py-6 px-6 items-center justify-center" :class="class">
    
    <template v-if="loading">
      <div class="animate-spin w-10 h-10 rounded-full overflow-hidden">
        <svg class="text-gray-700" height="40" width="40" viewBox="0 0 24 24" role="img"><path d="M15 10.5c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5m-6-6c-.83 0-1.5-.67-1.5-1.5S8.17 7.5 9 7.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5m0 6c-.83 0-1.5-.67-1.5-1.5s.67-1.5 1.5-1.5 1.5.67 1.5 1.5-.67 1.5-1.5 1.5M12 0C5.37 0 0 5.37 0 12s5.37 12 12 12 12-5.37 12-12S18.63 0 12 0"></path></svg>
      </div>
    </template>
    <template v-else-if="$slots.default">
      <h1 class="text-lg font-normal" v-if="$slots.default">
        <slot />
      </h1>
    </template>
    <template v-else>
      <img src="/empty.png" />
    </template>

  </main>
</template>
<script setup>
const props = defineProps({
  class: {
    type: String
  },
  loading: {
    type: Boolean,
    default: false
  }
})
</script>
