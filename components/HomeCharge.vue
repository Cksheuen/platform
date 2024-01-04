<script setup lang="ts">
interface Data {
  name: string
  icon: string
  num: number
}
const data: Data[] = [
  {
    name: '净增粉丝',
    icon: 'i-carbon-user-avatar',
    num: 100,
  },
  {
    name: '播放量',
    icon: 'i-carbon-play-outline',
    num: 100,
  },
  {
    name: '评论',
    icon: 'i-carbon-chat',
    num: 100,
  },
  {
    name: '弹幕',
    icon: 'i-carbon-chat',
    num: 100,
  },
  {
    name: '点赞',
    icon: 'i-carbon-thumbs-up',
    num: 100,
  },
  {
    name: '分享',
    icon: 'i-carbon-share',
    num: 100,
  },
  {
    name: '收藏',
    icon: 'i-carbon-star',
    num: 100,
  },
  {
    name: '投币',
    icon: 'i-carbon-ibm-cloud-pak-netezza',
    num: 100,
  },
]
</script>

<template>
  <div class="title" text="blue-5 left" font-size-4 font-bold>
    视频数据
  </div>
  <div v-for="(item, index) in data" :key="index" inline-block>
    <div text="left" m-3 h-20 w-44 cursor-pointer rd-2 bg-blue-1 p-3>
      <div flex items-center text="gray-5">
        <span :class="item.icon" inline-block h-4 w-4 />
        {{ item.name }}
      </div>
      <div text="blue-4" mt-1 font-size-5 font-bold>
        {{ item.num }}
      </div>
    </div>
  </div>
</template>
