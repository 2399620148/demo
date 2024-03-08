<template>
    <a-layout class="layout">
      <a-layout-header>
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1">首页</a-menu-item>
          <a-menu-item key="2">电影</a-menu-item>
          <a-menu-item key="3">电视剧</a-menu-item>
        </a-menu>
        <!-- <a-tooltip title="wenqiang" placement="bottom">
          <a-avatar style="background-color: #87d068; right: 5.5%; top:2%; position: absolute;">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </a-tooltip>
        <span style="color:aliceblue; right: 2%; top:0.5%; position: absolute;" @click="logout">退出登录</span> -->
      </a-layout-header>
      <a-layout-content style="padding: 0 0px">
        <template>
          <a-carousel autoplay>
            <div><img src="https://img.dianyi.ng/view/photo/s_ratio_poster/public/p2904040720.jpg" object-fit></img></div>
            <div><img src="/1.jpg"></img></div>
            <div><img src="/login.jpg"></img></div>
            <div><img src="/login.jpg"></img></div>
          </a-carousel>
        </template>
        <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">Content</div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </template>
  <script lang="ts" setup>
  import { ref } from 'vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  const selectedKeys = ref<string[]>(['1']);
  const username = ref('wenqiang');
  const logout = () => {
    navigateTo('/login')
  }
  </script>
  <style scoped>
  .site-layout-content {
    min-height: 280px;
    padding: 24px;
    background: #fff;
  }
  #components-layout-demo-top .logo {
    float: left;
    width: 120px;
    height: 31px;
    margin: 16px 24px 16px 0;
    background: rgba(255, 255, 255, 0.3);
  }
  .ant-row-rtl #components-layout-demo-top .logo {
    float: right;
    margin: 16px 0 16px 24px;
  }
  
  [data-theme='dark'] .site-layout-content {
    background: #141414;
  }

  /* For demo */
:deep(.slick-slide) {
  text-align: center;
  height: 160px;
  line-height: 160px;
  background: #364d79;
  overflow: hidden;
}
:deep(.slick-slide h3) {
  color: #fff;
}
  </style>
  