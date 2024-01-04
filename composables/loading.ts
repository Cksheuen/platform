import { defineStore } from 'pinia'

export const useLoading = defineStore('loading', () => {
  const per = ref<number>(0)

  function updatePer(percent: number) {
    per.value += 1
  }

  return {
    per,
    updatePer,
  }
})
