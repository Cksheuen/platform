<script setup lang="ts">
import * as echarts from 'echarts'
import 'echarts-wordcloud'

import * as tf from '@tensorflow/tfjs'

const { imgPath, movieId } = defineProps({
  imgPath: String,
  movieId: Number,
})

let myCanvas = $ref<HTMLCanvasElement>()

async function getContours(image) {
  // 将图像转换为张量并归一化
  let imgTensor = tf.browser.fromPixels(image).toFloat().div(tf.scalar(255))

  // 将图像转换为灰度图像
  imgTensor = imgTensor.mean(2).expandDims(2)

  // 创建 Sobel 滤波器
  const sobelX = tf.tensor4d([[[[-1]], [[0]], [[1]]], [[[-2]], [[0]], [[2]]], [[[-1]], [[0]], [[1]]]])
  const sobelY = tf.tensor4d([[[[-1]], [[-2]], [[-1]]], [[[0]], [[0]], [[0]]], [[[1]], [[2]], [[1]]]])

  // 应用 Sobel 滤波器
  const edgesX = tf.conv2d(imgTensor, sobelX, [1, 1, 1, 1], 'same')
  const edgesY = tf.conv2d(imgTensor, sobelY, [1, 1, 1, 1], 'same')

  // 计算边缘强度
  const edgeMagnitude = tf.sqrt(tf.add(tf.square(edgesX), tf.square(edgesY))).squeeze().div(tf.scalar(Math.sqrt(2)))

  // 创建一个阈值
  const threshold = tf.fill(edgeMagnitude.shape, 0.5)

  // 创建一个二值图像
  const contourImage = tf.greater(edgeMagnitude, threshold)

  const canvas = document.getElementById('contourCanvas')
  await tf.browser.toPixels(contourImage.toFloat(), canvas)
  myCanvas = canvas

  getData()

  myChart.setOption(option)

  // 返回轮廓图像
  return contourImage
}

const img2 = new Image()
img2.onload = function () {
  // 在这里获取图像数据
  console.log(getContours(img2))
}
img2.src = '/test.jpg'

const wordCloud = $ref<HTMLCanvasElement>()
const img = $ref<HTMLImageElement>()

let chartDom: HTMLElement
let myChart: echarts.ECharts
let option: echarts.EChartsOption

interface KeyWordObject {
  name: string
  value: number
}

let keywords: KeyWordObject[] = []

let text: string

async function fetchText() {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDQzMGEzMjY2NGJmMmRlNzY0NzliNjU5NmJlMmYzYiIsInN1YiI6IjY1NDc3Njk3MWFjMjkyN2IyZGNkYjU2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Am-jTPiYN756qKGJg7BMuKiyWQoloA5hHwgMkcLX4Cg',
    },
  }

  await fetch(`https://api.themoviedb.org/3/movie/238/reviews?language=en-US&page=1`, options)
    .then(response => response.json())
    .then((response) => {
      response.results.forEach((item: any) => {
        text += item.content
      })
    })
    .catch(err => console.error(err))
}

async function fetchData() {
  const { data, pending, error, refresh } = await useFetch('/api/naturalKeyWord', {
    method: 'POST',
    body: {
      text,
    },
  })
  keywords = data.value?.keywordObjects as KeyWordObject[]
}

function getData() {
  option = {
    series: [{
      type: 'wordCloud',
      maskImage: myCanvas,
      sizeRange: [15, 80],
      rotationRange: [0, 0],
      rotationStep: 45,
      gridSize: 8,
      shape: 'pentagon',
      width: '100%',
      height: '100%',
      textStyle: {
        normal: {
          color() {
            return `rgb(${[Math.round(Math.random() * 160), Math.round(Math.random() * 160), Math.round(Math.random() * 160)].join(',')})`
          },
          fontFamily: 'sans-serif',
          fontWeight: 'normal',
        },
        emphasis: {
          shadowBlur: 10,
          shadowColor: '#333',
        },
      },
      data: keywords,
    }],
  }
}

onMounted(async () => {
  if (typeof window !== 'undefined') {
    window.Module = {
      onRuntimeInitialized() {
      // OpenCV.js is ready to use
      },
    }
  }

  myChart = echarts.init(wordCloud)

  await fetchText()

  await fetchData()

  /* getData()

  myChart.setOption(option) */
})
</script>

<template>
  <div ref="wordCloud" inline-block h-100 w-100 />

  <img v-if="imgPath" id="myImage" ref="img" inline-block h-100 w-100 :src="imgPath" alt="">
  <canvas id="contourCanvas" ref="myCanvas" h-100 />
</template>
