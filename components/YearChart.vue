<script setup lang="ts">
import * as echarts from 'echarts'

const filterData = useFilterDataStore()
const yearData = ref<number[]>([])

const chartDom = $ref<HTMLElement>()
let myChart: echarts.ECharts
let option: echarts.EChartsOption

function getFilteredData() {
  const newData = JSON.parse(localStorage.getItem('data') as string)
  newData.forEach((item: any) => {
    yearData.value[Number(item.release_date.slice(0, 4))]
    = yearData.value[Number(item.release_date.slice(0, 4))]
        ? yearData.value[Number(item.release_date.slice(0, 4))] + 1
        : 1
  })
}

watch(localStorage.getItem('allData'), (_, newVal) => {
  if (newVal)
    getFilteredData()
})

const data = computed(() => {
  const data: any[] = []
  Object.entries(yearData.value).forEach(([key, value]) => {
    data.push([new Date(Number(key), 1, 1), value])
  })

  return data
})

function getData() {
  option = {
    tooltip: {
      trigger: 'axis',
      position(pt) {
        return [pt[0], '10%']
      },
    },
    title: {
      left: 'center',
      text: 'Year Chart',
    },
    toolbox: {
      feature: {
        dataZoom: {
          yAxisIndex: 'none',
        },
        restore: {},
        saveAsImage: {},
      },
    },
    xAxis: {
      type: 'time',
      boundaryGap: false,
    },
    yAxis: {
      type: 'value',
      boundaryGap: [0, '100%'],
    },
    dataZoom: [
      {
        type: 'inside',
        start: 0,
        end: 100,
      },
      {
        start: 0,
        end: 20,
      },
    ],
    series: [
      {
        name: 'Movie Number',
        type: 'line',
        smooth: true,
        symbol: 'none',
        areaStyle: {},
        data: data.value,
      },
    ],
  }
}

watch(data, () => {
  getData()
  myChart.setOption(option)
})

onMounted(() => {
  getFilteredData()
  myChart = echarts.init(chartDom)
  myChart.on('datazoom', (params: any) => {
    const time = filterData.maxYear - filterData.minYear
    let start
    let end

    if (params.start && params.end) {
      start = Math.floor(filterData.minYear + time * params.start / 100)
      end = Math.floor(filterData.minYear + time * params.end / 100)
    }
    else if (params.batch && params.batch[0]) {
      start = Math.floor(filterData.minYear + time * params.batch[0].start / 100)
      end = Math.floor(filterData.minYear + time * params.batch[0].end / 100)
    }

    filterData.updateRange([start, end])
  })
})
</script>

<template>
  <div ref="chartDom" absolute right--10 ml-50 mt-50 inline-block h-100 w-200 class="chart" />
</template>
