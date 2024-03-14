<template>
    <a-layout class="layout">
      <a-layout-header>
        <div class="logo" />
        <a-menu
          v-model:selectedKeys="selectedKeys"
          theme="dark"
          mode="horizontal"
          @click="toContent"
          :style="{ lineHeight: '64px' }"
        >
          <a-menu-item key="1" >首页</a-menu-item>
          <a-menu-item key="2" >电影</a-menu-item>
          <a-menu-item key="3" >电视剧</a-menu-item>
        </a-menu>
        <a-tooltip title="wenqiang" placement="bottom">
          <a-avatar style="background-color: #87d068; right: 5.5%; top:3%; position: absolute;" @click="logout">
            <template #icon>
              <UserOutlined />
            </template>
          </a-avatar>
        </a-tooltip>
        <!-- <span style="color:aliceblue; right: 2%; top:0.5%; position: absolute;" @click="logout"></span> -->
      </a-layout-header>
      
      <a-layout-content style="padding: 0 0px">
        <div>
          <a-carousel autoplay>
            <div><img src="/1.jpg" object-fit></img></div>
            <div><img src="/2.jpg"></img></div>
            <div><img src="/3.jpg"></img></div>
            <div><img src="/4.jpg"></img></div>
          </a-carousel>
      </div>
        <div :style="{ background: '#fff', padding: '24px', minHeight: '280px' }">
          <!-- <NuxtLayout>
            <Content/> -->
            <NuxtPage /> 
          <!-- </NuxtLayout> -->
          <!-- {{selectedKeys}} -->
        </div>
      </a-layout-content>
      <a-layout-footer style="text-align: center">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </template>
  <script lang="ts" setup>
  import  Content  from './content/[id].vue';
  import { ref } from 'vue';
  import { UserOutlined } from '@ant-design/icons-vue';
  const route = useRoute()
  const selectedKeys = ref<string[]>(['1']);
  // const selectedKey = ref(selectedKeys.value)
  
  // const username = ref('wenqiang');
  const logout = () => {
    navigateTo('/login')
  }


  const  toContent = () => {
   // const path = route.params.id 
  //   //this.$router.push({ path: '/your-route-path/' + dynamicId });
  //   // const selectedKey = ref(selectedKeys.value)
  //   // console.log(selectedKeys.value)
    navigateTo(`/home/content/${selectedKeys.value}`)
   // navigateTo("/content/" + item.key);
  //   //  message.info(selectedKeys.value)
    // const Content = $fetch('/home/content/'+ selectedKeys.value);

    
    console.log(Content)
   }
function mounted() {
  toContent()
}
   mounted()

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
  