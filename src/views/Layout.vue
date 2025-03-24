<template>
<div>
  <div class="header" v-if="showHeader">  
    <div class="header-content" 
    :style="{width:proxy.globalInfo.bodyWidth+'px' }"
    >
    <router-link to="/" class="logo">
      <span v-for="(item, index) in logoInfo" :key="index" :style="{color:item.color}">{{ item.letter }}</span>
    </router-link>
    <!-- 板块信息 -->
    <div class="menu-panel"></div>
    <!-- 登陆注册用户信息· -->
    <div class="user-info-panel">
      <el-button type="info" class="op-btn">
        发帖<span class="iconfont icon-add"></span>
      </el-button>
      <el-button type="info" class="op-btn">
        搜索<span class="iconfont icon-search"></span>
      </el-button>
      <el-button-group :style="{'margin-left':'20px'}">
        <el-button type="info" plain>登录</el-button>
        <el-button type="info" plain>注册</el-button>
      </el-button-group>

    </div>
    </div>
  </div>
  <div>
    <router-view />
  </div>
</div>
</template>

<script setup>
import { ref,reactive,getCurrentInstance, onMounted } from 'vue'
import { useRouter,useRoute } from 'vue-router';
const{proxy}=getCurrentInstance();
const router=useRouter();
const route=useRoute();

const logoInfo=ref([

  {
    "letter": "6",
    "color": "#BA68C8"
  },
  {
    "letter": "0",
    "color": "#AB47BC"
  },
  {
    "letter": "7",
    "color": "#8E24AA"
  },
  {
    "letter": "の",
    "color": "#7B1FA2"
  },
  {
    "letter": "b",
    "color": "#6A1B9A"
  },
  {
    "letter": "b",
    "color": "#8E24AA"
  },
  {
    "letter": "s",
    "color": "#BA68C8"
  }
]);


const showHeader=ref(true);

// 监听滚动事件 滚动条高度
const getScrollTop=()=>{
  let scrollTop=document.documentElement.scrollTop||window.pageYOffset||document.body.scrollTop;
  return scrollTop;
};

const initScroll=()=>{
  let initScrollTop=getScrollTop();
  let scrollType=0;
  window.addEventListener("scroll",()=>{
    let currentScrollTop=getScrollTop();
    if(currentScrollTop>initScrollTop){
      scrollType=1;
    }else{
      scrollType=0;
    }
    initScrollTop=currentScrollTop;
    if(scrollType==1&&currentScrollTop>100){
      showHeader.value=false;
    }else{
      showHeader.value=true;
    }
  })
}

onMounted(()=>{
  initScroll();
});

</script>

<style lang="scss" >
.header{
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  background-color: #fff;
  .header-content{
      width: 100%;
      max-width: 1200px;
      margin: 0px auto;
      align-items: center;
      height: 60px;
      display: flex;
      align-items:center ;
    .logo{
      display: block;
      text-decoration: none;
      margin-right:5px ;
      span{
        font-size: 35px;
      }
    }
    .menu-panel{
      flex:1;
    }
    .user-info-panel{
      width: 300px;
      display: flex;
      .op-btn{
        .iconfont{
          margin-left: 5px;
        }
      }
    }
  }
}
</style>
