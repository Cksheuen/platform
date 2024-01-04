<script setup lang="ts">
import { Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import type { UploadProps } from 'element-plus'
import SelfVideo from '~/components/User/SelfVideo.vue'
import Collection from '~/components/User/Collection.vue'
import type { User } from '~/types/user'

const route = useRoute()
const avatarUrl = ref<string>('')
const user = ref<User>()
const id = route.params.id
const nowUserId = Number(localStorage.getItem('id'))

const birthday = ref<Date>()
const sex = ref<string>()
const follow = ref<boolean>()
const company = ref<string>()
const showVideo = ref(SelfVideo)
const com = ref<boolean>(true)

interface Course {
  name: string
  major: string
  teacher: string
  score?: number
}

const data: Course[] = [
  {
    name: 'course1',
    major: 'major1',
    teacher: 'teacher1',
  },
  {
    name: 'course2',
    major: 'major2',
    teacher: 'teacher2',
  },
  {
    name: 'course3',
    major: 'major3',
    teacher: 'teacher3',
    score: 100,
  },
  {
    name: 'course4',
    major: 'major4',
    teacher: 'teacher4',
    score: 70,
  },
  {
    name: 'course5',
    major: 'major5',
    teacher: 'teacher5',
  },
  {
    name: 'course6',
    major: 'major6',
    teacher: 'teacher6',
  },
]

function cal(score: number): string {
  if (score < 60)
    return 'red'
  else if (score < 80)
    return 'rgb(200, 200, 0)'
  else return 'green'
}

const introduction = ref<string>()

const editState = ref<boolean>(false)

async function switchEdit() {
  if (editState) {
    await fetch('http://172.20.10.13:8888/user/', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': localStorage.getItem('accessToken'),
      },
      body: JSON.stringify({
        signature: introduction.value,
      }),
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
      })
  }
  editState.value = !editState.value
}

const profileEdit = ref<boolean>(false)

async function save() {
  profileEdit.value = false
  await fetch('http://172.20.10.13:8888/user/', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('accessToken'),
    },
    body: JSON.stringify({
      birthday: Math.floor(birthday.value!.getTime() / 1000),
      sex: sex.value,
      company: company.value,
    }),
  }).then(res => res.json())
    .then((res) => {
      console.log(res)
    })
    .catch((err) => {
      console.log(err)
    })
}

const about = [`company`, `location`, `website`, `joined`]
const icones = [`i-carbon-location-company`, `i-carbon-location`, `i-carbon-link`, `i-carbon-calendar`]

async function getUserInf() {
  console.log(localStorage.getItem('accessToken'))

  await fetch(`http://172.20.10.13:8888/user/${id}`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': localStorage.getItem('accessToken'),
    },
  })
    .then(res => res.json())
    .then((res) => {
      user.value = { ...res.data }
      console.log(user.value)
    })
}

onMounted(async () => {
  await getUserInf()
  introduction.value = user?.value?.signature
  birthday.value = new Date(user.value!.birthday * 1000)
  sex.value = user.value?.sex
  follow.value = user.value?.is_follow
  company.value = user.value?.company
})

const handleAvatarSuccess: UploadProps['onSuccess'] = (
  response,
  uploadFile,
) => {
  console.log(response)

  avatarUrl.value = URL.createObjectURL(uploadFile.raw!)
}

const beforeAvatarUpload: UploadProps['beforeUpload'] = (rawFile) => {
  if (rawFile.type !== 'image/jpeg' && rawFile.type !== 'image/png') {
    ElMessage.error('Avatar picture must be JPG/PNG format!')
    return false
  }
  else if (rawFile.size / 1024 / 1024 > 2) {
    ElMessage.error('Avatar picture size can not exceed 2MB!')
    return false
  }
  return true
}

const header = {
  Authorization: localStorage.getItem('accessToken'),
}
function changeSex() {
  if (sex.value === 'male')
    sex.value = 'female'
  else sex.value = 'male'
}
function quitLogin() {
  localStorage.clear()
  useRouter().push('/')
}

async function toFollow() {
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
function changeCom(comp: any, b: boolean) {
  showVideo.value = comp
  com.value = b
}
</script>

<template>
  <div flex-1>
    <span
      v-if="user && user.id === nowUserId"
      text="gray"
      absolute left-15 top-30 cursor-pointer font-size-5
      @click="quitLogin"
    >
      quitLogin..
    </span>
    <div class="information" inline-block h-100 w-70>
      <div v-if="profileEdit" class="photo" m-10 h-50 w-50 rd-2>
        <el-upload
          class="avatar-uploader"
          action="http://172.20.10.13:8888/avatar"
          :headers="header"
          name="avatar"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="user?.avatar" :src="user.avatar" class="avatar">
          <el-icon v-else class="avatar-uploader-icon">
            <Plus />
          </el-icon>
        </el-upload>
      </div>
      <img v-else m-10 h-50 w-50 rd-2 :src="user?.avatar" alt="">
      <div v-if="profileEdit" text="left sm">
        <div class="name" mb-2>
          <div>name</div>
          <input
            type="text" border
            :placeholder="user?.name ? user.name : 'name'"
            rd-1 px-2 py-1
          >
        </div>
        <div border-b pb-4 font-size-4 text="left">
          <span mr-1>sex: </span>
          <span
            mr-1 cursor-pointer
            :text="sex === 'male' ? 'blue' : 'pink'" @click="changeSex"
          >{{ sex }}</span>
        </div>
        <div class="birthday">
          <span mr-1>birthday: </span>
          <div class="block">
            <el-date-picker
              v-model="birthday"
              type="date"
              placeholder="Pick a day"
              size="default"
            />
          </div>
        </div>
        <div class="bio" mb-2>
          <div>Bio</div>
          <textarea id="bio" name="bio" cols="30" rows="3" placeholder="Add a bio" border rd-1 px-2 py-1 />
        </div>
        <!-- <div v-for="(item, index) in about" :key="index" mb-2 flex items-center>
          <span :class="icones[index]" mr-1 inline-block h-5 w-5 />
          <input type="text" :placeholder="item" border rd-1 px-2 py-1>
        </div> -->
        <div mb-2 flex items-center>
          <span :class="icones[0]" mr-1 inline-block h-5 w-5 />
          <input type="text" :placeholder="company ? company : 'company'" border rd-1 px-2 py-1>
        </div>
        <span bg-green-7 px-2 btn @click="save">save</span>
        <span text="gray-9" solid ml-1 border-1 border-gray-5 bg-gray-1 px-2 btn hover:bg-gray-2 @click="profileEdit = false">cancel</span>
      </div>
      <div v-else>
        <span text="left gray-5 " mb-2 ml-3 block font-thin>{{ user?.name }}</span>
        <span

          text="black" mb-2
          block border-1 border-gray-3 border-solid bg-gray-1 btn hover:bg-gray-2 @click="profileEdit = true"
        >
          Edit profile
        </span>
        <div border-b pb-4 font-size-4 text="left">
          <span mr-1>sex: </span>
          <span mr-1 :text="sex === 'male' ? 'blue' : 'pink'">{{ sex }}</span>
        </div>
        <div border-b pb-2 pt-1 font-size-4 text="left">
          <span mr-1>birthday: </span>
          <span>{{ birthday?.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }) }}</span>
        </div>
        <div border-b pb-4 pt-1 font-size-3 text="left">
          <span i-carbon-user-favorite-alt-filled mr-1 inline-block h-4 w-4 />
          <span mr-1>{{ user?.follower_count }}</span>
          <span mr-1 text="gray-5">follower· </span>
          <span mr-1>{{ user?.follow_count }}</span>
          <span mr-1 text="gray-5">following</span>
          <span
            v-if="user && user.id !== nowUserId" float-right cursor-pointer
            text="red"
            @click="toFollow"
          >
            <span v-if="follow" i-carbon-favorite-filled inline-block h-5 w-5 />
            <span v-else i-carbon-favorite inline-block h-5 w-5 />
          </span>
        </div>
      </div>
      <div text="left" ml-3 mt-3>
        <div>
          Company
        </div>
        <div>{{ user?.company }}</div>
      </div>
    </div>
    <div class="right" inline-block w-200 p-5 align-top>
      <div
        class="introduction"
        text="left sm"
        mb-10 min-h-20 items-center border-1 border-gray-3 border-solid p-10
      >
        <span i-carbon-edit float-right inline-block h-4 w-4 bg-gray-5 btn @click="switchEdit" />
        <textarea
          id="introduction" v-model="introduction" class="introduction"
          w-150 border-none name="introduction" cols="30" rows="5" :readonly="!editState"
        />
      </div>
      <div blue mb-5>
        <div text="left gray">
          <span
            :class="com ? 'text-blue' : ''"
            cursor-pointer
            @click="changeCom(SelfVideo, true)"
          >SelfVideo</span>
          /
          <span
            :class="!com ? 'text-blue' : 'gray-6'"
            cursor-pointer
            @click="changeCom(Collection, false)"
          >Collection</span>
        </div>
        <component :is="showVideo" :user-id="id" />
      </div>
      <!-- <div class="courses" flex flex-wrap>
        <div
          v-for="(item, index) in data" :key="index" class="course"
          :class="index % 2 === 0 ? 'mr-10' : ''"
          relative mb-10 h-20 w-90 border-1 border-gray-3 border-solid
        >
          <span absolute left-3 top-3 text="blue-6">{{ item.name }}</span>
          <span text="gray-5 sm" absolute right-3 top-3 border-1 border-gray-3 rd-5 border-solid px-1>{{ item.major }}</span>
          <span absolute bottom-3 left-3 text="gray-6 sm">{{ item.teacher }}</span>
          <span
            v-if="item.score" absolute bottom-3 right-5 font-400
            :style="{ color: cal(item.score) }"
            text="sm"
          >
            {{ item.score }}
          </span>
        </div>
      </div> -->
      <div class="studyTimes">
        <StudyTimes />
      </div>
    </div>
  </div>
</template>

<style scoped>
.introduction {
  resize: none;
  outline:none;
}
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-icon.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  text-align: center;
}
</style>
