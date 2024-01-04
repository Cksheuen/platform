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
  const sql = `SELECT DISTINCT id_from_known_for
  FROM known_for
  WHERE id = ${body.movieId}`

  const data = await connection.query(sql)
    .catch((err) => {
      console.log(err)
      return {
        status: 500,
      }
    })

  const names: string[] = []
  const values: number[] = []

  for (let i = 0; i < data[0].length; i++) {
    const sql = `SELECT name
      FROM Peoples
      WHERE id = ${data[0][i].id_from_known_for}`
    const name = await connection.query(sql)
      .catch((err) => {
        console.log(err)
        return {
          status: 500,
        }
      })
    names.push(name[0][0].name)

    const sql2 = `SELECT COUNT(*)
      FROM known_for
      WHERE id_from_known_for = ${data[0][i].id_from_known_for}`
    const val = await connection.query(sql2)
      .catch((err) => {
        console.log(err)
        return {
          status: 500,
        }
      })
  }
  const size = data[0].length
  const relations: number[][] = Array(size).fill(null).map(() => Array(size).fill(0))
  for (let i = 0; i < data[0].length; i++) {
    for (let j = i + 1; j < data[0].length; j++) {
      if (i !== j) {
        const sql = `SELECT id, COUNT(*) as count
FROM known_for
WHERE id_from_known_for in (${data[0][i].id_from_known_for}, ${data[0][j].id_from_known_for})
GROUP BY id
HAVING COUNT(DISTINCT id_from_known_for) >= 2`
        const relation = await connection.query(sql)
          .catch((err) => {
            console.log(err)
            return {
              status: 500,
            }
          })
        relations[i][j] = relation[0][0].count
      }
    }
  }

  return {
    names,
    relations,
  }
})

/*
select count(*) as count
from known_for
group by id_from_known_for
having count(id_from_known_for) > 3 */
