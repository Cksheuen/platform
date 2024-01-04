export const useFilterDataStore = defineStore('filterDataStore', {
  state: () => ({
    filterData: [],
    yearRange: [],
    minYear: 0,
    maxYear: 2024,
  }),
  actions: {
    update(newVal: any) {
      if (newVal.length === 0)
        return
      this.filterData = newVal
    },
    updateRange(newVal: any) {
      if (newVal.length === 0)
        return
      this.yearRange = newVal
    },
    setM(min: number, max: number) {
      this.minYear = min
      this.maxYear = max
    },
  },
})
