export type KindType = '系统消息' | '评论消息' | '点赞消息' | '关注消息' | '私信消息'

export interface Message {
  kind: KindType
  from: string
  content: string
}
