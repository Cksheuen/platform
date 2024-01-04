import process from 'node:process'
import mysql from 'mysql2/promise'

export default eventHandler(async (event) => {
  const body = await readBody(event)
  console.log(body)

  const connection = await mysql.createConnection({
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  })

  const sql = `SELECT id, title, GROUP_CONCAT(DISTINCT id_from_known_for) as ids
  FROM known_for
  WHERE id IS NOT NULL AND title IS NOT NULL
  GROUP BY id, title
  HAVING COUNT(id_from_known_for) = ${body.id}
  ORDER BY COUNT(id_from_known_for) DESC;`

  const data = await connection.query(sql)
    .catch((err) => {
      console.log(err)
      return {
        status: 500,
      }
    })

  interface Relation {
    ids: number[]
    names: string[]
  }

  const relations: Relation[] = []

  for (const element of data[0]) {
    const sql2 = `select name
    from Peoples
    where id in (${element.ids});`

    const ids: Set<number> = new Set()
    element.ids.split(',').forEach((element: string) => {
      ids.add(Number.parseInt(element))
    })

    const data2 = await connection.query(sql2)
      .catch((err) => {
        console.log(err)
        return {
          status: 500,
        }
      })
    const names: string[] = data2[0].map((element: any) => element.name)

    relations.push({
      ids: Array.from(ids),
      names,
    })
  }

  return {
    relations,
  }
})

/*
select name
from Peoples
where id in (
  SELECT id
  FROM known_for
  WHERE id IS NOT NULL AND title IS NOT NULL
  GROUP BY id, title
  HAVING COUNT(id_from_known_for) = 10
)
*/
