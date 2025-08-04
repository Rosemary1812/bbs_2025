<template>
    <div
    class="container-body article-list-body"
    :style="{width:proxy.globalInfo.bodyWidth+ 'px'}"
    >
    </div>
    <!-- 二级板块 -->
    <div class="sub-board" v-if="pBoardId">
      <span :class="['board-item', boardId == 0 ? 'active' : '']">
        <router-link :to="`/forum/${pBoardId}`">全部</router-link></span
      >
      <span
        v-for="item in subBoardList"
        :key="item.boardId"
        :class="['board-item', item.boardId == boardId ? 'active' : '']"
      >
        <router-link :to="`/forum/${item.pBoardId}/${item.boardId}`">{{
          item.boardName
        }}</router-link>
      </span>
    </div>
    <div class="article-panel">
        <div class="top-tab">
            <div :class="['tab',orderType==0?'active':'']" @click="changeOrderType(0)">热榜</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType==1?'active':'']" @click="changeOrderType(1)">发布时间</div>
            <el-divider direction="vertical"></el-divider>
            <div :class="['tab',orderType==2?'active':'']" @click="changeOrderType(2)">最新</div>

        </div>
        <div class="article-list">
            <DataList 
            :loading="loading"
            :dataSource="articleListInfo"
             @loadData="loadArticle"
            NoDataMsg="暂无文章">
                <template #default="{ data }">
                    <ArticleListItem :data="data" :showComment="showComment" ></ArticleListItem>
                </template>
            </DataList>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, getCurrentInstance, watch } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useStore } from "vuex"
import ArticleListItem from "./ArticleListItem.vue";  // 只保留一个导入
import DataList from "@/components/DataList.vue";
const { proxy } = getCurrentInstance();
const router = useRouter();
const route = useRoute();
const store=useStore();
const api={
    loadArticle: "/forum/loadArticle",
};

const changeOrderType=(type)=>{
    orderType.value = type;
    loadArticle();
}


//文章列表
//一级板块
const pBoardId=ref(0);
//二级板块
const boardId=ref(0);
const orderType = ref(0); // 0: 热榜, 1: 发布时间, 2: 最新
const loading = ref(false);
const articleListInfo = ref({});
const loadArticle=async ()=>{
    loading.value = true;
    let params={
        pageNo:articleListInfo.value.pageNo || 1,
        orderType:orderType.value,
        boardId: boardId.value,
        orderType: orderType.value,
    };
    
    let result=await proxy.Request({
        url:api.loadArticle,
        params:params,
        showloading:false,
    });
    
    loading.value = false;
    if(!result){
        return;
    }
    articleListInfo.value=result.data;
};
loadArticle();

//二级板块
const subBoardList=ref([]); 
const setSubBoardList=()=>{
    subBoardList.value=store.getters.getSubBoardList(pBoardId.value);
}

//监听路由变化
watch(
    ()=>route.params,
    (newVal,oldVal)=>{
        pBoardId.value=newVal.pBoardId||0;
        boardId.value=newVal.boardId||0;
        setSubBoardList();
        loadArticle();
        store.commit("setActivePboardId",newVal.pBoardId);
        store.commit("setActiveBoardId",newVal.boardId);

    },
    {immediate:true,deep:true}
)
//监听板块变化
watch(
  () => store.state.boardList,
  (newVal, oldVal) => {
    setSubBoardList();
  },
  { immediate: true, deep: true }
);
const showComment=ref(false); 
watch(
  ()=>store.state.sysSetting,
  (newVal,oldVal)=>{
    console.log('系统设置变化:', newVal);
    if(newVal && newVal.commentOpen !== undefined){
      showComment.value=newVal.commentOpen;
      console.log('评论开关设置为:', newVal.commentOpen);
    } else {
      console.log('系统设置中没有commentOpen字段，使用默认值true');
      showComment.value = true;
    }
  },
  {immediate:true,deep:true}
);
</script>


<style lang="scss">

.article-panel {
      width: 100%;  // 改为100%宽度
  max-width: 1200px;  // 最大宽度1200px
  margin: 0 auto;  // 居中显示
    background-color: #fff;
    border-radius: 4px;
    margin-top: 10px;


    .top-tab {
        display: flex;
        align-items: flex-end;  // 改为flex-end让内容靠下对齐
        padding: 5px 15px 4px;
        font-size: 15px;
        cursor: pointer;
        border-bottom: 1px solid #ddd;
        // height: 70px; /* 添加固定高度 */
        // margin-top: 20px; // 新增：下移top-tab，避免遮挡sub-board list
    .tab{
        cursor: pointer;
    }
    .active {
        color: var(--link);
      }

        
    }   

}
.article-list-body {
  padding-bottom: 5px;
}

.sub-board {
  padding: 0px 0px 0px 250px;
  .board-item {
    background-color: #fff;
    border-radius: 15px;
    padding: 2px 10px;
    margin-right: 10px;
    color: #909090;
    cursor: pointer;
    font-size: 14px;
    border: 1px solid #ddd;
  }
  a {
    text-decoration: none;
    color: #909090;
  }
  .active {
    background: var(--link);
    a{
        color:#fff;
    }
  }
}

    
</style>
