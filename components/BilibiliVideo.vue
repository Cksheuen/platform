<script setup lang="ts">
const { id } = defineProps({
  id: {
    type: String,
    required: true,
  },
})
console.log(id)

const url = `http://172.20.10.13:8080/live/${id}.mp4`
let flvjs: any

if (!import.meta.env.SSR)
  flvjs = await import('flv.js')
/* import flvjs from 'flv.js' */

/* onMounted(() => { */
const checkBoxFields = ['isLive', 'withCredentials', 'hasAudio', 'hasVideo']
let streamURL: any, mediaSourceURL: any

let player: any

function flv_load() {
  /* console.log(`isSupported: ${flvjs.isSupported()}`)
  console.log('mediaSourceURL', mediaSourceURL) */
  if (mediaSourceURL && mediaSourceURL.className === '') {
    /* const url = document.getElementById('msURL').value */

    const xhr = new XMLHttpRequest()
    xhr.open('GET', url, true)
    xhr.onload = function (e) {
      const mediaDataSource = JSON.parse(xhr.response)
      flv_load_mds(mediaDataSource)
    }
    xhr.send()
  }
  else {
    let i
    const mediaDataSource: any = {
      type: 'flv',
    }
    for (i = 0; i < checkBoxFields.length; i++) {
      const field = checkBoxFields[i]
      /** @type {HTMLInputElement} */
      const checkbox = document.getElementById(field)
      mediaDataSource[field] = checkbox.checked
    }
    mediaDataSource.url = document.getElementById('sURL').value
    console.log('MediaDataSource', mediaDataSource)
    flv_load_mds(mediaDataSource)
  }
}

function flv_load_mds(mediaDataSource: any) {
  const element = document.getElementsByName('videoElement')[0]
  if (typeof player !== 'undefined') {
    if (player != null) {
      player.unload()
      player.detachMediaElement()
      player.destroy()
      player = null
    }
  }
  player = flvjs.createPlayer(mediaDataSource, {
    enableWorker: false,
    lazyLoadMaxDuration: 3 * 60,
    seekType: 'range',
  })
  player.attachMediaElement(element)
  player.load()
}
/*
function flv_start() {
  player.play()
}

function flv_pause() {
  player.pause()
}

function flv_destroy() {
  player.pause()
  player.unload()
  player.detachMediaElement()
  player.destroy()
  player = null
}

function flv_seekto() {
  const input = document.getElementsByName('seekpoint')[0]
  player.currentTime = Number.parseFloat(input.value)
} */

function switch_url() {
  streamURL.className = ''
  mediaSourceURL.className = 'hidden'
  saveSettings()
}

function switch_mds() {
  streamURL.className = 'hidden'
  mediaSourceURL.className = ''
  saveSettings()
}

function ls_get(key: any, def: any) {
  try {
    let ret = localStorage.getItem(`flvjs_demo.${key}`)
    if (ret === null)
      ret = def

    return ret
  }
  catch (e) {}
  return def
}

function ls_set(key, value) {
  try {
    localStorage.setItem(`flvjs_demo.${key}`, value)
  }
  catch (e) {}
}

function saveSettings() {
  if (mediaSourceURL.className === '')
    ls_set('inputMode', 'MediaDataSource')

  else
    ls_set('inputMode', 'StreamURL')

  let i
  for (i = 0; i < checkBoxFields.length; i++) {
    const field = checkBoxFields[i]
    /** @type {HTMLInputElement} */
    const checkbox = document.getElementById(field)
    ls_set(field, checkbox.checked ? '1' : '0')
  }
  const msURL = document.getElementById('msURL')
  const sURL = document.getElementById('sURL')
  ls_set('msURL', msURL.value)
  ls_set('sURL', sURL.value)
  console.log('save')
}

function loadSettings() {
  let i
  for (i = 0; i < checkBoxFields.length; i++) {
    const field = checkBoxFields[i]
    /** @type {HTMLInputElement} */
    const checkbox = document.getElementById(field)
    const c = ls_get(field, checkbox.checked ? '1' : '0')
    checkbox.checked = c === '1'
  }

  const msURL = document.getElementById('msURL')
  const sURL = document.getElementById('sURL')
  msURL.value = ls_get('msURL', msURL.value)
  sURL.value = ls_get('sURL', sURL.value)
  if (ls_get('inputMode', 'StreamURL') === 'StreamURL')
    switch_url()

  else
    switch_mds()
}

function showVersion() {
  const version = flvjs.version
  document.title = `${document.title} (v${version})`
}
let logcatbox
onMounted(() => {
  logcatbox = document.getElementsByName('logcatbox')[0]
})

flvjs.LoggingControl.addLogListener((type, str) => {
  logcatbox.value = `${logcatbox.value + str}\n`
  logcatbox.scrollTop = logcatbox.scrollHeight
})

document.addEventListener('DOMContentLoaded', () => {
  streamURL = document.getElementById('streamURL')
  mediaSourceURL = document.getElementById('mediaSourceURL')
  loadSettings()
  showVersion()
  flv_load()
})
/* }) */

onMounted(() => {
  flv_load()
})

interface Comment {
  time: string
  content: string
  sendTime: string
}

const data: Comment[] = [
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
  {
    time: '10:10',
    content: '这是一条评论',
    sendTime: '10-10 10:10',
  },
]
</script>

<template>
  <div class="mainContainer">
    <!-- <div>
      <div id="streamURL">
        <div class="url-input">
          <label for="sURL">Stream URL:</label>
          <input id="sURL" type="text" value="http://127.0.0.1/flv/7182741-1.flv">
          <button @click="switch_mds()">
            Switch to MediaDataSource
          </button>
        </div>
        <div class="options">
          <input id="isLive" type="checkbox" @change="saveSettings()">
          <label for="isLive">isLive</label>
          <input id="withCredentials" type="checkbox" @change="saveSettings()">
          <label for="withCredentials">withCredentials</label>
          <input id="hasAudio" type="checkbox" checked @change="saveSettings()">
          <label for="hasAudio">hasAudio</label>
          <input id="hasVideo" type="checkbox" checked @change="saveSettings()">
          <label for="hasVideo">hasVideo</label>
        </div>
      </div>
      <div id="mediaSourceURL" class="hidden">
        <div class="url-input">
          <label for="msURL">MediaDataSource JsonURL:</label>
          <input id="msURL" type="text" value="http://127.0.0.1/flv/7182741.json">
          <button @click="switch_url()">
            Switch to URL
          </button>
        </div>
      </div>
    </div> -->
    <div p-10 align-top>
      <div class="video-container" inline-block w-200 p-10 align-top>
        <div>
          <video name="videoElement" class="centeredVideo" controls autoplay>
            Your browser is too old which doesn't support HTML5 video.
          </video>
        </div>
      </div>
      <div class="comment" inline-block w-100 align-top>
        <div class="title" text="left gray-8 sm" mb-5 h-10 flex items-center rd-2 bg-gray-1 p-5>
          评论
        </div>
        <ul text="gray-5" h-90 overflow-scroll overflow-x-hidden font-size-3>
          <li relative inline-block w-100 p-1>
            <span float-left ml-4>时间</span>
            <span float-left ml-10>内容</span>
            <span float-right mr-8>发送时间</span>
          </li>
          <li v-for="(item, index) in data" :key="index" relative inline-block w-100 p-1>
            <span float-left ml-3>{{ item.time }}</span>
            <span float-left ml-5 text="gray-9">{{ item.content }}</span>
            <span float-right mr-5>{{ item.sendTime }}</span>
          </li>
        </ul>
      </div>
    </div>

    <!--  <div class="controls">
      <button @click="flv_load()">
        Load
      </button>
      <button @click="flv_start()">
        Start
      </button>
      <button @click="flv_pause()">
        Pause
      </button>
      <button @click="flv_destroy()">
        Destroy
      </button>
      <input style="width:100px" type="text" name="seekpoint">
      <button @click="flv_seekto()">
        SeekTo
      </button>
    </div>
    <textarea name="logcatbox" class="logcatBox" rows="10" readonly />
  </div> -->
  </div>
</template>

<style scoped>
/* .mainContainer {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
}
@media screen and (min-width: 1152px) {
    .mainContainer {
        display: block;
        width: 1152px;
        margin-left: auto;
        margin-right: auto;
    }
}

.video-container {
    position: relative;
    margin-top: 8px;
}

.video-container:before {
    display: block;
    content: "";
    width: 100%;
    padding-bottom: 56.25%;
}

.video-container > div {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

.video-container video {
    width: 100%;
    height: 100%;
} */

/* .urlInput {
    display: block;
    width: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 8px;
} */

.centeredVideo {
    display: block;
    width: 100%;
    height: 100%;
    margin-left: auto;
    margin-right: auto;
    margin-bottom: auto;
}

.controls {
    display: block;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
    margin-top: 8px;
    margin-bottom: 10px;
}

.logcatBox {
    border-color: #CCCCCC;
    font-size: 11px;
    font-family: Menlo, Consolas, monospace;
    display: block;
    width: 100%;
    text-align: left;
    margin-left: auto;
    margin-right: auto;
}
/*
.url-input , .options {
    font-size: 13px;
}

.url-input {
    display: flex;
}

.url-input label {
    flex: initial;
}

.url-input input {
    flex: auto;
    margin-left: 8px;
}

.url-input button {
    flex: initial;
    margin-left: 8px;
}

.options {
    margin-top: 5px;
}

.hidden {
    display: none;
} */
</style>
