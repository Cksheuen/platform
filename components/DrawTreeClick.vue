<script setup lang="ts">
let WIDTH = 1860
let HEIGHT = 972
const el = $ref<HTMLCanvasElement>()
const ctx = $computed(() => el!.getContext('2d')!)

interface Point {
  x: number
  y: number
}

interface Branch {
  start: Point
  length: number
  theta: number
}

interface Frame {
  fn: Function
  num: number
  sliceBranch: Branch
}
const lines: { start: Point, end: Point }[] = []

function isPointOnLine(point: Point, lineStart: Point, lineEnd: Point) {
  const lineLength = Math.sqrt((lineEnd.x - lineStart.x) ** 2 + (lineEnd.y - lineStart.y) ** 2)
  const sumOfDistances = Math.sqrt((point.x - lineStart.x) ** 2 + (point.y - lineStart.y) ** 2)
    + Math.sqrt((point.x - lineEnd.x) ** 2 + (point.y - lineEnd.y) ** 2)
  console.log(lineLength, sumOfDistances, lineLength - sumOfDistances)
  // console.log('---', point, lineStart, lineEnd)

  return Math.abs(lineLength - sumOfDistances) < 50
}

function init(x: number, y: number, theta: number) {
  ctx.strokeStyle = 'rgba(156,163,175,0.8)'
  ctx.lineWidth = 0.2
  const branch: Branch = {
    start: {
      x,
      y,
    },
    length: Math.random() * 3,
    theta,
  }
  slice(branch, 1)
}

const maxDepth = 81
const cen = 0.05

function create(branch: Branch, depth: number) {
  const end = getEndPoint(branch)

  // drawBranch(branch)
  if (depth < maxDepth || Math.random() < cen) {
    slice({
      start: end,
      length: Math.random() * 10,
      theta: branch.theta - Math.random() * 0.4,
    }, depth + 1)
  }
  if (depth < maxDepth || Math.random() < cen) {
    slice({
      start: end,
      length: Math.random() * 10,
      theta: branch.theta + Math.random() * 0.4,
    }, depth + 1)
  }
}

let pendingTasks: Frame[] = []

const maxBranchNum = 30

function slice(branch: Branch, depth: number) {
  const sliceBranch: Branch = { ...branch, length: 1 }
  const num: number = Math.ceil(branch.length)
  pendingTasks.push({
    fn: (bewBranch: Branch) => pendingTasks.length <= maxBranchNum && create(bewBranch, depth + 1),
    num,
    sliceBranch,
  })
}

let rafId: any = null
let count = 0
const per = 4
function startFrame() {
  let t: number = 0
  const pre: Frame[] = pendingTasks
  rafId = requestAnimationFrame(() => {
    if (count % per === 0) {
      pendingTasks = pendingTasks.map((item: Frame) => {
        drawBranch(item.sliceBranch)
        if (item.num - 1 === 0)
          item.fn(item.sliceBranch)
        const branch: Branch = {
          ...item.sliceBranch,
          start: getEndPoint(item.sliceBranch),
        }
        return { ...item, num: item.num - 1, sliceBranch: branch }
      })

      pendingTasks = pendingTasks.filter((item: Frame) => {
        if (!(item.num !== 0))
          t = 1
        return item.num !== 0
      })
      if (t === 1)
        pendingTasks = pre.filter(item => item.num !== 1)
      if (pendingTasks.length === 0)
        cancelAnimationFrame(rafId)
      count = 0
    }
    count++
    startFrame()
  })
}

function getEndPoint(b: Branch): Point {
  return {
    x: b.start.x + Math.cos(b.theta) * b.length,
    y: b.start.y + Math.sin(b.theta) * b.length,
  }
}

function drawBranch(b: Branch) {
  lineTo(b.start, getEndPoint(b))
}

function lineTo(startPoint: Point, endPoint: Point) {
  lines.push({ start: startPoint, end: endPoint })
  ctx.beginPath()
  ctx.moveTo(startPoint.x, startPoint.y) // 设置起点
  ctx.lineTo(endPoint.x, endPoint.y) // 绘制直线
  ctx.stroke()
}

function onClick(event: MouseEvent) {
  if (el) {
    const rect = el.getBoundingClientRect()
    const x = event.clientX + rect.left + rect.x
    const y = event.clientY + rect.top + rect.y

    for (const line of lines) {
      if (isPointOnLine({ x, y }, line.start, line.end)) {
        console.log('Mouse is on the line')
        break
      }
    }
  }
}

onMounted(() => {
  WIDTH = window.innerWidth
  HEIGHT = window.innerHeight
  el!.width = WIDTH
  el!.height = HEIGHT

  init(0, HEIGHT, -Math.PI / 4)
  init(WIDTH, 0, Math.PI / 3 * 2)
  window.addEventListener('click', onClick)
  startFrame()
})
</script>

<template>
  <!-- <canvas  width="600" height="600" /> -->
  <canvas ref="el" z-0 style="width: 1488px; height: 742px;" />
</template>
