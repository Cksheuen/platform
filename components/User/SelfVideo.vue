<script setup lang="ts">
import type { Video } from '~/types/video'

const { userId } = defineProps({
  userId: String,
})
const params = new URLSearchParams({
  id: userId,
  cursor: 0,
  pageSize: 6,
  order: 'hot',
})
const videos = ref<Video[]>([])

await fetch(`http://172.20.10.13:8888/user/video/${userId}?${params}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('accessToken'),
  },
})
  .then(res => res.json())
  .then((res) => {
    console.log(res)
    videos.value = res.data.videos
  })
</script>

<template>
  <div class="courses" flex flex-wrap>
    <div
      v-for="(item, index) in videos" :key="index" class="course"
      :class="index % 2 === 0 ? 'mr-10' : ''"

      relative
      mb-10 h-20 w-90 cursor-pointer border-1 border-gray-3 border-solid @click="useRouter().push(`/video/${item.id}`)"
    >
      <img float-left :src="item.cover_url" :alt="item.title" h-20>
      <span top-0 z-30 float-left ml-5 h-10 w-20 text="blue-6">
        <span>
          {{ item.title }}
        </span>
      </span>
      <span absolute bottom-0 left-0 scale-80>
        <span i-carbon-play-outline mr-1 inline-block h-4 w-4 />
        <span mr-2>{{ item?.playCount }}</span>
        <span i-carbon-align-box-bottom-right mr-1 inline-block h-4 w-4 />
        <span mr-5>{{ item?.comment_count }}
        </span>
      </span>
    </div>
  </div>
</template>
