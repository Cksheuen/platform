import { defineStore } from 'pinia'

export const useGenresStore = defineStore('genres', () => {
  const genresState = ref(1)

  function setGenresState(state: number) {
    genresState.value = state
  }

  return {
    genresState,
    setGenresState,
  }
})
