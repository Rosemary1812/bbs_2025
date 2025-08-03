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
        <div class="menu-panel">
          <router-link
            :class="[
              'menu-item home',
              activePboardId == undefined ? 'active' : '',
            ]"
            to="/"
            >首页</router-link
          >
          <template v-for="board in boardList" :key="board.boardId">
            <el-popover
              placement="bottom-start"
              :width="300"
              trigger="hover"
              v-if="board.children.length > 0"
            >
              <template #reference>
                <span
                  :class="[
                    'menu-item',
                    board.boardId == activePboardId ? 'active' : '',
                  ]"
                  @click="boardClickHandler(board)"
                  >{{ board.boardName }}</span
                >
              </template>
              <div class="sub-board-list">
                <span
                  :class="['sub-board',subBoard.boardId == activeBoardId ? 'active' : '',]"
                  v-for="subBoard in board.children"
                  :key="subBoard.boardId"
                  @click="subBoardClickHandler(subBoard)"
                  >{{ subBoard.boardName }}</span
                >
              </div>
            </el-popover>
            <span
              :class="[
                'menu-item',
                board.boardId == activePboardId ? 'active' : '',
              ]"
              v-else
              @click="boardClickHandler(board)"
              >{{ board.boardName }}</span
            >
          </template>
        </div>
    <!-- 登陆注册用户信息· -->
    <div class="user-info-panel">
      <el-button type="info" class="op-btn" size="default" @click="newPost">
        发帖<span class="iconfont icon-add"></span>
      </el-button>
      <el-button type="info" class="op-btn" size="default">
        搜索<span class="iconfont icon-search"></span>
      </el-button>
      
      <div v-if="userInfo.userId">
      <div class="message-info">
        <el-dropdown>
          <el-badge :value="messageCountInfo.total" class="item" :hidden="messageCountInfo.total==0||messageCountInfo.total==null">
            <div class="iconfont icon-message"></div>
          </el-badge>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToMessage('reply')"
               class="message-item"
               > 
                <span class="text">回复我的</span>
                <span class="count-tag" v-if="messageCountInfo.reply>0">{{messageCountInfo.reply>99
                ?'99+'
                :messageCountInfo.reply
                }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="goToMessage('likePost')"
               class="message-item"
               >
                <span class="text">赞了我的文章</span>
                <span class="count-tag" v-if="messageCountInfo.likePost>0">{{messageCountInfo.likePost>99
                ?'99+'
                :messageCountInfo.likePost
                }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="goToMessage('downloadAttachment')"
               class="message-item"
               >
                <span class="text">下载了我的附件</span>
                <span class="count-tag" v-if="messageCountInfo.downloadAttachment>0">{{messageCountInfo.downloadAttachment>99
                ?'99+'
                :messageCountInfo.downloadAttachment
                }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="goToMessage('likeComment')"
               class="message-item"
               >
                <span class="text">赞了我的评论</span>
                <span class="count-tag" v-if="messageCountInfo.likeComment>0" >{{messageCountInfo.likeComment>99
                ?'99+'
                :messageCountInfo.likeComment
                }}</span>
              </el-dropdown-item>
              <el-dropdown-item @click="goToMessage('sys')" 
              class="message-item"
              >
                <span class="text">系统消息</span>
                <span class="count-tag" v-if="messageCountInfo.sys>0">{{messageCountInfo.sys>99
                ?'99+'
                :messageCountInfo.sys
                }}</span>
              </el-dropdown-item>  
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      <div class="user-info">
        <el-dropdown>
          <avatar :userId="userInfo.userId" :width="50"></avatar>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item @click="goToUserCenter">我的主页</el-dropdown-item>
              <el-dropdown-item v-if="userInfo.admin" @click="goToAdmin">社区管理</el-dropdown-item>
              <el-dropdown-item @click="logout">退出</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </div>
      </div>

      <el-button-group :style="{'margin-left':'5px'}" v-else>
        <el-button type="primary" plain @click="loginAndRegister(1)">登录</el-button>
        <el-button type="primary" plain @click="loginAndRegister(0)">注册</el-button>
      </el-button-group>
      </div>
    </div>
  </div>

  <div class="body-content">
    <router-view />
  </div>
  <!-- 登录注册 -->
  <LoginAndRegister ref="loginAndRegisterRef" />
</div>
</template>

<script setup>
import LoginAndRegister from './LoginAndRegister.vue';
import { ref,reactive,getCurrentInstance, onMounted, watch } from 'vue'
import { useRouter,useRoute } from 'vue-router';
import {useStore} from "vuex";
import Avatar from '@/components/Avatar.vue';
import { it, tr } from 'element-plus/es/locale/index.mjs';
const{proxy}=getCurrentInstance();
const router=useRouter();
const route=useRoute();
const store=useStore();

const api={
  getUserInfo:"/getUserInfo",
  loadBoard:"/board/loadBoard",
  loadMessageCount:"/ucenter/loadMessageList",
};

const logoInfo=ref([

  {
    "letter": "6",
    "color": "#409EFF"
  },
  {
    "letter": "0",
    "color": "#5CB8FF"
  },
  {
    "letter": "7",
    "color": "#87CEFA"
  },
  {
    "letter": "の",
    "color": "#3A5F7F"

  },
  {
    "letter": "b",
    "color": "#87CEFA"

  },
  {
    "letter": "b",
    "color": "#5CB8FF"
  },
  {
    "letter": "s",
    "color": "#409EFF"

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
      //往下滚
      scrollType=1;
    }else{
      //往上滚
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

// 登录注册
const loginAndRegisterRef=ref();
const loginAndRegister=(type)=>{
loginAndRegisterRef.value.showPanel(type);
}

onMounted(()=>{
  initScroll();
  getUserInfo();
});

const getUserInfo=()=>{
  let result =proxy.Request({
    url:api.getUserInfo,
  });
  if(!result){
    return;
  }
  store.commit("updateLoginUserInfo",result.data);
};

//获取板块信息
const boardList=ref([]);
const loadBoard=async()=>{
let result=await proxy.Request({
  url:api.loadBoard,
});
if(!result){
  return;
}
boardList.value=result.data;
store.commit("saveBoardList", result.data);
};
loadBoard();

const userInfo=ref({});
watch(
  ()=>store.state.loginUserInfo,
  (newVal,oldVal)=>{
      if(newVal!=undefined&&newVal!=null){
        userInfo.value=newVal;
      }else{

      }
  },
  {immediate:true,deep:true}
);
//监听是否展示登录框
watch(
  ()=>store.state.showLogin,
  (newVal,oldVal)=>{
    if(newVal){
      loginAndRegister(1);
    }
  },
  {immediate:true,deep:true}
);

//板块点击
const boardClickHandler = (board) => {
  router.push(`/forum/${board.boardId}`);
};

//二级板块
const subBoardClickHandler = (subBoard) => {
  router.push(`/forum/${subBoard.pBoardId}/${subBoard.boardId}`);
};

//当前选中的板块
const activePboardId=ref(0);
watch(
  ()=>store.state.activePBoardId,
  (newVal,oldVal)=> {
    activePboardId.value = newVal || 0;
  },
  {immediate:true,deep:true}
);

//当前选中的二级板块
const activeBoardId=ref(0);
watch(
  ()=>store.state.activeBoardId,
  (newVal,oldVal)=> {
    activeBoardId.value = newVal || 0;
  },
  {immediate:true,deep:true}
);

//发帖
const newPost=()=>{
  if(!store.getters.getLoginUserInfo){
    loginAndRegister(1);
  }else{
    router.push("/newPost");
  }
}

const goToUserCenter=()=>{
  if(userInfo.value.userId){
    router.push(`/user/${userInfo.value.userId}/`);
  }
}

const goToAdmin=()=>{
  router.push("/admin");
}

const logout=()=>{
  store.commit("updateLoginUserInfo", null);
  router.push("/");
}
//消息
const goToMessage=(type)=>{
  router.push(`/user/message/${type}`);
};

const messageCountInfo=ref({});
  const loadMessageCount=async()=>{
    let result=await proxy.Request({
      url:api.loadMessageCount,
    });
    if(!result){
      return;
    }
    messageCountInfo.value=result.data;
  };
loadMessageCount();
</script>

<style lang="scss" >
.header{
  top:0px;
  width: 100%;
  position: fixed;
  box-shadow: 0 2px 6px 0 #ddd;
  z-index: 1000;
  background-color: #fff;
  .header-content{
      // width: 100%;
      max-width: 1200px;
      margin: 0px auto;
      align-items: center;
      height: 70px;
      display: flex;
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
      .menu-item{
        margin-left: 20px;
        cursor: pointer;
      }
      .home{
        text-decoration: none;
        color: #000;
      }
      .active{
        color: var(--link);
      }
    }
    .user-info-panel{
      width: 350px;
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 10px;
      
      .op-btn{
        display: flex;
        align-items: center;
        .iconfont{
          margin-left: 5px;
        }
 
      }
      
      .message-info{
        display: flex;
        align-items: center;
        margin-top: 8px;
        .icon-message{
          font-size: 25px;
          color: rgb(147, 147, 147);
        }

      }
      
      .user-info{
        display: flex;
        align-items: center;
        margin-top: -25px;
        margin-left: 30px;
      }
    }
  }
}

.sub-board-list{
  display: flex;
  flex-wrap: wrap;
  .sub-board{
    padding:0px 10px;
    border-radius: 20px;
    margin-right:10px;
    background:rgb(239,239,239);
    border:1px solid #ddd;
    color:rgb(119,118,118);
    margin-top:10px;
  }
  .sub-board:hover{
    color:var(--link);
    cursor: pointer;
  }
  .active{
    background:var(--link);
    color:#fff;
  }
  .active:hover{
    color: #fff;
  }
}
.body-content {
  margin-top: 70px;
  position: relative;
  min-height: calc(100vh - 210px);
}

.message-item{
display: flex;
justify-content: space-around;
  .text{
    flex:1;
  }
  .count-tag{
    height: 20px;
    line-height: 15px;
    min-width: 20px;
    display: inline-block;
    background: #f56c6c;
    border-radius: 10px;
    font-size: 13px;
    text-align: center;
    color: #fff;
    margin-left: 10px;
  }
}
</style>


