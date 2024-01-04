export interface VideoData {
  authorId: number
  collectedCount: number
  comment_count: number
  cover_url: string
  createAt: number
  duration: number
  favorite_count: number
  id: number
  introduce: string
  isCollected: boolean
  isFollow: boolean
  is_favorite: boolean
  playCount: number
  playUrl: string
  share_count: number
  title: string
  type: string
}

export interface Action {
  name: string
  icon: string
  num: number
}
