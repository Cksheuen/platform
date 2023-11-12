<script lang="ts" setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const router = useRouter()

const ifShow = ref<boolean>(true)

const method = ref<string>('0')

const show1: Array<string> = ['邮箱', '邮箱', '账号']
const show2: Array<string> = ['验证码', '密码', '密码']
const input1: Array<string> = ['请输入邮箱', '请输入邮箱', '请输入账号']
const input2: Array<string> = ['请输入验证码', '请输入密码', '请输入密码']

interface Form {
  user: string
  password: string
}

type Rules = {
  [K in keyof Form]?: Array<FormItemRule>;
}

const form = ref<FormInstance>()

const formInline = reactive<Form>({
  user: '',
  password: '',
})

const rules = reactive<Rules>({
  user: [
    {
      required: true,
      message: '请确认输入内容',
      trigger: 'change',
    },
  ],
  password: [
    {
      required: true,
      message: '请确认输入内容',
      trigger: 'change',
    },
  ],
})

function onSubmit() {
  form.value?.validate((validate) => {
    console.log(validate)
    if (validate) {
      router.push('/')
      localStorage.setItem('token', '1')
    }
    else {
      ElMessage.error('请输入完整')
    }
  })
}

function sendCode() {
  console.log('发送验证码')
}

function exchange() {
  if (method.value === '0')
    ifShow.value = true
  else ifShow.value = false
}
</script>

<template>
  <el-card class="box-card">
    <el-radio-group v-model="method" label="0" class="chooseBox" @change="exchange">
      <el-radio-button label="0">
        邮箱验证登录
      </el-radio-button>
      <el-radio-button label="1">
        邮箱密码登录
      </el-radio-button>
      <el-radio-button label="2">
        账号登录
      </el-radio-button>
    </el-radio-group>
    <LoadingForm
      :input1="input1"
      :input2="input2"
      :if-show="ifShow"
      :method="method"
    />
  </el-card>
</template>

<style scoped>
.box-card {
    position: absolute;
    left: calc(50% - 180px);
    top: calc(50% - 138px);
    width: 360px;

    .chooseBox {
        margin-bottom: 30px;
    }
}
</style>
