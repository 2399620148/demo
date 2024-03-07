<template>
  <TransitionRoot appear :show="!!defaultData.action" as="template">
    <div @click="closeModal" class="relative z-[9999]">

      <TransitionChild
        as="template"
        enter="duration-300 ease-out"
        enter-from="opacity-0"
        enter-to="opacity-100"
        leave="duration-200 ease-in"
        leave-from="opacity-100"
        leave-to="opacity-0"
      >
        <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
      </TransitionChild>

      <div class="fixed inset-0 overflow-y-auto">
        <div class="flex min-h-full items-center justify-center p-4 text-center" v-if="formType === 'edit'">
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div class="transform transition-all bg-white rounded-xl relative flex flex-col min-w-[480px]" @click.stop="">
              <div class="p-5">
                <div class="text-lg font-bold text-black opacity-90 pb-5">{{ title }}</div>
                <div class="absolute right-4 top-5 w-7 h-7 cursor-pointer text-gray-600 hover:text-gray-900 " @click="closeModal">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-7 h-7"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                </div>

                <div class="flex items-center justify-center">
                  <UploadImage class="!w-28 !h-28 border rounded-xl cursor-pointer overflow-hidden" :value="defaultData.cover" v-model="formData.cover">
                    <div class="flex w-full h-full items-center justify-center text-sm text-gray-700">上传封面</div>
                  </UploadImage>
                </div>

                <div class="mt-6">
                  <Input type="text" name="title" label="标题" :maxlength="100" :value="defaultData.title" v-model="formData.title" />
                </div>

                <div class="mt-6">
                  <SelectInput name="termId" label="画板分类" :options="boardTerms" :value="defaultData.termId" v-model="formData.termId" />
                </div>

                <!-- <div class="mt-6">
                  <SelectInput name="firstId" label="画板分类" :options="boardTerms" :value="defaultData.firstId" v-model="formData.firstId" @update:model-value="handleFirstChange" />
                </div>

                <div class="mt-6" v-if="secondTerms.length > 0">
                  <SelectInput name="secondId" label="二级分类" :options="secondTerms" :value="defaultData.secondId" v-model="formData.secondId" />
                </div> -->

                <div class="mt-6">
                  <Input type="textarea" name="desc" label="描述" placeholder="请填写该画板的描述信息" :maxlength="500" :value="defaultData.desc" v-model="formData.desc" />
                </div>

              </div>

              <div class="flex flex-row items-center justify-between bg-gray-50 p-4 px-5 rounded-b-xl">
                <span class=" text-red-500 hover:text-red-600 cursor-pointer select-none" @click="formType = 'delete'" v-if="defaultData.uniqueId">删除画板</span>
                <div class="flex-1 flex items-center justify-end">
                  <Button @click="closeModal" plain class="px-4 mr-2">取消</Button>
                  <Button @click="handleSubmit" class="px-4">确认</Button>
                </div>
              </div>
            </div>
          </TransitionChild>
        </div>

        <div class="flex min-h-full items-center justify-center p-4 text-center" v-else>
          <TransitionChild
            as="template"
            enter="duration-300 ease-out"
            enter-from="opacity-0 scale-95"
            enter-to="opacity-100 scale-100"
            leave="duration-200 ease-in"
            leave-from="opacity-100 scale-100"
            leave-to="opacity-0 scale-95"
          >
            <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all w-[450px] max-w-full"  @click.stop="">
              <div class="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div class="sm:flex sm:items-start">
                  <ExclamationTriangleIcon class="h-7 w-7 text-red-400" aria-hidden="true" />
                  <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <div class="text-lg font-semibold leading-6 text-gray-900">删除"{{defaultData && defaultData.title}}"</div>
                    <div class="mt-2">
                      <p class="text-sm text-gray-500">确定删除该画板吗？</p>
                    </div>
                  </div>
                </div>
              </div>
              <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
                <button type="button" class="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:ml-3 sm:w-auto" @click="handleRemove">删除</button>

                <button type="button" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto" @click="formType = 'edit'">取消</button>
              </div>
            </div>
          </TransitionChild>
        </div>

      </div>
    </div>
  </TransitionRoot>
</template>

<script setup>
  import {
    TransitionRoot,
    TransitionChild,
  } from '@headlessui/vue'
  import { ExclamationTriangleIcon } from '@heroicons/vue/24/solid'
  const { data: userInfo } = useNuxtData('userInfo');
  const { $toast } = useNuxtApp();
  const { boardTerms } = useAppConfig();
  const secondTerms = ref([]);
  const defaultData = ref({});
  const formData = ref({});
  const formType = ref('edit');

  const props = defineProps({
    value: Object
  })

  const title = computed(() => {
    if(!props.value) return '-';
    return props.value.action === 'updateRecord' ? '编辑画板' : '创建画板';
  })

  function closeModal() {
    formData.value = {};
    defaultData.value = {};
    document.body.style.overflow = 'inherit'
  }

  function openModal() {
    document.body.style.overflow = 'hidden'
  }

  // 一级分类改变
  function handleFirstChange (firstId) {
    if(firstId) {
      boardTerms.map(item => {
        if(item.value === firstId) {
          secondTerms.value = item.child || []
          if(!item.child && formData.value.secondId) {
            formData.value.secondId = ''
          }
        }
      })
    }
  }

  watch(() => props.value, (val) => {
    if(val) {
      val.firstId && handleFirstChange(val.firstId);
      defaultData.value = val;
      openModal()
    } else {
      closeModal()
    }
  })

  let loading = ref(false);
  async function handleSubmit () {
    const {action, boardId, callback} = defaultData.value;
    const payload = formData.value;

    if(action === 'addRecord') { // 创建
      if(!payload.title || payload.title.length < 2) {
        return $toast.error('标题不能小于2个字');
      }
      // if(!payload.cover) {
      //   return $toast.error('请上传封面');
      // }
    } else { //编辑
      if(payload.title && payload.title.length < 2) {
        return $toast.error('标题不能小于2个字');
      }
      const len = Object.keys(payload).length;
      if(len < 1) {
        return $toast.error('未修改内容');
      }
      payload.boardId = boardId;
    }

    payload.action = action;

    if(loading.value) return;
    loading.value = true;
    let url = payload.action === 'addRecord' ? '/api/boards/new' : '/api/boards/update';
    const result = await $fetch(url, {
      method: "POST",
      body: {
        ...payload,
      }
    });
    loading.value = false;

    const {
      status,
      data
    } = result;

    if(status.code === 0) {
      closeModal()
      $toast.success(payload.action === 'addRecord' ? '创建成功' : '更新成功');
      if(data.boardCount) {
        userInfo.value.boardCount = data.boardCount;
      }
      callback && callback(payload.action === 'addRecord' ? 'add' : 'update', data);
    } else {
      $toast.error(status.message)
    }
  }

  // 删除
  async function handleRemove () {
    if(loading.value) return;
    loading.value = true;
    const {boardId, callback} = defaultData.value;
    const result = await $fetch('/api/boards/remove', {
      method: "POST",
      body: {
        boardId
      }
    });
    loading.value = false;

    const {
      status,
      data
    } = result;

    if(status.code === 0) {
      $toast.success('删除成功');
      userInfo.value.boardCount = data.boardCount;
      closeModal();

      callback && callback('remove', boardId);
    } else {
      $toast.error(status.message)
    }
  }

</script>