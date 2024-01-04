<script setup lang="ts">
interface Video {
  id: number
  title: string
  authorId: number
  cover_url: string
  comment_count: number
  isFollow: boolean
  playCount: number
  createAt: Date
  duration: number
}

interface VideoInfo {
  video: Video
  playUrl: string
  introduce: string
  favorite_count: number
  share_count: number
  collectedCount: number
  is_favorite: boolean
  is_collected: boolean
  type: string
}

const videos = ref<VideoInfo[]>([])

const today = new Date()
const id = localStorage.getItem('id')

function GetMonth(month: number) {
  const monthNames = [
    '一月大',
    '二月平',
    '三月大',
    '四月小',
    '五月大',
    '六月小',
    '七月大',
    '八月大',
    '九月小',
    '十月大',
    '十一月小',
    '十二月大',
  ]
  return monthNames[month]
}

async function getVideoData() {
  await fetch('172.20.10.13/video', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('accessToken'),
    },
    body: JSON.stringify({
      cursor: 0,
      pageSize: 6,
      keyword: '',
      type: 0,
    }),
  })
    .then(res => res.json())
    .then((res) => {
      videos.value = res.data.value as VideoInfo[]
    })
}

async function getAuthorName(authorId: number) {
  const { data, pending, error, refresh } = await useFetch('172.20.10.13/user', {
    body: {
      id: authorId,
    },
  })
  return data.value.name
}

onMounted(async () => {
  await getVideoData()
})
</script>

<template>
  <div mx-auto>
    <div class="studyChart" inline-block>
      <Chart />
    </div>
    <div class="calendar" relative mt-10 mt-20 inline-block h-40 w-64 bg-gray-1 align-top text-green-9>
      <div class="month" text="left" absolute left-9 top-7 write-vertical-right>
        {{ GetMonth(today.getMonth()) }}
      </div>
      <div class="date" font-size-18 font-extrabold>
        {{ today.getDate() }}
      </div>
      <div class="day" absolute right-9 top-7 write-vertical-left>
        {{ today.toLocaleDateString('zh-CN', { weekday: 'long' }) }}
      </div>
      <div text="gray-9" font-size-3>
        <div class="studyTime">
          今年已内卷{{ 1 }} h
        </div>
        <div class="over">
          已超越{{ 1 }}
        </div>
      </div>
    </div>
    <div />

    <span v-for="(item, index) in videos" :key="index" class="course" inline-block h-45 w-70>
      <NuxtLink :to="`/video/${item.video.id}`">
        <img :src="item.playUrl" :alt="item.video.title">
        <div class="title" mx-3 mt-2 text="gray-9 left">{{ item.video.title }}</div>
        <div class="teatherAndDate" text="gray-3 sm left" mx-3>
          <div class="teacher" inline-block>{{ getAuthorName(item.video.authorId) }} · {{ item.video.createAt }}</div>
        </div>
      </NuxtLink>
    </span>
  </div>
</template>
