<template>
  <div class="bg-cover bg-center" style="background-color: aqua;">
  <!-- style="background-image: url(/login.jpg);background-position: bottom center;background-repeat: no-repeat;background-size: 100%;"> -->
    <div class="h-screen flex items-center justify-center" v-if="isShow">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>
    
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
    
        <a-form-item name="remember" :wrapper-col="{ offset: 6, span: 16}">
          <a-checkbox v-model:checked="formState.remember">记住密码</a-checkbox>
        </a-form-item>
    
        <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
          <a-button type="primary" html-type="submit" >登录</a-button>
          <a-button type="primary" html-type="submit" @click="toRegister">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
    <div class="h-screen flex items-center justify-center" v-else="isShow">
      <a-form
        :model="formState"
        name="basic"
        :label-col="{ span: 8 }"
        :wrapper-col="{ span: 16 }"
        autocomplete="off"
        @finish="onFinish"
        @finishFailed="onFinishFailed"
      >
        <a-form-item
          label="用户名"
          name="username"
          :rules="[{ required: true, message: '请输入用户名!' }]"
        >
          <a-input v-model:value="formState.username" />
        </a-form-item>
    
        <a-form-item
          label="密码"
          name="password"
          :rules="[{ required: true, message: '请输入密码!' }]"
        >
          <a-input-password v-model:value="formState.password" />
        </a-form-item>
        
        <a-form-item :wrapper-col="{ offset: 10, span: 16 }">
          <a-button type="primary" html-type="submit" @click="toLogin">去登录</a-button>
          <a-button type="primary" html-type="submit" @click="toRegister">注册</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
  </template>
  <script lang="ts" setup>
  import { reactive,ref } from 'vue';
  
  interface FormState {
    username: string;
    password: string;
    remember: boolean;
  }
  
  const formState = reactive<FormState>({
    username: '',
    password: '',
    remember: true,
  });

  //校验用户登录！
  const { data } = await useFetch('/api/myapi/user')
   import { toRaw } from 'vue';
  //const route = useRoute()
  

  const username = toRaw(data.value[0].username)
  const password = toRaw(data.value[0].password)
  const onFinish = (values: any) => {
    if (formState.username !== username) {
      message.error('用户名错误');
      return 
    }else if (formState.password !== password) {
      message.error('密码错误');
      return
    }
    message.success('登录成功！')
    return navigateTo('/home')
  };
  
  const onFinishFailed = (errorInfo: any) => {
    console.log('Failed:', errorInfo);
  };
  const isShow = ref(true);
  const toRegister = () => {
    isShow.value = false;
    formState.remember = false
    formState.username = ''
    formState.password = ''
  }
  const toLogin = () => {
    isShow.value = true;
  }
  
  </script>