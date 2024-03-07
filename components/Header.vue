<template>
  <header class="w-full bg-white" v-if="userInfo">
    <div class="w-full h-28 flex items-center">
      <div class="w-[1200px] mx-auto h-full flex items-center justify-between">
        <div class="flex-1 flex">
          <NuxtLink to="/">
            <img src="/logo.png" class="h-14" />
          </NuxtLink>
        </div>
        <div class="flex items-center mr-4">
          <div class="h-9 relative" @click="jumpTosearch" @keydown.enter="jumpTosearch">
            <MagnifyingGlassIcon class="text-gray-400 w-5 h-5 absolute right-3 top-2 z-[2]" />
            <a-input type="text"
              class="h-full w-full border px-4 py-4 rounded-full text-sm text-gray-900 focus-visible:outline-0 focus-visible:border-red-100 relative bg-white z-[1]"
              :maxlength="30" v-model:value="keywordIpt" />
          </div>
        </div>
        <Dropdown class="!h-11 flex items-center" align="right">
          <template #default="props">
            <div class="flex items-center cursor-pointer">
              <div class="w-9 h-9 overflow-hidden rounded-full">
                <img :src="userInfo.avatar ? userInfo.avatar : '/avatar.png'" class="w-full h-full" />
              </div>
              <div class="text-base ml-2 text-gray-500 font-medium">
                {{ userInfo.username }}
              </div>
            </div>
          </template>

          <template #items>
            <div
              class="text-gray-700 text-sm cursor-pointer rounded hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center h-9"
              @click="togglePwdModal">
              <div class="ml-1">修改密码</div>
            </div>
            <div
              class="text-gray-700 text-sm cursor-pointer rounded hover:text-gray-900 hover:bg-gray-100 flex items-center justify-center h-9"
              @click="handleLogout">
              <div class="ml-1">退出登录</div>
            </div>
          </template>
        </Dropdown>
      </div>
    </div>
    <div class="w-full h-16 bg-[#bc2020]">
      <div class="w-[1200px] mx-auto h-full flex flex-row items-center">
        <template v-for="(item, index) in navs" :key="index">
          <template v-if="item.path !== '/admin/'">
            <NuxtLink :to="item.path" target="_blank"
              class="flex-1 h-full text-lg text-white w-32 text-center cursor-pointer flex items-center justify-center hover:font-medium"
              :class="{
                'bg-[#910e0e] font-medium': item.match.includes(currentPath)
              }">
              {{ item.label }}
            </NuxtLink>
          </template>
          <template v-else>
            <NuxtLink :to="item.path" target="_blank"
              class="flex-1 h-full text-lg text-white w-32 text-center cursor-pointer flex items-center justify-center hover:font-medium"
              v-if="userInfo.is_admin === 1">
              {{ item.label }}
            </NuxtLink>
          </template>
        </template>
      </div>
    </div>
    <a-modal :closable="!isDefaultPwd" :maskClosable="!isDefaultPwd" v-model:open="showPwdModal"
      :title="isDefaultPwd ? '首次登录请修改密码' : '修改密码'" :footer="null">
      <a-form autocomplete="off" name="form-changepwd" ref="pwdFormRef" :model="pwdState" :label-col="{ span: 5 }"
        :wrapper-col="{ span: 20 }" :rules="pwdRules" @finish="handleFinishPwd">
        <a-form-item has-feedback label="旧密码" name="oldpassword">
          <a-input size="large" v-model:value="pwdState.oldpassword" type="password" autocomplete="off" :maxlength="50" />
        </a-form-item>
        <a-form-item has-feedback label="新密码" name="password">
          <a-input size="large" v-model:value="pwdState.password" type="password" autocomplete="off" :maxlength="50" />
        </a-form-item>
        <a-form-item has-feedback label="确认新密码" name="confirmPassword">
          <a-input size="large" v-model:value="pwdState.confirmPassword" type="password" autocomplete="off"
            :maxlength="50" />
        </a-form-item>
        <div class="text-center">
          <a-button size="large" type="primary" html-type="submit">提交</a-button>
          <a-button v-if="!isDefaultPwd" size="large" class="ml-10" @click="handleResetPwd">重置</a-button>
        </div>
      </a-form>
    </a-modal>
  </header>
</template>
<script setup>
import { MagnifyingGlassIcon } from "@heroicons/vue/24/solid";
import { useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const { $toast } = useNuxtApp();
const { data: userInfo } = useNuxtData("userInfo");
const headers = useRequestHeaders(["cookie"]);
const isDefaultPwd = userInfo.value?.isDefaultPwd || false;
const showPwdModal = ref(false);
const pwdFormRef = ref();
const keywordIpt = ref();
const pwdState = reactive({
  password: '',
  confirmPassword: ''
});
const navs = [
  {
    label: "首页",
    path: "/",
    match: ['/'],
  },
  {
    label: "学习中心",
    path: "/courses",
    match: ["/courses", "/course", '/learn/course'],
  },
  {
    label: "培训中心",
    path: "/classes",
    match: ["/classes", "/class", '/teachers', '/addresses', '/learn/class', '/address'],
  },
  {
    label: "考试中心",
    path: "/exams",
    match: ["/exams", "/exam", '/grade'],
  },
  {
    label: "资讯中心",
    path: "/news",
    match: ["/news", "/new"],
  },
  {
    label: "个人中心",
    path: "/ucenter",
    match: ["/ucenter", "/mycourse"],
  },
  {
    label: "管理后台",
    path: "/admin/",
    target: "_blank",
  },
];

onMounted(() => {
  if (isDefaultPwd) {
    showPwdModal.value = true;
  }
})

const currentPath = computed(() => {
  const arr = route.path.split('/')
  const pathString = arr[1] ? '/' + arr[1] : "/";
  return pathString == '/learn' ? `${pathString}/${arr[2]}` : pathString;
  ;
});

watch(() => router.currentRoute.value, newValue => {
  if (newValue.name !== 'news-search-keyword') {
    keywordIpt.value = '';
  }
}, { immediate: true })

//退出登录
async function handleLogout() {
  const { status, data } = await $fetch("/api/user/logout");
  if (status.code === 0) {
    clearNuxtData("userInfo");
    localStorage.removeItem('resources')
    $toast.success("退出成功");
    navigateTo("/auth/login");
  } else {
    $toast.error("退出失败");
  }
}

function togglePwdModal() {
  showPwdModal.value = !showPwdModal.value;
}

const validatePass = async (_rule, value) => {
  if (value === '') {
    return Promise.reject('请输入密码');
  } else {
    // 定义密码要求的正则表达式
    var regex = /^(?![a-zA-z]+$)(?!\d+$)(?![!@#$%^&*]+$)(?![a-zA-z\d]+$)(?![a-zA-z!@#$%^&*]+$)(?![\d!@#$%^&*]+$)[a-zA-Z\d!@#$%^&*]+$/;
    if (!regex.test(value)) {
      return Promise.reject("密码要包含数字、字母和特殊符号。");
    }
    if (pwdState.confirmPassword !== '') {
      pwdFormRef.value.validateFields('confirmPassword');
    }
    return Promise.resolve();
  }
};
const validatePass2 = async (_rule, value) => {
  if (value === '') {
    return Promise.reject("请输入确认新密码");
  } else if (value !== pwdState.password) {
    return Promise.reject("两次输入的密码不一致!");
  } else {
    return Promise.resolve();
  }
};
const pwdRules = {
  oldpassword: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      validator: validatePass,
      trigger: 'change',
    },
  ],
  confirmPassword: [
    {
      validator: validatePass2,
      trigger: 'change',
    },
  ]
};

// 修改密码
async function handleFinishPwd() {
  pwdFormRef.value.validate().then(async () => {
    const { password, oldpassword } = toRaw(pwdState);
    const result = await $fetch('/api/user/pwd', {
      method: 'POST',
      headers,
      body: { password, oldpassword }
    });
    const { status } = result;
    if (status.code === 0) {
      $toast.success('更新成功')
      if (isDefaultPwd) {
        await refreshNuxtData('userInfo')
      }
      togglePwdModal();
    } else {
      $toast.error(status.message)
    }
  }).catch(error => {
    console.log('error', error);
  });
}

function handleResetPwd() {
  pwdFormRef.value.resetFields();
}

function jumpTosearch() {
  const kwd = keywordIpt.value;
  if (!kwd) {
    return false;
  }
  navigateTo(`/news/search/${kwd}`)
}
</script>
