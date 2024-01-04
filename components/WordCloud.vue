<script setup lang="ts">
import * as echarts from 'echarts'
import 'echarts-wordcloud'
import * as tf from '@tensorflow/tfjs'

const { imgPath, movieId } = defineProps({
  imgPath: String,
  movieId: Number,
})

const wordCloud = $ref<HTMLCanvasElement>()
const canvas = $ref<HTMLCanvasElement>()
const img = $ref<HTMLImageElement>()
const percentStore = usePercentStore()

let myChart: echarts.ECharts
let option: echarts.EChartsOption

interface KeyWordObject {
  name: string
  value: number
}

let keywords: KeyWordObject[] = []

let text: string

async function fetchText() {
  const { data, penging, error, refresh } = await useFetch('/api/reviewData', {
    method: 'POST',
    body: {
      movieId,
    },
  })
  text += data.value?.content
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
      maskImage: canvas,
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
  tf.setBackend('webgl')
  await tf.ready()
  myChart = echarts.init(wordCloud)

  await fetchText()
  percentStore.update(40)

  await fetchData()
  percentStore.update(80)

  getData()
  // 定义边缘检测滤波器
  const edgeDetectionFilter2D = tf.tensor2d([
    [-1, -1, -1],
    [-1, 8, -1],
    [-1, -1, -1],
  ], [3, 3])

  // 将滤波器扩展为四维
  const edgeDetectionFilter = edgeDetectionFilter2D.expandDims(2).expandDims(3)

  // 将图像转换为张量
  const imgTensor = tf.browser.fromPixels(img).toFloat().mean(2).div(255.0).expandDims(2)

  // 对图像进行边缘检测处理
  const edgeDetectedImg = tf.conv2d(imgTensor, edgeDetectionFilter, [1, 1, 1, 1], 'same')

  // 归一化图像
  const min = edgeDetectedImg.min()
  const max = edgeDetectedImg.max()
  let normalizedImg = edgeDetectedImg.sub(min).div(max.sub(min))

  // 阈值化处理
  const threshold = 0.5
  normalizedImg = normalizedImg.greater(threshold).toFloat()

  // 计算白色像素和黑色像素的数量
  const whitePixels = normalizedImg.sum().dataSync()[0]
  const totalPixels = normalizedImg.shape[0] * normalizedImg.shape[1]
  const blackPixels = totalPixels - whitePixels

  // 如果白色像素的数量大于黑色像素的数量，交换黑白色
  if (whitePixels > blackPixels)
    normalizedImg = normalizedImg.asType('bool').logicalNot().toFloat()

  // 将张量转换为 JavaScript 数组
  const imgArray = await normalizedImg.array() as number[][][]

  // 遍历数组中的每个像素
  for (let i = 0; i < imgArray.length; i++) {
    for (let j = 0; j < imgArray[i].length; j++) {
      if (imgArray[i][j][0] === 1) {
        // 在这里处理每个像素
        let num = 0
        for (let dx = -3; dx <= 3; dx++) {
          for (let dy = -3; dy <= 3; dy++) {
            if (i + dx >= 0 && i + dx < imgArray.length && j + dy >= 0 && j + dy < imgArray[i].length) {
              if (imgArray[i + dx][j + dy][0] === 1)
                num++
            }
          }
        }
        if (num > 5)
          imgArray[i][j][0] = 0
      }
    }
  }
  normalizedImg = tf.tensor(imgArray)
  await tf.browser.toPixels(normalizedImg.squeeze(), canvas)

  myChart.setOption(option)
  percentStore.update(100)
})
</script>

<template>
  <img ref="img" :src="imgPath" h-100 style="display: none;">
  <div ref="wordCloud" mt-10 inline-block h-100 w-100 />
  <canvas id="canvas" ref="canvas" style="display: none;" />
</template>
