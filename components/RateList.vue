<script setup lang="ts">
import * as echarts from 'echarts'

const imgPath = ref<string>()

interface Data {
  page: number
  movieNames: string[]
  moviePopularity: number[]
}

const data = ref<Data[]>([])

const showData = ref<Data>({
  page: 1,
  movieNames: [],
  moviePopularity: [],
})

const total = ref<number>(0)

async function topRated(pageIndex: number) {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDQzMGEzMjY2NGJmMmRlNzY0NzliNjU5NmJlMmYzYiIsInN1YiI6IjY1NDc3Njk3MWFjMjkyN2IyZGNkYjU2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Am-jTPiYN756qKGJg7BMuKiyWQoloA5hHwgMkcLX4Cg',
    },
  }

  await fetch(`https://api.themoviedb.org/3/movie/top_rated?language=cn&page=${pageIndex}`, options)
    .then(response => response.json())
    .then((response) => {
      total.value = response.total_pages
      showData.value = {
        page: pageIndex,
        movieNames: [],
        moviePopularity: [],
      }
      response.results.forEach((item: any) => {
        showData.value.movieNames.push(item.title)
        showData.value.moviePopularity.push(item.popularity)
      })
      data.value.push(showData.value)

      imgPath.value = `https://image.tmdb.org/t/p/original/${response.results[0].poster_path}`
    })
    .catch(err => console.error(err))
}

type EChartsOption = echarts.EChartsOption

let chartDom: HTMLElement
let myChart: echarts.ECharts

let option: EChartsOption

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
      data: showData.value.movieNames,
    },
    series: [
      {
        name: 'popularity',
        type: 'bar',
        data: showData.value.moviePopularity,
      },
    ],
  }
}

onMounted(async () => {
  await topRated(1)
  chartDom = document.getElementById('rateList')!
  myChart = echarts.init(chartDom)
  getData()

  option && myChart.setOption(option)
})

async function pageChange(newPage: number) {
  let have = false
  for (let i = 0; i < data.value.length; i++) {
    if (data.value[i].page === newPage) {
      have = true
      showData.value = data.value[i]
      break
    }
  }
  if (!have)
    await topRated(newPage)

  getData()
  option && myChart.setOption(option)
}
</script>

<template>
  <div absolute inline-block>
    <div id="rateList" h-150 w-150 scale-90 />
    <div class="example-pagination-block">
      <el-pagination
        layout="prev, pager, next" :total="total"
        @current-change="pageChange"
      />
    </div>
    <!-- <img v-if="imgPath" inline-block h-100 w-100 :src="imgPath" alt="">
    <WordCloud :img-path="imgPath" :movie-id="238" /> -->
  </div>
</template>
