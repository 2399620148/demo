<template>
  <div class="flex h-6 pt-1 items-center justify-end text-sm cursor-pointer text-gray-500 hover:text-gray-600 select-none" :class="class" @click.stop="handleMark">
    <template v-if="isMark">
      <HeartIconSolid class="w-5 h-5 text-red-500" />
      <span class="ml-0.5">{{activeText}}</span>
    </template>
    <template v-else>
      <HeartIcon class="w-5 h-5" />
      <span class="ml-0.5">收藏</span>
    </template>
  </div>
</template>

<script setup>
  import { HeartIcon } from '@heroicons/vue/24/outline';
  import { HeartIcon as HeartIconSolid } from '@heroicons/vue/24/solid';
  const {$toast} = useNuxtApp();
  const props = defineProps({
    type: {
      type: Number
    },
    target_id: {
      type: String
    },
    status: {
      type: Boolean
    },
    class: {
      type: String
    },
    activeText: {
      type: String,
      default: '已收藏'
    }
  })
  const isMark = ref(props.status ? true : false);
  const emits = defineEmits(['callback']);

  // 收藏
  let loading = ref(false);
  async function handleMark () {
    if(loading.value) return;
    loading.value = true;

    const {type, target_id} = props;

    // 如果已经收藏
    if(isMark.value) {
      const result = await $fetch('/api/marks/remove', {
        method: 'POST',
        body: {
          type,
          target_id: target_id
        }
      })
      loading.value = false;
      if(result.status.code === 0) {
        isMark.value = false;
        $toast.success('取消成功')
        emits('callback', 'unmark')
      } else {
        $toast.error(result.status.message)
      }
    } else {
      const result = await $fetch('/api/marks/new', {
        method: 'POST',
        body: {
          type,
          target_id
        }
      })
      loading.value = false;
      if(result.status.code === 0) {
        isMark.value = true;
        $toast.success('收藏成功')

        emits('callback', 'mark')
      } else {
        $toast.error(result.status.message)
      }
    }
  }
</script>