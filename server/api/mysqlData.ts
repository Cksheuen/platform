import process from 'node:process'
import mysql from 'mysql2/promise'

export default eventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })

  const sql = 'SELECT * FROM Movies;'

  const data = await connection.query(sql)
    .catch((err) => {
      console.log(err)
      return {
        status: 500,
      }
    })

  return {
    data,
  }
})
