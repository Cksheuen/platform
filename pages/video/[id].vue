<script setup lang="ts">
import { useRoute } from 'vue-router'
import type { Action, VideoData } from '~/types/video'

const id = useRoute().params.id
const videoData = ref<VideoData>()

await fetch(`http://172.20.10.13:8888/video/${id}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('accessToken'),
  },
})
  .then(res => res.json())
  .then((res) => {
    videoData.value = { ...res.data }
  })

const route = useRoute()

interface Comment {
  time: string
  content: string
  sendTime: string
}

const data: Comment[] = [
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
]

const actions = [
  {
    name: '点赞',
    icon: videoData.value?.is_favorite
      ? 'i-carbon-thumbs-up-filled'
      : 'i-carbon-thumbs-up',
    num: videoData.value?.favorite_count,
  },
  {
    name: '投币',
    icon: 'i-carbon-ibm-cloud-pak-netezza',
    num: 0,
  },
  {
    name: '收藏',
    icon: 'i-carbon-star',
    num: videoData.value?.collectedCount,
  },
  {
    name: '转发',
    icon: 'i-carbon-share',
    num: videoData.value?.share_count,
  },
]
</script>

<template>
  <div p-10 align-top>
    <div class="right" inline-block w-200 p-10>
      <div class="title" text="left" font-size-6>
        {{ videoData?.title }}
      </div>
      <div
        class="inf" text="gray-4 left"
        mb-5 mt-1 h-4 flex items-center font-size-3.5
      >
        <span i-carbon-play-outline mr-1 inline-block h-4 w-4 />
        <span mr-2>{{ videoData?.playCount }}</span>
        <span i-carbon-align-box-bottom-right mr-1 inline-block h-4 w-4 />
        <span mr-5>{{ videoData?.comment_count }}</span>
        <span>{{ new Date(videoData?.createAt!)
          .toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit' })
        }}</span>
      </div>
      <video
        class="vid" :src="videoData?.playUrl"
        controls inline-block w-200 align-top
      />
      <div class="action" mb-2 mt-5 flex items-center text="gray-7">
        <div
          v-for="(item, index) in actions" :key="index"
          mr-5 flex cursor-pointer items-center text="hover:blue-4"
          style="transition-duration: .2s;"
        >
          <span :class="item.icon" inline-block h-7 w-7 />
          <span ml-2>{{ item.num }}</span>
        </div>
      </div>
      <hr>
      <div class="description" text="left">
        <div my-3>
          {{ videoData?.introduce }}
        </div>
        <div class="tag">
          <span h-3 rd-3 bg-gray-2 px-3 text="gray-5">tag</span>
        </div>
      </div>
      <Comment />
    </div>
    <div class="left" inline-block w-100 align-top>
      <User :author-id="videoData?.authorId" />
      <div class="comment" inline-block w-100 align-top>
        <div class="title" text="left gray-8 sm" mb-5 h-10 flex items-center rd-2 bg-gray-1 p-5>
          弹幕列表
        </div>
        <ul text="gray-5" h-90 overflow-scroll overflow-x-hidden font-size-3>
          <li relative inline-block w-100 p-1>
            <span float-left ml-4>时间</span>
            <span float-left ml-10>内容</span>
            <span float-right mr-8>发送时间</span>
          </li>
          <li v-for="(item, index) in data" :key="index" relative inline-block w-100 p-1>
            <span float-left ml-3>{{ item.time }}</span>
            <span float-left ml-5 text="gray-9">{{ item.content }}</span>
            <span float-right mr-5>{{ item.sendTime }}</span>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style>
text{
  color: gray;
}
</style>
