<template>
    <Modal :width="800" :visible="visible" @close="closeModal" title="学时记录">
        <div class="flex px-4 pb-4">
            <a-input
                size="large"
                v-model:value="searchFilter"
                placeholder="请输入课程名称"
                allowClear
                class="mr-2"
            />
            <a-button size="large" @click="getRecordList(1)" class="ml-2" type="primary" :icon="h(SearchOutlined)">查询</a-button>
        </div>
        <div class="w-full px-4 pb-4">
            <div class="border border-gray-50 mt-2 max-h-[700px] overflow-hidden overflow-y-auto" v-if="dataList.length > 0">
                <div class="flex bg-gray-100 py-4 text-gray-600">
                    <div class="w-20 pl-4">年度</div>
                    <div class="flex-1">培训班</div>
                    <div class="flex-1">课程</div>
                    <div class="flex-1">学时</div>
                    <div class="flex-1">时间</div>
                </div>
                <template v-for="item in dataList" :key="item.id">
                    <div class="flex py-4 text-gray-600 border-b border-gray-100 hover:bg-gray-100 hover:bg-opacity-50">
                        <div class="w-20 pl-4">{{ item.year }}</div>
                        <div class="flex-1">{{ item.class_name || '-' }}</div>
                        <div class="flex-1">{{ item.course_name || '-' }}</div>
                        <div class="flex-1">{{ formatNumber(item.learn_hour) }}</div>
                        <div class="flex-1">{{ item.created_time }}</div>
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
import { SearchOutlined } from "@ant-design/icons-vue";
const visible = ref(false);
const dataList = ref([]);
const searchFilter = ref()
const pagination = ref({
    page: 1,
    pageSize: 10,
    total: 0
})

defineExpose({
    open() {
        dataList.value = [];
        visible.value = true;
        getRecordList();
    }
})

function closeModal() {
    visible.value = false;
    searchFilter.value = '';
}

async function getRecordList(page = 1) {
    const coursename = searchFilter.value;
    const result = await $fetch('/api/user/learnrecord', {
        method: 'POST',
        body: {
            page,
            ...(coursename ? {coursename} : {})
        }
    })
    const { data, status } = result;
    if (status.code === 0) {
        dataList.value = data.list;
        pagination.value = data.pagination;
    }
}

function handleChange(page) {
    getRecordList(page);
}

</script>