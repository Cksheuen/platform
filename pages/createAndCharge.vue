<script setup lang="ts">
import Upload from '../components/Upload.vue'
import HomeCharge from '../components/HomeCharge.vue'
import ContentCharge from '../components/ContentCharge.vue'
import CataCharge from '../components/CataCharge.vue'

interface Menu {
  name: string
  icon: string
  content: any
  children?: Menu[]
}

const chargeMenu: Menu[] = [
  {
    name: '主页',
    icon: 'i-carbon-home',
    content: HomeCharge,
  },
  {
    name: '内容管理',
    icon: 'i-carbon-data-enrichment-add',
    content: ContentCharge,
    /* children:[
        {

        }
    ] */
  },
  {
    name: '数据中心',
    icon: 'i-carbon-data-structured',
    content: CataCharge,
  },

]

const contentShow = ref(HomeCharge)
</script>

<template>
  <div class="main" mx-auto mt-5 flex justify-center>
    <div class="left" mr-10 w-40>
      <div
        class="upload" h-10 flex cursor-pointer
        items-center justify-center text="white" bg-blue-5 hover:bg-blue-4
        @click="contentShow = Upload"
      >
        <span i-carbon-cloud-upload mr-1 inline-block h-5 w-5 />
        upload
      </div>
      <div
        v-for="(item, index) in chargeMenu" :key="index"
        m-5 flex cursor-pointer items-center text="hover:blue-4"
        @click="contentShow = item.content"
      >
        <span :class="item.icon" mr-4 inline-block h-5 w-5 />
        {{ item.name }}
      </div>
    </div>
    <div class="right" w-200>
      <component :is="contentShow" />
    </div>
  </div>
</template>
