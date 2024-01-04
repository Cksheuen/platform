<script setup lang="ts">
interface DataType {
  play: number
  comment: number
  chat: number
  like: number
  share: number
  star: number
  coin: number
  url: string
  photo: string
  duration: string
  title: string
  date: string
  time: string
  [key: string]: number | string
}

const data: DataType[] = [
  {
    play: 100,
    comment: 100,
    chat: 100,
    like: 100,
    share: 100,
    star: 100,
    coin: 100,
    url: 'https://www.bilibili.com/video/BV1ZK4y1L7ZB',
    photo: 'https://i0.hdslb.com/bfs/archive/4b9b9b6b6b3b6b6b6b6b6b6b6b6b6b6b6b6b6b6b/0.jpg',
    duration: '00:00:00',
    title: '【独家】《鬼灭之刃》第二季 PV',
    date: '2020-03-22',
    time: '00:00:00',
  },
  {
    play: 100,
    comment: 100,
    chat: 100,
    like: 100,
    share: 100,
    star: 100,
    coin: 100,
    url: 'https://www.bilibili.com/video/BV1ZK4y1L7ZB',
    photo: 'https://i0.hdslb.com/bfs/archive/4b9b9b6b6b3b6b6b6b6b6b6b6b6b6b6b6b6b6b6b/0.jpg',
    duration: '00:00:00',
    title: '【独家】《鬼灭之刃》第二季 PV',
    date: '2020-03-22',
    time: '00:00:00',
  },
]

interface Icones {
  name: string
  icon: string
}
const icones: Icones[] = [
  {
    name: 'play',
    icon: 'i-carbon-play-outline',
  },
  {
    name: 'like',
    icon: 'i-carbon-thumbs-up',
  },
  {
    name: 'comment',
    icon: 'i-carbon-chat',
  },
  {
    name: 'chat',
    icon: 'i-carbon-closed-caption-alt',
  },
  {
    name: 'coin',
    icon: 'i-carbon-ibm-cloud-pak-netezza',
  },
  {
    name: 'star',
    icon: 'i-carbon-star',
  },
  {
    name: 'share',
    icon: 'i-carbon-share',
  },

]
</script>

<template>
  <div v-for="(item, index) in data" :key="index" my-7 h-40 flex items-center border-b py-3>
    <span relative inline-block h-30 w-50>
      <img :src="item.photo" alt="" h-30 w-50 rd-2 bg-gray-3>
      <span absolute bottom-0 right-0 mr-1>{{ item.duration }}</span>
    </span>
    <span text="left" ml-5>
      <div class="title" font-size-5>{{ item.title }}</div>
      <div class="dateAndTime" my-5>
        <span class="date">{{ item.date }}</span>
        <span class="time" ml-3>{{ item.time }}</span>
      </div>
      <div class="icons" text="gray-4" flex font-size-3.5>
        <span v-for="(icon, idx) in icones" :key="idx" mr-5 flex>
          <span :class="icon.icon" my-auto inline-block h-3.5 w-3.5 />
          <span>{{ item[icon.name] }}</span>
        </span>
      </div>
    </span>
    <span ml-10 inline-block h-10 flex cursor-pointer items-center justify-center border-1 rd-2 p-3 font-size-5>
      <span i-carbon-edit mr-3 inline-block h-4 w-4 />
      编辑
    </span>
  </div>
</template>
