import process from 'node:process'
import mysql from 'mysql2/promise'

export default eventHandler(async () => {
  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })

  const sql = `SELECT id, title, LENGTH(ids) - LENGTH(REPLACE(ids, ',', '')) + 1 as count
  FROM (
    SELECT id, title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
    FROM known_for
    WHERE id IS NOT NULL AND title IS NOT NULL
    GROUP BY id, title
    HAVING COUNT(id_from_known_for) > 1
    ORDER BY COUNT(id_from_known_for) DESC
    LIMIT 1
  ) as sub_query;`

  const data = await connection.query(sql)
    .catch((err) => {
      console.log(err)
      return {
        status: 500,
      }
    })
  const num = data[0][0].count

  return {
    num,
  }
})
