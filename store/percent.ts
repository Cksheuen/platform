export const usePercentStore = defineStore('percentStore', {
  state: () => ({
    per: 1,
  }),
  actions: {
    update(percent: number) {
      this.per = percent
    },
  },
})
