<template>
  <div class="w-full bg-white h-full text-gray-600 rounded overflow-hidden">
    <div class="w-full h-14 px-4 flex items-center text-gray-900 font-semibold justify-between border-b">
      <span class="text-base">{{label}}</span>
      <div class="w-7 h-7 cursor-pointer" @click="handleNew">
        <PlusCircleIcon class="w-7 h-7 text-blue-600" />
      </div>
    </div>

    <div class="pt-4 px-4">

      <div class="h-9 leading-9 mt-1 px-2 cursor-pointer hover:bg-gray-100 rounded" :class="{ 'bg-blue-100 hover:bg-blue-100': currentTerm.id === 0 }" @click="handleActive(null)">
        全部分类
      </div>
      <template v-for="(item, index) in dataList">
        <div class="mt-1 px-2 cursor-pointer hover:bg-gray-100 rounded" :class="{ 'bg-blue-100 hover:bg-blue-100': currentTerm.id === item.id }" @click="handleActive(item)">
          <div class="h-9 group relative">
            <span class="leading-9">{{ item.name }}</span>
            <div class="absolute right-0 top-0 h-9 hidden items-center text-sm group-hover:flex">
              <span class="text-blue-500" @click.stop="handleEdit(item, index)">编辑</span>
              <span class="ml-2 text-blue-500" @click.stop="handleRemove(item, index)">删除</span>
            </div>
          </div>
        </div>
      </template>
    </div>

    <Modal :width="400" :visible="visible" @close="closeModal" title="新增分类">
      <div class="w-full py-4 px-5">
        <div class="mt-2">
          <Input type="text" name="name" label="标题" :maxlength="50" :value="defaultValue.name" v-model="formData.name" />
        </div>
        <div class="flex flex-row mt-8 justify-end">
          <Button @click="closeModal" plain class="px-4">取消</Button>
          <Button @click="handleSubmit" class="px-4 ml-2">提交</Button>
        </div>
      </div>
    </Modal>

  </div>
</template>

<script setup>
  import { PlusCircleIcon, PencilSquareIcon, TrashIcon } from '@heroicons/vue/24/solid';
  const {$toast} = useNuxtApp();
  const props = defineProps({
    type: Number,
    label: {
      type: String,
      default: '分类'
    }
  })

  const dataList = ref([]);
  const visible = ref(false);
  const formData = ref({});
  const defaultValue = ref({});

  let parentId = 0;

  onMounted(() => {
    getList();
  })

  function closeModal() {
    formData.value = {};
    visible.value = false;
    document.body.style.overflow = 'inherit'
  }

  function handleNew() {
    visible.value = true;
    document.body.style.overflow = 'hidden'
  }

  const currentTerm = ref({
    id: 0
  });
  const emits = defineEmits(['change'])
  function handleActive (item) {
    if(!item) {
      currentTerm.value = {
        id: 0,
        name: '全部分类'
      };
    } else {
      currentTerm.value = item;
    }
    emits('change', currentTerm.value)
  }

  let loading = ref(false);

  function handleEdit (item, index) {
    defaultValue.value = {
      index,
      ...item
    };
    visible.value = true;
    document.body.style.overflow = 'hidden'
  }

  // 获取列表
  async function getList () {
    const result = await $fetch('/api/admin/questionCollections', {
      method: "POST",
      body: {
        action: 'getList'
      }
    });

    const {
      status,
      data
    } = result;

    if(status.code === 0) {
      dataList.value = data ? data.list : [];
    } else {
      $toast.error(status.message)
    }
  }

  // 新增提交
  async function handleSubmit () {
    const defaultData = defaultValue.value;
    const {
      name
    } = formData.value;
    if(!name || name.length < 2) {
      return $toast.error('标题不能小于2个字');
    }
    if(loading.value) return false;
    loading.value = true;

    const payload = defaultData.id ? {
      action: 'updateRecord',
      id: defaultData.id,
      name: name,
    } : {
      action: 'addRecord',
      type: props.type,
      name: name,
      parent_id: parentId
    };

    const result = await $fetch('/api/admin/questionCollections', {
      method: "POST",
      body: payload
    });
    loading.value = false;

    const {
      status,
      data
    } = result;

    if(status.code === 0) {
      closeModal()
      if(payload.action === 'updateRecord') {
        dataList.value[defaultData.index] = {
          ...defaultData.value,
          ...data
        };
      } else {
        dataList.value.push(data);
        $toast.success('创建成功');
      }
    } else {
      $toast.error(status.message)
    }
  }

  // 删除
  async function handleRemove (item, index) {
    if(loading.value) return false;
    loading.value = true;
    const result = await $fetch('/api/admin/terms', {
      method: "POST",
      body: {
        action: 'removeRecord',
        id: item.id,
      }
    });
    loading.value = false;

    const {
      status,
      data
    } = result;

    if(status.code === 0) {
      dataList.value.splice(index, 1);
      $toast.success('删除成功');
    } else {
      $toast.error(status.message)
    }
  }
</script>