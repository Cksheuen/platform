<script setup lang="ts">
import * as echarts from 'echarts'

const num = ref<number>(0)
const graghData: any[] = []
const edges: NonNullable<echarts.GraphSeriesOption['edges']> = []
const ids = new Map<number, { name: string, index: number }>()
const percentStore = usePercentStore()
let max = 0

async function getNum() {
  await useFetch('/api/maxRelations').then(({ data }) => {
    num.value = data.value.num
    max = data.value.num
  })
}

async function addNewData(id: number) {
  await useFetch('/api/relationIds', {
    method: 'POST',
    body: { id },
  }).then(({ data }) => {
    if (data.value.relations.length !== 0) {
      for (const relation of data.value.relations) {
        for (const [index, id] of relation.ids.entries()) {
          if (!ids.has(id)) {
            ids.set(id, { name: relation.names[index], index: graghData.length })
            graghData.push({
              id: `${id}`,
              name: relation.names[index],
              value: 1,
              symbolSize: 1,
            })
          }
          else {
            const item = graghData[ids.get(id).index]
            item.symbolSize++
            item.value++
          }
        }

        for (let i = 0; i < relation.ids.length; i++) {
          for (let j = i + 1; j < relation.ids.length; j++) {
            edges.push({
              source: `${relation.ids[i]}`,
              target: `${relation.ids[j]}`,
            })
          }
        }
      }
    }
  })
  percentStore.update((max - id + 1) / max * 100)
}

type EChartsOption = echarts.EChartsOption

const chartDom = $ref<HTMLDivElement>()
let myChart: echarts.ECharts
let option: EChartsOption

function getData() {
  option = {
    series: [
      {
        type: 'graph',
        layout: 'force',
        animation: false,
        data: graghData,
        force: {
          repulsion: 200,
          edgeLength: 10,
        },
        edges,
        roam: true,
      },
    ],
  }
}

let count = 0

function startFrame() {
  const intervalId = setInterval(() => {
    if (count === 100) {
      addNewData(num.value)
      num.value--
      if (num.value <= 1) {
        clearInterval(intervalId)
        return
      }
      getData()

      myChart?.setOption(option)
      count = 0
    }
    else { count++ }
  }, 16)
}

function resizeChart() {
  myChart.resize()
}

onMounted(async () => {
  myChart = echarts.init(chartDom)
  window.addEventListener('resize', resizeChart)
  await getNum()

  startFrame()
  option && myChart.setOption(option)
})
onUnmounted(() => {
  window.removeEventListener('resize', resizeChart)
})
</script>

<template>
  <div
    text="gray-5 hover:gray-7"
    absolute left-10 z-20 block cursor-pointer rd-0
    bg-transparent px-3 py-1 transition-all duration-100
    @click="useRouter().push('/')"
  >
    ..Back
  </div>
  <div
    ref="chartDom" inline-block class="relation"
    border-1 border-gray-3
  />
</template>

<style scoped>
.relation {
  width: calc(100vw - 100px);
  height: calc(100vh - 100px);
}
</style>

<!--
SELECT title, COUNT(DISTINCT id_from_known_for)
FROM known_for
GROUP BY title
HAVING COUNT(id_from_known_for) > 1;

SELECT title, GROUP_CONCAT(id_from_known_for) as ids
FROM known_for
GROUP BY title
HAVING COUNT(id_from_known_for) > 1;

SELECT LENGTH(ids) - LENGTH(REPLACE(ids, ',', '')) + 1 as count
FROM (
  SELECT GROUP_CONCAT(DISTINCT id_from_known_for) as ids
  FROM known_for
  WHERE title IS NOT NULL
  GROUP BY title
  ORDER BY COUNT(id_from_known_for) DESC
  LIMIT 1
) as sub_query;

SELECT title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
FROM known_for
WHERE title IS NOT NULL
GROUP BY title
HAVING COUNT(id_from_known_for) > 1
ORDER BY COUNT(id_from_known_for) DESC
LIMIT 1;

SELECT title, LENGTH(ids) - LENGTH(REPLACE(ids, ',', '')) + 1 as count
FROM (
  SELECT title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
  FROM known_for
  WHERE title IS NOT NULL
  GROUP BY title
  HAVING COUNT(id_from_known_for) > 1
  ORDER BY COUNT(id_from_known_for) DESC
) as sub_query;

SELECT id, title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
FROM known_for
WHERE id IS NOT NULL AND title IS NOT NULL
GROUP BY id, title
HAVING COUNT(id_from_known_for) = 10
ORDER BY COUNT(id_from_known_for) DESC;

SELECT id, title, LENGTH(ids) - LENGTH(REPLACE(ids, ',', '')) + 1 as count
FROM (
  SELECT id, title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
  FROM known_for
  WHERE id IS NOT NULL AND title IS NOT NULL
  GROUP BY id, title
  HAVING COUNT(id_from_known_for) > 1
  ORDER BY COUNT(id_from_known_for) DESC
) as sub_query;
-->
