<script setup lang='ts'>
import * as echarts from 'echarts'
import { languageToCountry } from '~/constants'

const allData: Data[] = JSON.parse(localStorage.getItem('data'))

interface Origin {
  areaName: string
  num: number
}
const origins = ref<Origin[]>([])
allData.forEach((item: Data) => {
  let check = false
  for (let index = 0; index < origins.value.length; index++) {
    if (item.original_language === origins.value[index].areaName) {
      origins.value[index].num += 1
      check = true
      break
    }
    check = false
  }
  if (!check) {
    origins.value.push({
      areaName: item.original_language,
      num: 1,
    })
  }
})

type EChartsOption = echarts.EChartsOption

const chartDom = $ref<HTMLDivElement>()
let myChart: echarts.ECharts
let option: EChartsOption

function getData() {
  option = {
    title: {
      text: '世界地图',
    },
    tooltip: {
      trigger: 'item',
      formatter: '{b}',
    },
    visualMap: {
      min: 0,
      max: 100,
      left: 'left',
      top: 'bottom',
      text: ['高', '低'],
      inRange: {
        color: ['#e0ffff', '#006edd'],
      },
      calculable: true,
    },
    series: [
      {
        name: '国家',
        type: 'map',
        map: 'world',
        roam: true,
        itemStyle: {
          emphasis: { label: { show: true } },
        },
        data: origins.value.map((item) => {
          return {
            name: languageToCountry[item.areaName],
            value: item.num,
          }
        }),
      },
    ],
  }
}

onMounted(() => {
  console.log(origins.value.map((item) => {
    return {
      name: languageToCountry[item.areaName],
      value: item.num,
    }
  }))

  myChart = echarts.init(chartDom)

  getData()
  console.log(option)
  option && myChart.setOption(option)
})
</script>

<template>
  <div ref="chartDom" inline-block h-200 w-200 />
</template>
