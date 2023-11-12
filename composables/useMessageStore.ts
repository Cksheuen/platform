import { acceptHMRUpdate, defineStore } from 'pinia'

import type { KindType } from '~/types/message'

export const useMessageStore = defineStore('message', () => {
  const nowKind = ref<KindType>('系统消息')

  function setNewKind(kind: KindType) {
    if (kind)
      nowKind.value = kind
  }
  return {
    nowKind,
    setNewKind,
  }
})
