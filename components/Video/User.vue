<script setup lang="ts">
import type { User } from '~/types/user'

const { authorId } = defineProps({
  authorId: Number,
})

const user = ref<User>()

await fetch(`http://172.20.10.13:8888/user/${authorId}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('accessToken'),
  },
})
  .then(res => res.json())
  .then((res) => {
    user.value = { ...res.data }
  })

async function toFollow() {
  if (user.value?.id === authorId)
    return
  follow.value = !follow.value
  await fetch(`http://172.20.10.13:8888/follow`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('accessToken'),
    },
    body: JSON.stringify({
      id: user.value?.id,
      type: follow.value ? 0 : 1,
    }),
  })
    .then(res => res.json())
    .then((res) => {
      console.log(res)
    })
}
</script>

<template>
  <div class="author" flex>
    <img m-5 inline-block h-14 w-14 rd-7 bg-gray-3 :src="user?.avatar" :alt="user?.name">
    <div class="information">
      <div class="nameAndSend" text="pink left" flex items-center>
        <span>{{ user?.name }}</span>
        <span
          text="gray-5 hover:blue-4" ml-1 cursor-pointer
          font-size-3 style="transition-duration: .2s;"
        >
          <span i-carbon-send-alt inline-block h-3 w-3 />
          <span>发消息</span>
        </span>
      </div>
      <div class="description" text="gray-3 left" font-size-3>
        {{ user?.signature }}
      </div>
      <div
        v-if="!user?.is_follow && user?.id !== authorId"
        class="concern"
        text="white" h-8 w-40 flex cursor-pointer
        items-center justify-center rd-2 bg-blue-4
        font-size-4 hover:bg-blue-3
        @click="toFollow"
      >
        + 关注 {{ user?.follower_count }}
      </div>
      <div
        v-else text="gray-5"
        h-8 w-40 flex items-center justify-center rd-2
        bg-gray-2 hover:bg-gray-1
      >
        已关注 {{ user?.follower_count }}
      </div>
    </div>
  </div>
</template>
