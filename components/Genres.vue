<script setup lang="ts">
import * as echarts from 'echarts'
import { genresInEnglish } from '~/constants'

const genresTrue: string[] = []
const percent = usePercentStore()

interface Data {
  genres: number[]
  num: number[]
}

const data = ref<Data>({
  genres: [],
  num: [],
})

async function topRatedWithIndex() {
  let allData = localStorage.getItem('data')
  allData = JSON.parse(allData!)
  if (allData?.length !== 0) {
    allData?.forEach((item: any) => {
      item.genre_ids.forEach((item1: number) => {
        let check = false
        for (let index = 0; index < data.value.genres.length; index++) {
          if (item1 === data.value.genres[index]) {
            data.value.num[index] += 1
            check = true
            break
          }
          check = false
        }
        if (!check) {
          data.value.genres.push(item1)
          data.value.num.push(1)
        }
      })
    })
  }
}

type EChartsOption = echarts.EChartsOption

let chartDom: HTMLElement
let myChart: echarts.ECharts
let option: EChartsOption

let scatterOption: echarts.EChartsOption

let barOption: echarts.EChartsOption

let currentOption: echarts.EChartsOption

function getData() {
  barOption = {
    title: {
      text: 'Movie Genres',
      subtext: '',
      left: 'center',
    },
    xAxis: {
      data: data.value.genres.map((_, index) => {
        for (let i = 0; i < genresInEnglish.length; i++) {
          if (genresInEnglish[i].id === Number(data.value.genres[index])) {
            genresTrue.push(genresInEnglish[i].name)
            break
          }
        }
        return genresTrue[index]
      }),
      axisLabel: {
        inside: true,
        color: 'black',
        fontSize: 20,
      },
      axisTick: {
        show: false,
      },
      axisLine: {
        show: false,
      },
      z: 10,
    },
    yAxis: {
      axisLine: {
        show: false,
      },
      axisTick: {
        show: false,
      },
      axisLabel: {
        color: '#999',
      },
    },
    dataZoom: [
      {
        type: 'inside',
      },
    ],
    animationDurationUpdate: 1000,
    series: [
      {
        type: 'bar',
        id: 'total',
        showBackground: true,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#83bff6' },
            { offset: 0.5, color: '#188df0' },
            { offset: 1, color: '#188df0' },
          ]),
        },
        emphasis: {
          itemStyle: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              { offset: 0, color: '#2378f7' },
              { offset: 0.7, color: '#2378f7' },
              { offset: 1, color: '#83bff6' },
            ]),
          },
        },
        data: data.value.genres.map((item, index) => ({
          value: data.value.num[index],
          name: genresTrue[index],
        })),
        universalTransition: {
          enabled: true,
          delay(_) {
            return Math.random() * 400
          },
        },
      },
    ],
  }
  scatterOption = (option = {
    title: {
      text: 'Movie Genres',
      subtext: '',
      left: 'center',
    },
    radius: ['40%', '70%'],
    avoidLabelOverlap: false,
    itemStyle: {
      borderRadius: 10,
      borderColor: '#fff',
      borderWidth: 2,
    },
    label: {
      show: false,
      position: 'center',
    },
    emphasis: {
      label: {
        show: true,
        fontSize: 40,
        fontWeight: 'bold',
      },
    },
    labelLine: {
      show: false,
    },
    series: [
      {
        name: 'genres',
        type: 'pie',
        radius: '55%',
        id: 'total',
        animationDurationUpdate: 1000,
        universalTransition: {
          enabled: true,
          delay(_) {
            return Math.random() * 400
          },
        },
        data: data.value.genres.map((item, index) => ({
          value: data.value.num[index],
          name: genresTrue[index],
        })),
        emphasis: {
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  })
}

onMounted(async () => {
  chartDom = document.getElementById('genres')!
  myChart = echarts.init(chartDom)
  currentOption = scatterOption

  percent.update(20)

  await topRatedWithIndex()

  getData()
  option && myChart.setOption(option)

  percent.update(80)

  myChart.getZr().on('click', (event) => {
  // 没有 target 意味着鼠标/指针不在任何一个图形元素上，它是从“空白处”触发的。
    if (!event.target) {
      currentOption = currentOption === scatterOption ? barOption : scatterOption
      myChart.setOption(currentOption, true)
    }
  })
  percent.update(100)
})
</script>

<template>
  <div inline-block>
    <div
      absolute
      text="gray-5 hover:gray-7"
      block cursor-pointer rd-0 bg-transparent px-3 py-1 transition-all duration-100 @click="useRouter().push('/')"
    >
      ..Back
    </div>
    <div id="genres" inline-block h-200 w-200 scale-90 />
  </div>
</template>
