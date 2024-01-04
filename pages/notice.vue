<script setup lang="ts">
import type { KindType, Message } from '../types/message'
import ReplyToMe from '~/components/Notice/ReplyToMe.vue'
import AtMe from '~/components/Notice/AtMe.vue'
import ReceivedLike from '~/components/Notice/ReceivedLike.vue'
import SystemNotice from '~/components/Notice/SystemNotice.vue'
import MyNotice from '~/components/Notice/MyNotice.vue'

const message = useMessageStore()

const Kinds = ['回复我的', '@我的', '收到的赞', '系统通知', '我的消息'] as KindType[]
const Components = [ReplyToMe, AtMe, ReceivedLike, SystemNotice, MyNotice]
</script>

<template>
  <div class="main" h-160 flex-1 overflow-scroll>
    <div class="chooseLine" inline-block h-100vh bg-gray-1 p-5 align-top font-semibold>
      <span class="title" mb-5>
        <span i-carbon-send-alt inline-block h-3 w-3 />
        消息中心
      </span>
      <ul>
        <li
          v-for="(kind, index) in Kinds" :key="index" class="kinds"
          text="gray-5" mt-5 cursor-pointer p-2 font-size-3.5
          hover:text-blue-4
          @click="message.setNewKind(kind)"
        >
          · {{ kind }}
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
      <component
        :is="Components[Kinds.indexOf(message.nowKind)]"
      />
      <!-- <ul>
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
      </ul> -->
    </div>
  </div>
</template>
