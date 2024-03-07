<template>
  <div class="w-full bg-white text-gray-600 rounded h-lvh">
    <div class="w-full h-14 px-4 flex items-center text-gray-900 font-semibold justify-between border-b">
        <span class="text-base">{{ label }}</span>
        <div class="w-7 h-7 cursor-pointer" @click="handleNew({id: 0, name: ''})">
            <PlusCircleIcon class="w-7 h-7 text-blue-600" />
        </div>
    </div>

    <div class="pt-4 px-4 overflow-x-auto overflow-y-scroll" :style="{maxHeight: 'calc(100vh - 140px)'}">
        <div
            class="h-9 leading-9 mt-1 px-2 cursor-pointer hover:bg-gray-100 rounded"
            :class="{ 'bg-blue-100 hover:bg-blue-100': formData.id === 0 }"
            @click="handleActive(null)"
        >
            全部分类
        </div>
        <a-tree 
            v-if="dataList.length > 0"
            :blockNode="true"
            :treeData="dataList"
        >
            <template v-slot:title="nodeData">
                <div class="mt-1 px-2 cursor-pointer hover:bg-gray-100 rounded flex" @click="handleActive(nodeData)">
                    <div class="flex-1 text-xs mr-0.5"> {{nodeData.name}} </div>
                    <a-button-group class="w-13 text-xs">
                        <a-button v-if="needTree && level > nodeData.level" size="small" @click.stop="handleNew(nodeData)" title="添加下级">
                            <plus-square-outlined />
                        </a-button>
                        <a-button size="small" @click.stop="handleEdit(nodeData)" title="修改">
                            <form-outlined />
                        </a-button>
                        <a-popconfirm v-if="!nodeData.children" title="确定删除该节点吗？" ok-text="确定" cancel-text="取消" @confirm="handleRemove(nodeData)">
                            <a-button size="small" @click.stop="confirmDel" title="删除">
                                <delete-outlined />
                            </a-button>
                        </a-popconfirm>
                    </a-button-group>
                </div>
            </template>
        </a-tree>
    </div>

    <a-modal 
        destroyOnClose
        :maskClosable="false"
        :title="formData.id ? '编辑分类' : '新增分类'"
        :width="400" 
        :open="visible" 
        @cancel="closeModal"
        @ok="handleSubmit"
    >
        <a-form
            :rules="termRules"
            :model="formData"
            ref="formRef"
        >
            <a-form-item label="上级分类" v-if="needTree">
                <a-input v-model:value="parentTerm.name" disabled />
            </a-form-item>
            <a-form-item label="分类名称" name="name">
                <a-textarea v-model:value="formData.name" autocomplete="off" :rows="2" showCount :maxlength="props.maxlength" />
            </a-form-item>
        </a-form>
    </a-modal>
  </div>
</template>

<script setup>
import { PlusCircleIcon } from '@heroicons/vue/24/solid';
const { $toast } = useNuxtApp();
const props = defineProps({
    type: Number,
    label: {
        type: String,
        default: "分类",
    },
    apiPath: {
        type: String,
        default: "terms",
    },
    needTree: {
        type: Boolean,
        default: false
    },
    maxlength: {
        type: Number,
        default: 25
    },
    level: {
        type: Number,
        default: 1
    }
});
const dataList = ref([]);
const visible = ref(false);
const formRef = ref();
const formData = ref({
    name: '',
});
const parentTerm = ref({});
const allTermHash = ref({});
const termRules = {
    name: [
        { required: true, message: '请填写分类名称', trigger: 'blur' }
    ]
}
const emits = defineEmits(["change"]);
const loading = ref(false);
onMounted(() => {
    getList();
});

function closeModal() {
    formData.value = {};
    visible.value = false;
    document.body.style.overflow = "inherit";
}

// 新增分类
function handleNew(item) {
    if (props.needTree) {
        const { id } = item;
        const name = id == 0 ? '全部分类' : item.name;
        parentTerm.value = {id, name};
    }
    formData.value = {name: ''};
    visible.value = true;
    document.body.style.overflow = "hidden";
}

function handleActive(item) {
    if (!item) {
        formData.value = {
            id: 0,
            name: "全部分类",
        };
    } else {
        formData.value = item;
    }
    emits("change", formData.value);
}

function handleEdit(item) {
    formData.value = {
        id: item.id,
        name: item.name
    };
    if (props.needTree) {
        const { parent_id } = item;
        const parentName = parent_id == 0 ? '全部分类' : allTermHash.value[parent_id]
        parentTerm.value = {id: parent_id, name: parentName};
    }
    visible.value = true;
    document.body.style.overflow = "hidden";
}

// 获取列表
async function getList() {
    const result = await $fetch("/api/admin/" + props.apiPath, {
        method: "POST",
        body: {
            action: "getList",
            type: props.type,
            needTree: props.needTree,
            page: 1,
            pageSize: 1000
        },
    });
    const { status, data } = result;
    if (status.code === 0) {
        const { list = [], treeList = [] } = data;
        if (props.needTree) {
            dataList.value = treeList;
            const hashMap = {};
            list.map(item => {
                hashMap[item.id] = item.name;
            });
            allTermHash.value = hashMap;
        } else {
            dataList.value = list;
        }
    } else {
        $toast.error(status.message);
    }
}

// 新增提交
async function handleSubmit() {
    formRef.value.validate().then(async () => {
        const { id, name } = formData.value;
        if (!name || name.length < 2) {
            return $toast.error("标题不能小于2个字");
        }
        if (loading.value) return false;
        loading.value = true;
        const payload = id
            ? {
                action: "updateRecord",
                id: id,
                name: name,
                parent_id: parentTerm.value.id
            }
            : {
                action: "addRecord",
                type: props.type,
                name: name,
                parent_id: parentTerm.value.id,
            };
        const result = await $fetch("/api/admin/" + props.apiPath, {
            method: "POST",
            body: payload,
        });
        loading.value = false;
        const { status } = result;
        if (status.code === 0) {
            if (payload.action === "updateRecord") {
                $toast.success("修改成功");
            } else {
                $toast.success("创建成功");
            }
            closeModal();
            getList();
        } else {
            $toast.error(status.message);
        }
    });
}

// 确认删除当前节点
function confirmDel() {
    return false;
}

// 删除
async function handleRemove(item) {
    // console.log(props.type, 'props.type')
    if (loading.value) return false;
    loading.value = true;
    const result = await $fetch("/api/admin/" + props.apiPath, {
        method: "POST",
        body: {
            action: "removeRecord",
            type: props.type,
            id: item.id,
        },
    });
    loading.value = false;
    const { status } = result;
    if (status.code === 0) {
        $toast.success("删除成功");
        getList();
    } else {
        $toast.error(status.message);
    }
}
</script>
