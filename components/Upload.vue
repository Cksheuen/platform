<script setup lang="ts">
import { UploadFilled } from '@element-plus/icons-vue'
import type { UploadInstance } from 'element-plus'

const types = [
  {
    label: '舞蹈',
    value: 0,
  },
  {
    label: '娱乐',
    value: 1,
  },
  {
    label: '科技',
    value: 2,
  },
  {
    label: '美食',
    value: 3,
  },
  {
    label: '汽车',
    value: 4,
  },
  {
    label: '运动',
    value: 5,
  },
  {
    label: '游戏',
    value: 6,
  },
  {
    label: '音乐',
    value: 7,
  },
  {
    label: '知识',
    value: 8,
  },
  {
    label: '生活',
    value: 9,
  },
  {
    label: '时尚',
    value: 10,
  },
]

const uploadRef = ref<UploadInstance>()

const url = 'http://172.20.10.13:8888/video'
const header = {
  Authorization: localStorage.getItem('accessToken'),
}
const title = ref<string>()
const introduction = ref<string>()
const type = ref<number>(0)

function submitUpload() {
  uploadRef.value!.submit()
}

const videoDuration = ref<number>()

function beforeUpload(file: any) {
  return new Promise((resolve, reject) => {
    const video = document.createElement('video')
    video.preload = 'metadata'

    video.onloadedmetadata = function () {
      window.URL.revokeObjectURL(video.src)
      videoDuration.value = video.duration
      resolve('Success!')
    }

    video.onerror = function () {
      reject(new Error('Failed to load video metadata'))
    }

    video.src = URL.createObjectURL(file)
  })
}
</script>

<template>
  <el-upload
    ref="uploadRef"
    class="upload-demo"
    drag
    :action="url"
    multiple
    :headers="header"
    show-file-list
    name="video"
    :auto-upload="false"
    :before-upload="beforeUpload"
    :data="{
      type,
      title,
      introduce: introduction,
      duration: Math.floor(videoDuration!),
    }"
  >
    <el-icon class="el-icon--upload">
      <UploadFilled />
    </el-icon>
    <div class="el-upload__text" flex flex-col items-center justify-center>
      <div mb-5>
        拖曳到此处也可上传
      </div>
    </div>
  </el-upload>
  <div text="left" mx-auto mt-10 w-150>
    <el-form label-width="20px">
      <el-form-item label="Title">
        <el-input v-model="title" />
      </el-form-item>
      <el-form-item label="Introduction">
        <el-input v-model="introduction" type="textarea" />
      </el-form-item>
    </el-form>
    <div text="gray-5">
      <span>Kinds</span>
      <el-select v-model="type" class="m-2" placeholder="Select">
        <el-option
          v-for="item in types"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </div>
  </div>
  <div mt-5>
    <el-button type="primary" @click="submitUpload">
      上传到服务器
    </el-button>
  </div>
</template>
