<template>
  <nav class="isolate inline-flex -space-x-px select-none">
    
    <span class="inline-flex items-center justify-center h-9 px-3 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300" @click="handlePrev">
      上一页
    </span>

    <template v-if="showFirst">
      <span class="inline-flex items-center justify-center bg-red-600 w-9 h-9 text-sm font-semibold text-white cursor-pointer !mr-1 rounded" v-if="page === 1">1</span>
      <span class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300" @click="handlePage(1)" v-else>1</span>
      <span class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300">...</span>
    </template>

    <template v-for="no in pageList">
      <span class="inline-flex items-center justify-center bg-red-600 w-9 h-9 text-sm font-semibold text-white cursor-pointer !mr-1 rounded" v-if="page === no">{{no}}</span>
      <span class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300" @click="handlePage(no)" v-else>{{no}}</span>
    </template>

    <template v-if="showEnd">
      <span class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300">...</span>
      <span class="inline-flex items-center justify-center bg-red-600 w-9 h-9 text-sm font-semibold text-white cursor-pointer !mr-1 rounded" v-if="page === totalPages">{{totalPages}}</span>
      <span class="inline-flex items-center justify-center w-9 h-9 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300" @click="handlePage(totalPages)" v-else>{{totalPages}}</span>
    </template>

    <span class="inline-flex items-center justify-center h-9 px-3 text-sm font-semibold text-gray-900 cursor-pointer rounded !mr-1 bg-white border border-gray-200 hover:border-gray-300" @click="handleNext">
      下一页
    </span>
    
  </nav>
</template>
<script setup>
  const props = defineProps({
    page: {
      type: Number,
      default: 1
    },
    pageSize: {
      type: Number,
      default: 10
    },
    total: {
      type: Number,
      default: 0
    },
  })

  const showFirst = ref(false);
  const showEnd = ref(false);
  const pageList = ref([]);
  const totalPages = ref(null);
  watch([() => props.page, () => props.total], () => {

    // 计算多少页
    let currentPage = props.page;
    totalPages.value = Math.ceil(props.total / props.pageSize);
    // 确保当前页码不超出范围
    if (currentPage < 1) {
      currentPage = 1;
    } else if (currentPage > totalPages.value) {
      currentPage = totalPages.value;
    }

    const startPage = currentPage > 2 ? currentPage - 2 : 0;

    let endPage;
    if(currentPage === 3) {
      endPage = currentPage + 3;
    } else if(currentPage < 3) {
      endPage = currentPage + 4
    } else {
      endPage = currentPage + 2;
    }

    let pages = [];
    for (let i = startPage; i <= endPage; i++) {
      if (i > 0 && i <= totalPages.value) {
        pages.push(i);
      }
    }

    // 判断是否显示第一页
    if(pages[0] === 2) {
      pages.unshift(1);
      showFirst.value = false;
    } else {
      showFirst.value = pages.indexOf(1) < 0 ? true : false;
    }
    
    // 判断是否显示最后一页
    if(pages[pages.length - 1] + 1 === totalPages.value) {
      pages.push(totalPages.value);
      showEnd.value = false;
    } else {
      showEnd.value = pages.indexOf(totalPages.value) < 0 ? true : false;
    }
    pageList.value = pages;
  }, {
    immediate: true
  })

  const emits = defineEmits(['change']);

  function handlePage (no) {
    emits('change', no);
  }

  // 上一页
  function handlePrev () {
    const page = props.page - 1;
    if(page <= 0) {
      return;
    }
    emits('change', page);
  }

  // 下一页
  function handleNext () {
    const page = props.page + 1;
    if(page > totalPages.value) {
      return false;
    }
    emits('change', page);
  }

</script>