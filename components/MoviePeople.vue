<script setup lang="ts">
import * as echarts from 'echarts'

const props = defineProps({
  movieId: Number,
})

type EChartsOption = echarts.EChartsOption
let chartDom: HTMLElement
let myChart: echarts.ECharts
let option: EChartsOption

const relations = []
let names: any[]
async function fetchMoviePeople() {
  const { data, pending, error, refresh } = await useFetch('/api/getMoviePeople', {
    method: 'POST',
    body: {
      movieId: props.movieId,
    },
  })
  names = data.value!.names
  const weights = Array(data.value!.names.length).fill(0)
  for (let i = 0; i < data.value!.relations.length; i++) {
    for (let j = i + 1; j < data.value!.relations.length; j++) {
      if (data.value?.relations[i][j] !== 0) {
        relations.push({
          source: String(i),
          target: String(j),
          lineStyle: {
            width: data.value?.relations[i][j],
          },
        })
        weights[i] += data.value?.relations[i][j]
        weights[j] += data.value?.relations[i][j]
      }
    }
  }
  for (let i = 0; i < data.value!.names.length; i++) {
    names[i] = {
      id: String(i),
      name: data.value?.names[i],
      symbolSize: weights[i],
      value: weights[i],
    }
  }
}

function getData() {
  option = {
    title: {
      text: 'Les Miserables',
      subtext: 'Circular layout',
      top: 'bottom',
      left: 'right',
    },
    tooltip: {},
    legend: [
      {
        data: names.map(item => item.name),
      },
    ],
    animationDurationUpdate: 1500,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: 'People',
        type: 'graph',
        layout: 'circular',
        circular: {
          rotateLabel: true,
        },
        data: names,
        links: relations,
        roam: true,
        label: {
          position: 'right',
          formatter: '{b}',
        },
        lineStyle: {
          color: 'source',
          curveness: 0.3,
        },
      },
    ],
  }
}

onMounted(async () => {
  await fetchMoviePeople()
  myChart = echarts.init(chartDom)
  getData()
  myChart.setOption(option)
})
</script>

<template>
  <div absolute bottom-10 right-100 h-100 w-100>
    <div ref="chartDom" h-100 w-100 cursor-pointer @click="useRouter().push('/testRelation')" />
  </div>
</template>
