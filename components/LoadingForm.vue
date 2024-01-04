<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage, type FormInstance, type FormItemRule } from 'element-plus'

const props = defineProps(['input1', 'input2', 'method', 'ifShow'])

const router = useRouter()

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

async function onSubmit() {
  const { user, password } = formInline
  const json = {
    name: user,
    password,
  }
  form.value?.validate(async (validate) => {
    if (validate) {
      await fetch(`http://172.20.10.13:8888/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      }).then(res => res.json())
        .then((res) => {
          console.log(res)

          if (res.data.accessToken) {
            ElMessage.success('登录成功')
            router.push('/')
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
            localStorage.setItem('id', res.data.id)
            const now = new Date()
            const tomorrow = new Date(
              now.getFullYear(),
              now.getMonth(),
              now.getDate() + 1,
              0,
              0,
              0,
            )
            const timeToTomorrow = tomorrow.getTime() - now.getTime()
            setTimeout(() => {
              localStorage.clear()
            }, timeToTomorrow)
          }
          else {
            ElMessage.error('用户名或密码错误')
          }
        })
    }
    else {
      ElMessage.error('请输入完整')
    }
  })
}

function register() {
  const { user, password } = formInline
  const json = {
    name: user,
    password,
  }
  form.value?.validate(async (validate) => {
    if (validate) {
      await fetch(`http://172.20.10.13:8888/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(json),
      })
        .then(res => res.json())
        .then((res) => {
          console.log(res)

          if (res.data.accessToken) {
            ElMessage.success('注册成功')
            router.push('/')
            localStorage.setItem('accessToken', res.data.accessToken)
            localStorage.setItem('refreshToken', res.data.refreshToken)
            localStorage.setItem('id', res.data.id)
          }
          else {
            ElMessage.error('注册失败（用户名或密码重复）')
          }
        })
    }
    else {
      ElMessage.error('请输入完整')
    }
  })
}

function sendCode() {
  console.log('发送验证码')
}
</script>

<template>
  <el-form
    ref="form"
    :rules="rules"
    :model="formInline"
    class="demo-form-inline mid"
    :hide-required-asterisk="false"
    label-position="right"
    size="large"
  >
    <el-form-item prop="user" class="inputBox">
      <el-input
        v-model="formInline.user"
        :placeholder="props.input1[parseInt(props.method)]"
        label-width="100%"
        clearable
      />
    </el-form-item>
    <el-form-item prop="password" class="inputBox">
      <el-input
        v-model="formInline.password"
        :placeholder="props.input2[parseInt(props.method)]"
        type="password"
      />
      <el-button v-show="ifShow" class="sendC" type="primary" @click="sendCode">
        发送验证码
      </el-button>
    </el-form-item>
    <div flex style="width:100%" items-center justify-center>
      <div mx-5 btn @click="onSubmit">
        登录
      </div>
      <div mx-5 btn @click="register">
        注册
      </div>
    </div>
  </el-form>
</template>

<style scoped>
.mid {
    margin: auto;
}
.inputBox {
    margin-left: calc(50% - 150px);
    margin-bottom: 15px;
}
.but {
    width: 100px;
    margin: auto;
}
.sendC {
    position: absolute;
    top: 0%;
    right: 9.2px;
    z-index: 2;
}
.demo-form-inline .el-input {
    --el-input-width: 300px;
}
</style>
