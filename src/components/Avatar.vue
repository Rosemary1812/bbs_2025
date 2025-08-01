<template>
  <div
    class="avatar"
    :style="{
      width: width + 'px',
      height: width + 'px',
      'border-radius': width / 2 + 'px',
    }"
  >
    <el-image
      v-if="userId"
      :style="{
        width: width + 'px',
        height: width + 'px',
        'border-radius': width / 2 + 'px',
      }"
      :src="proxy.globalInfo.avatarURL + userId"
      fit="scale-down"
      loading="lazy"
      @click="goToUcenter"
      @error="handleImageError"
    >
      <template #error>
        <div class="image-error">
          <span class="iconfont icon-user"></span>
        </div>
      </template>
    </el-image>
    <div v-else class="no-login">未登录</div>
  </div>
</template>

<script setup>
import { getCurrentInstance } from "vue";
import { useRouter } from "vue-router";
const { proxy } = getCurrentInstance();
const router = useRouter();

const props = defineProps({
  userId: {
    type: String,
  },
  width: {
    type: Number,
    default: 60,
  },
  addLink: {
    type: Boolean,
    default: true,
  },
});

const goToUcenter = () => {
  if (props.addLink) {
    router.push("/user/" + proxy.userId);
  }
};

const handleImageError = (e) => {
  console.warn('头像加载失败:', e.target.src);
};
</script>

<style lang="scss">
.avatar {
  display: flex;
  cursor: pointer;
  background: #f0f0f0;
  align-items: center;
  overflow: hidden;
  .no-login {
    width: 100%;
    text-align: center;
    font-size: 13px;
  }
  .image-error {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #e0e0e0;
    color: #999;
    font-size: 24px;
  }
}
</style>