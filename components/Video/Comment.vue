<script setup lang="ts">
const lastOrPopular = ref<boolean>(true)

interface Comment {
  personName: string
  photo: string
  time: string
  content: string
  like: number
  disLike: number
  ifLike: boolean
  ifDisLike: boolean
}

const data = ref<Comment[]>([
  {
    personName: '张三',
    photo: 'https://img2.baidu.com/it/u=218644361,1627252895&fm=26&fmt=auto&gp=0.jpg',
    time: '2021-08-01 12:00:00',
    content: '这个视频真的很好看，我很喜欢',
    like: 100,
    disLike: 10,
    ifLike: false,
    ifDisLike: false,
  },
  {
    personName: '李四',
    photo: 'https://img2.baidu.com/it/u=218644361,1627252895&fm=26&fmt=auto&gp=0.jpg',
    time: '2021-08-01 12:00:00',
    content: '这个视频真的很好看，我很喜欢',
    like: 100,
    disLike: 10,
    ifLike: false,
    ifDisLike: false,
  },
  {
    personName: '王五',
    photo: 'https://img2.baidu.com/it/u=218644361,1627252895&fm=26&fmt=auto&gp=0.jpg',
    time: '2021-08-01 12:00:00',
    content: '这个视频真的很好看，我很喜欢',
    like: 100,
    disLike: 10,
    ifLike: false,
    ifDisLike: false,
  },
  {
    personName: '赵六',
    photo: 'https://img2.baidu.com/it/u=218644361,1627252895&fm=26&fmt=auto&gp=0.jpg',
    time: '2021-08-01 12:00:00',
    content: '这个视频真的很好看，我很喜欢',
    like: 100,
    disLike: 10,
    ifLike: false,
    ifDisLike: false,
  },
])

function likeSwitch(index: number) {
  if (!data.value[index].ifDisLike) {
    data.value[index].ifLike = !data.value[index].ifLike
    if (data.value[index].ifLike)
      data.value[index].like++
    else
      data.value[index].like--
  }
}
function disLikeSwitch(index: number) {
  if (!data.value[index].ifLike) {
    data.value[index].ifDisLike = !data.value[index].ifDisLike
    if (data.value[index].ifDisLike)
      data.value[index].disLike++
    else
      data.value[index].disLike--
  }
}
</script>

<template>
  <div class="comment" text="left" mt-5>
    <span font-size-5>
      评论
      <span font-size-3.5 text="gray-4">number</span>
    </span>
    <span ml-8 font-size-3.5 text="gray-4">
      <span mx-2 cursor-pointer :text="lastOrPopular ? 'black' : 'gray-4 hover:blue'" @click="lastOrPopular = true">最热</span>
      |
      <span mx-2 cursor-pointer :text="!lastOrPopular ? 'black' : 'gray-4 hover:blue'" @click="lastOrPopular = false">最新</span>
    </span>
    <div mt-5 flex p-0>
      <img
        class="photo" inline-block h-12 w-12 rd-6 bg-gray-3
        src="https://i0.hdslb.com/bfs/face/member/noface.jpg@160w_160h_1c_1s_!web-avatar-comment.webp"
      >
      <input
        type="text"
        placeholder="写下你的评论..."
        mx-2 flex-auto border-1 border-gray-3 rd-1 bg-gray-2 px-2 font-size-3
        focus-border-gray-3 focus-bg-white hover:bg-white
      >
      <div class="span" jusity-center flex items-center bg-cyan-3 btn hover:bg-cyan-4>
        发布
      </div>
    </div>
    <div v-for="(item, index) in data" :key="index" class="list" mt-7 flex>
      <div class="left">
        <img class="photo" inline-block h-12 w-12 rd-6 bg-gray-3 :src="item.photo">
      </div>
      <div class="right" ml-4>
        <div class="name" font-size-3.5>
          {{ item.personName }}
        </div>
        <div class="description" mt-2>
          {{ item.content }}
        </div>
        <div class="time" text="gray-5" mt-2 font-size-3.5>
          <span class="time">{{ item.time }}</span>
          <span ml-4 cursor-pointer @click="likeSwitch(index)">
            <span
              :class="item.ifLike ? 'i-carbon-thumbs-up-filled' : 'i-carbon-thumbs-up'"
              mr-2 inline-block h-3 w-3
              :text="item.ifLike ? 'blue-4' : 'gray-4 hover:blue-4' "
            />
            <span class="num1">{{ item.like }}</span>
          </span>
          <span ml-4 cursor-pointer @click="disLikeSwitch(index)">
            <span
              :class="item.ifDisLike ? 'i-carbon-thumbs-down-filled' : 'i-carbon-thumbs-down'"
              mr-2 inline-block h-3 w-3
              :text="item.ifDisLike ? 'blue-4' : 'gray-4 hover:blue-4' "
            />
            <span class="num2">{{ item.disLike }}</span>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
