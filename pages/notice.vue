<script setup lang="ts">
import type { KindType, Message } from '../types/message'

const message = useMessageStore()

const Kinds = ['系统消息', '评论消息', '点赞消息', '关注消息', '私信消息'] as KindType[]

const data: Message[] = [
  {
    kind: '系统消息',
    from: '系统',
    content: '欢迎使用',
  },
  {
    kind: '评论消息',
    from: '用户1',
    content: '评论了你的文章',
  },
  {
    kind: '点赞消息',
    from: '用户2',
    content: '点赞了你的文章',
  },
  {
    kind: '关注消息',
    from: '用户3',
    content: '关注了你',
  },
  {
    kind: '私信消息',
    from: '用户4',
    content: '发来了一条私信',
  },
]
</script>

<template>
  <div class="main" flex-1>
    <div class="chooseLine" inline-block h-100vh bg-gray-1 p-5 align-top font-semibold>
      <span class="title" mb-5>
        <span i-carbon-send-alt inline-block h-3 w-3 />
        消息中心
      </span>
      <ul>
        <li
          v-for="(kind, index) in Kinds" :key="index" class="kinds"
          mt-5 cursor-pointer p-2 hover:text-blue-4
          text="gray-5"
          @click="message.setNewKind(kind)"
        >
          {{ kind }}
        </li>
      </ul>
    </div>
    <div class="content" mb-5 ml-2 inline-block h-100vh w-200 flex-auto overflow-hidden p-5 align-top>
      <span
        class="kindName"
        text="left"
        inline-block h-10 w-200 flex items-center bg-gray-1 p-2 shadow
      >
        {{ message.nowKind }}
      </span>
      <ul>
        <template
          v-for="(item, index) in data.map((item) => {
            console.log(item);

            return item.kind === message.nowKind ? item.content : ''
          })" :key="index"
        >
          <li
            v-if="item"
            mt-3 h-30 w-200 shadow
          >
            {{ item }}
          </li>
        </template>
      </ul>
    </div>
  </div>
</template>
