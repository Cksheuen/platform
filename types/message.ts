export type KindType = '回复我的' | '@我的' | '收到的赞' | '系统通知' | '我的消息'

export interface Message {
  kind: KindType
  from: string
  content: string
}
