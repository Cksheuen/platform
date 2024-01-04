<script setup lang="ts">
const now = new Date()
const year = now.getFullYear()
const firstDay = new Date(year, 0, 1)

const weekDay = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const months = Array.from({ length: now.getMonth() - firstDay.getMonth() + 1 }, (_, i) => i + firstDay.getMonth())

const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate()

const dates = months.flatMap((month) => {
  const days = daysInMonth(year, month)
  return Array.from({ length: days }, (_, day) => ({ month, day: day + 1 }))
})

if (now.getMonth() === months[months.length - 1])
  dates.splice(dates.length - daysInMonth(year, now.getMonth()) + now.getDate(), dates.length)

const fillDates = [...dates]
while (fillDates.length % 7 !== 0)
  fillDates.push(null)

const mon = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
</script>

<template>
  <div border-1 border-gray-3 rd-2>
    <div my-0 pl-10 font-size-3 text="left">
      <span v-for="(item, index) in now.getMonth() + 1" :key="index" mr-10>{{ mon[index] }}</span>
    </div>
    <div flex flex-row class="middle">
      <div class="week" mt-1 h-35 w-10 flex flex-col>
        <span v-for="(item, index) in weekDay" :key="index" inline-block h-5 w-10 font-size-3>
          <template v-if="index % 2 === 1">
            {{ item }}
          </template>
        </span>
      </div>
      <div h-35 w-190>
        <div class="week flex flex-col flex-wrap" style="height: 100%; width: 100%;">
          <span
            v-for="(item, index) in fillDates" :key="index"
            style="flex: 1 0 calc(100% / 7);" inline-block h-2.5 w-2.5
          >
            <span v-if="item" solid inline-block h-2.5 w-2.5 border-1 border-gray-3 rd-0.5 bg-gray-1 />
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
