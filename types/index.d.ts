// ~/types/index.d.ts

declare interface Data {
  adult: boolean
  backdrop_path: string
  genre_ids: number[]
  id: number
  original_language: string
  original_title: string
  overview: string
  popularity: number
  poster_path: string
  release_date: string
  title: string
  video: boolean
  vote_average: number
  vote_count: number
  image_path: string
}

declare interface Genres {
  id: number
  name: string
}
