<script setup lang="ts">
import { Starport } from 'vue-starport'
import * as echarts from 'echarts'

const router = useRouter()
const allData = ref<Data[]>([])
const nowPage = ref<number>(1)
let minYear = $ref<number>(2024)
const maxYear = 2024
const marks = ref<{ [index: number]: string }>({})
const percentStore = usePercentStore()
const filterData = useFilterDataStore()
const showData = ref([])
const total = ref<number>(0)

async function topRated() {
  await useFetch(`/api/mysqlData`)
    .then(({ data, pending, error, refresh }, _) => {
      percentStore.update(50)
      total.value = data.value.data[0].length
      allData.value = data.value.data[0]
      localStorage.setItem('data', JSON.stringify(data.value.data[0]))
      percentStore.update(80)
    })
    .catch(err => console.error(err))
}

type EChartsOption = echarts.EChartsOption

let chartDom: HTMLElement
let myChart: echarts.ECharts

let option: EChartsOption

filterData.$subscribe(({ events }) => {
  if (events.key === 'filterData') {
    const newData = events.newValue
    nowPage.value = 1
    showData.value = newData.slice((nowPage.value - 1) * 10, nowPage.value * 10)
    total.value = newData.length
  }
  else if (events.key === 'yearRange') {
    filterData.update(allData.value.filter(item =>
      Number(item.release_date.slice(0, 4)) >= events.newValue[0]
      && Number(item.release_date.slice(0, 4)) <= events.newValue[1]))
  }
  getData()
  option && myChart.setOption(option)
})

function getData() {
  option = {
    title: {
      text: 'Movie Rate List',
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
    },
    legend: {},
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
    },
    yAxis: {
      type: 'category',
      data: showData.value.map(item => item.title),
    },
    series: [
      {
        name: 'popularity',
        type: 'bar',
        data: showData.value.map(item => item.popularity),
      },
    ],
  }
}

const detailShow = ref<number | null>()

const animate = ref<boolean>(false)

onMounted(async () => {
  if (!localStorage.getItem('data')) {
    await topRated()
  }
  else {
    allData.value = JSON.parse(localStorage.getItem('data')!)
    total.value = allData.value.length
  }

  allData.value.forEach((item) => {
    if (Number(item.release_date.slice(0, 4)) < minYear)
      minYear = Number(item.release_date.slice(0, 4))
  })
  filterData.setM(minYear, maxYear)
  filterData.updateRange([Number(minYear), Number(maxYear)])
  filterData.update(allData.value.filter(item =>
    Number(item.release_date.slice(0, 4)) >= filterData.yearRange[0]
    && Number(item.release_date.slice(0, 4)) <= filterData.yearRange[1]))

  for (let i = Math.floor(minYear / 10); i <= Math.floor(maxYear / 10); i++)
    marks.value[i * 10] = (i * 10).toString()

  // showData.value = filterData.value.slice(0, 10)

  percentStore.update(100)
  chartDom = document.getElementById('rateList')!
  myChart = echarts.init(chartDom)
  getData()

  option && myChart.setOption(option)
  myChart.on('mouseover', (params) => {
    detailShow.value = params.dataIndex
    animate.value = true
  })
  myChart.on('mouseout', () => {
    detailShow.value = null
    animate.value = false
  })
  myChart.on('click', (params) => {
    router.push(`/movie/${showData.value[params.dataIndex].id}`)
  })
})

async function pageChange(newPage: number) {
  // showData.value = filterData.value.slice((newPage - 1) * 10, newPage * 10)
  nowPage.value = newPage
  getData()
  option && myChart.setOption(option)
}
</script>

<template>
  <div absolute z-2 inline-block flex style="width:90%">
    <div inline-block>
      <div id="rateList" h-150 w-150 scale-90 />
      <div class="example-pagination-block" bg-transparent>
        <el-pagination
          layout="prev, pager, next" :total="total"
          @current-change="pageChange"
        />
      </div>
    </div>
    <Starport port="image" scale-80 transition-all duration-800>
      <Image
        :img-path="showData[detailShow!]?.image_path"
        :to-page="showData[detailShow!]?.id" :animate="animate"
        :class="animate ? 'animate__animated animate__fadeInLeft' : ''"
      />
    </Starport>
    <!-- <div class="slider-demo-block" absolute right-20 top-70 w-150 flex items-center>
      <el-slider v-model="yearRange" range :marks="marks" :min="minYear" :max="2024" />
    </div> -->
    <yearChart />
  </div>
</template>
