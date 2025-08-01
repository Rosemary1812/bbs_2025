<template>
  <div class="article-item">
    <div class="article-item-inner">
      <!-- 添加 flex 容器 -->
      <div class="content-wrapper">
        <div class="article-body">
          <div class="user-info">
            <Avatar :userId="data.userId" :width="30"></Avatar>
            <router-link :to="'/user/' + data.userId" class="link-info">{{ data.nickname }}</router-link>
            <el-divider direction="vertical"></el-divider>
            <div class="post-time">{{ data.postTime }}</div>
            <div class="address">&nbsp;·&nbsp;{{ data.userIpAddress }}</div>
            <el-divider direction="vertical"></el-divider>
          <router-link :to="`/forum/${data.pBoardId}`" class="link-info">{{
            data.pBoardName
          }}</router-link>
            <template v-if="data.boardName">
            <span>&nbsp;/&nbsp;</span>
            <router-link
              :to="`/forum/${data.pBoardId}/${data.boardId}`"
              class="link-info"
              >{{ data.boardName }}</router-link
            >
            </template>
          </div>
          <router-link :to="`/post/${data.articleId}`" class="title">
            <span v-if="data.topType==1" class="top">置顶</span>
            <span>{{ data.title }}</span>
          </router-link>
          <div class="summary">{{ data.summary }}</div>
          <div class="article-info">
            <span class="iconfont icon-eye-solid">{{ data.readCount==0?"阅读":data.readCount }}</span>
            <span class="iconfont icon-good">{{ data.goodCount==0?"点赞":data.goodCount }}</span>
            <span class="iconfont icon-comment">{{ data.commentCount==0?"评论":data.commentCount }}</span>

          </div>
        </div>
        <router-link :to="`/post/${data.articleId}`">
          <Cover :cover="data.cover" :width="100" v-if="data.cover"></Cover>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
const props=defineProps({
  data:{
    type:Object,
  },
});
</script>


<style lang="scss">
.article-item {
  padding: 5px 10px 0 10px;
  .article-item-inner {
    border-bottom: 1px solid #ddd;
    padding: 10px 0px;
    
    // 新增 flex 布局容器样式
    .content-wrapper {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      gap: 16px;
    }
    
    .article-body {
      flex: 1; // 文章内容占据剩余空间
      .user-info{
        display: flex;
        align-items: center;
        font-size: 14px;
        color: #4e5969;
        .link-info{
          margin-left: 5px;
          color: #494949;
          text-decoration: none;
        }
        .link-info:hover{
          color:var(--link)
        }
        .post-time{
          font-size: 13px;
          color: #9a9a9a9a;
        }
      }
      .title{
        font-size: 16px;
        text-decoration: none;
        color: #4a4a4a;
        font-weight: bold;
        margin: 10px 0px;
        display: inline-block;
        .top{
          font-weight: normal;
          font-size: 12px;
          border-radius: 5px;
          border: 1px solid var(--pink);
          color: var(--pink);
          padding: 0px 5px;
          margin-right: 10px;
        }
      }
      .summary{
       margin-top: 10px;
       font-size: 14px;
       color: #86909c; 
      }
      .article-info{
        margin-top:10px;
        display: flex;
        align-items: center;
        font-size: 13px;
        .iconfont{
          color:#86909c;
          margin-right: 25px;
          font-size: 14px;
        }
        .iconfont:before{
          padding-right: 3px;
        }
      }
    }
  }
}
.article-item:hover{
  background-color: #f5f5f5;
}
</style>