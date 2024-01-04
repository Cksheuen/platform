<script setup lang="ts">
import { p5i } from 'p5i'
import type { P5I } from 'p5i'
import { onMounted, onUnmounted, ref, watch } from 'vue'
import { transform } from 'lodash-es'

const el = ref<HTMLCanvasElement | null>(null)

const { random, trunc, min } = Math
const {
  mount,
  unmount,
  createCanvas,
  resizeCanvas,
  background,
  noFill,
  stroke,
  noise,
  noiseSeed,
  noLoop,
  cos,
  sin,
  line,
  beginShape,
  endShape,
  vertex,
  push,
  pop,
  translate,
  TWO_PI,
} = p5i()

let w = 400
const h = 10

const SCALE = 40
const SCALE_Z = w * 1.5
const LENGTH = 4
// const SPACING = 10
const AMOUNT = 4000

// let per = 10
const percent = usePercentStore()

function getForceOnPoint(x: number, y: number, z: number) {
  return (noise(x / SCALE, y / SCALE, z / SCALE_Z) - 0.5) * 2 * TWO_PI
}

interface Point {
  x: number
  y: number
  t: number
}

let points: Point[] = []

function setup() {
  createCanvas(w, h)
  background('#fff')
  stroke('#888')
  noFill()

  noiseSeed(+new Date())

  points = []
  for (let i = 0; i < AMOUNT * (percent.per + 0.0) / 100; i++)
    points.push({ x: random() * w, y: random() * h, t: 0 })
}

percent.$subscribe((per) => {
  console.log(per.events.newValue)
  const newPoints: Point[] = []
  for (let i = 0; i < AMOUNT * (per.events.newValue + 0.0) / 100; i++)
    newPoints.push({ x: random() * w, y: random() * h, t: 0 })
  points = newPoints
})

function draw({ frameCount }: P5I) {
  background(255, 255, 255, 50)

  points.forEach((item) => {
    const { x, y } = item
    if (x > w * percent.per / 100)
      item.x = x - w
    if (y > h)
      item.y = y - h
    if (y < 0)
      item.y = y + h
  })

  const len = points.length
  const n = AMOUNT * percent.per / 100 - points.length

  if (n > 0) {
    for (let i = 0; i < n; i++) {
      if (len > trunc(random() * len)) {
        const { x, y } = points[trunc(random() * len)]
        points.push({
          x: x + (random() - 0.5) * LENGTH * 50,
          y: y + (random() - 0.5) * LENGTH * 5,
          t: 0,
        })
      }
    }
  }

  for (const p of points) {
    const { x, y, t } = p
    stroke(0, 0, 0, min(t * 10, 200))
    const rad = getForceOnPoint(x, y, frameCount / 2)
    const nx = x + Math.abs(cos(rad) * LENGTH)
    const ny = y + sin(rad) * LENGTH * 0.5
    line(x, y, nx, ny)
    p.x = nx
    p.y = ny
    p.t += 1
  }
}

function restart() {
  if (el.value)
    mount(el.value, { setup, draw })
}
onMounted(() => {
  w = window.outerWidth
  restart()
  window.addEventListener('resize', () => {
    if (el.value) {
      w = window.outerWidth
      resizeCanvas(w, h)
    }
  })
})
onUnmounted(() => unmount())
</script>

<template>
  <div ref="el" fixed z-10 overflow-hidden />
</template>
