import process from 'node:process'
import mysql from 'mysql2/promise'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })

  const sql = `SELECT content 
  FROM Reviews
  WHERE movie_id = ${body.movieId};`

  const data: any[] = await connection.query(sql)
    .catch((err) => {
      console.log(err)
      return {
        status: 500,
      }
    })
  let content: string = ''
  data[0].forEach((item: any) => {
    content += item.content
  })

  return {
    content,
  }
})
