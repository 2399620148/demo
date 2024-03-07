<template>
  <div class="min-h-[200px]" :class="class" v-if="dataList">
    <template v-for="(item, index) in dataList" v-if="dataList.length > 0">
      <div class="border-l border-dashed pl-5 pb-5 pr-10 relative group cursor-pointer" :class="{ '!border-0': index === dataList.length - 1 }">
        <span class="absolute w-2 h-2 border-[3px] border-red-500 bg-white -left-2 top-0 rounded-full box-content"></span>
        <div class="text-base text-gray-600 relative -top-1 leading-6">{{ item.content }}</div>
        <div class="text-sm text-gray-300 mt-1">{{ item.created_time }}</div>
        <span class="absolute right-0 -top-[2px] text-sm text-red-500 cursor-pointer opacity-0 group-hover:opacity-100" @click="handleDelete(item.id, index)">删除</span>
      </div>
    </template>
    <template v-else>
      <Empty />
    </template>
  </div>
</template>

<script setup>
  const {
    $toast
  } = useNuxtApp();
  const props = defineProps({
    class: {
      type: String,
      default: ''
    },
    course_id: {
      type: String,
      default: ''
    }
  })
  
  onMounted(() => {
    getList()
  })

  const pagination = ref(null);
  const dataList = ref(null);
  const currentPage = ref(1);

  async function getList () {
    const result = await $fetch('/api/notes/list', {
      method: 'POST',
      body: {
        page: currentPage.value,
        course_id: props.course_id
      }
    })
    const {status, data} = result;
    if(status.code === 0) {
      dataList.value = data.list;
      pagination.value = data.pagination;
    }
  }

  async function handleDelete(id, index) {
    const result = await $fetch('/api/notes/remove', {
      method: 'POST',
      body: {
        id
      }
    })
    const {status} = result;
    if(status.code === 0) {
      dataList.value.splice(index, 1);
      $toast.success('删除成功');
    } else {
      $toast.error(status.message);
    }
  }
</script>