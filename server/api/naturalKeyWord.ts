import natural from 'natural'

interface KeyWordObject {
  name: string
  value: number
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const TfIdf = natural.TfIdf
  const tfidf = new TfIdf()

  // 添加文本到 TfIdf 实例
  tfidf.addDocument(body.text)
  const keywordObjects: KeyWordObject[] = []

  // 提取关键词
  tfidf.listTerms(0 /* 文档索引 */).forEach((item) => {
    const keywordObject = {
      name: item.term,
      value: item.tfidf,
    }
    keywordObjects.push(keywordObject)
  })

  return {
    keywordObjects,
  }
})
