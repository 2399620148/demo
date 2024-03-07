<template>
  <div class="relative h-full inline-block z-10" :class="class" @mouseleave="open = false">
    <div @mouseover="open = true">
      <slot name="default" :active="open" />
    </div>
    
    <transition name="slide-down">
      <div class="absolute top-full w-24" :class="alignClass" v-show="open">
        <div class="bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none p-1 rounded relative mt-1">
          
          <template v-if="slots.items">
            <slot name="items" />
          </template>
          <div
            v-for="item in options"
            @click="handleChange(item)"
            v-else
          >
            <div class="text-gray-700 px-4 py-2 text-sm cursor-pointer rounded hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center">
              <div class="block whitespace-nowrap">{{item.label}}</div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
  const props = defineProps({
    class: String,
    label: String,
    value: Number,
    options: Array,
    align: String
  })
  const slots = useSlots();
  const open = ref(false);
  const emits = defineEmits(['change'])
  function handleChange(item) {
    emits('change', item);
  }

  const alignClass = computed(() => {
    if(props.align === 'left') {
      return 'left-0'
    } else if(props.align === 'right') {
      return 'right-0'
    } else {
      return '-ml-12 left-1/2'
    }
  })
</script>

<style scoped>
.slide-down-enter-active{
  transition: all 0.5s;
}
.slide-down-leave-active{
  transition: all 0.2s;
}

.slide-down-enter-from{
  opacity: 0;
  transform: translateY(-10px);
}

.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
</style>