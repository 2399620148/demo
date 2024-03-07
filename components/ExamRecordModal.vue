<template>
  <Modal :width="600" :visible="visible" @close="closeModal" title="考试记录">
    <div class="w-full px-4 pb-4">
      <div class="border border-gray-50 mt-2" v-if="dataList.length > 0">
        <div class="flex bg-gray-100 py-4 text-gray-600">
          <div class="w-20 pl-4">考试次数</div>
          <div class="flex-1">考试成绩</div>
          <div class="flex-1">是否通过</div>
          <div class="flex-1">考试用时</div>
          <div class="flex-1">操作</div>
        </div>

        <template v-for="item in dataList" :key="item.id">
          <div class="flex py-4 text-gray-600 border-b border-gray-100 hover:bg-gray-100 hover:bg-opacity-50">
            <div class="w-20 pl-4">第{{item.exam_times}}次</div>
            <div class="flex-1">{{item.score}}分</div>
            <div class="flex-1">{{item.pass ? '已通过' : '未通过'}}</div>
            <div class="flex-1">{{item.duration}}秒</div>
            <div class="flex-1">
              <NuxtLink :to=" '/grade/' + item.id " class="text-blue-500">查看详情</NuxtLink>
            </div>
          </div>
        </template>
      </div>

      <div v-else>
        <Empty />
      </div>

      <div class="flex justify-center mt-2" v-if="pagination.total > pagination.pageSize">
        <Pagination :page="pagination.page" :pageSize="pagination.pageSize" :total="pagination.total" @change="handleChange" />
      </div>

    </div>
  </Modal>
</template>
<script setup>
  const props = defineProps({
    examId: {
      type: String
    }
  })
  const visible = ref(false);
  const dataList = ref([]);

  const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
  })

  defineExpose({
    open (examId) {
      dataList.value = [];
      visible.value = true;
      getRecordList(examId);
    }
  })

  function closeModal () {
    visible.value = false;
  }

  async function getRecordList (exam_id, page = 1) {
    const result = await $fetch('/api/exams/recordlist', {
      method: 'POST',
      body: {
        exam_id: exam_id,
        page
      }
    })
    const {data, status} = result;
    if(status.code === 0) {
      dataList.value = data.list;
      pagination.value = data.pagination;
    }
  }

  function handleChange (page) {
    getRecordList(props.examId, page);
  }

</script>