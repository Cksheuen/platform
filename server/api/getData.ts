/* import https from 'node:https'
import fs from 'node:fs'
import path, { dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import fetch from 'node-fetch'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

export default defineEventHandler(async () => {
  const imgPaths: string[] = []
  const data: any[] = []
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDQzMGEzMjY2NGJmMmRlNzY0NzliNjU5NmJlMmYzYiIsInN1YiI6IjY1NDc3Njk3MWFjMjkyN2IyZGNkYjU2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Am-jTPiYN756qKGJg7BMuKiyWQoloA5hHwgMkcLX4Cg',
    },
  }
  async function topRated(pageIndex: number) {
    const url = `https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=${pageIndex}&region=2`
    console.log(`page ${pageIndex} started`, url)
    await fetch(url, options)
      .then(res => res.json())
      .then(async (json) => {
        json.results.forEach((movie: any) => {
          data.push(movie)
          imgPaths.push(`https://image.tmdb.org/t/p/w500${movie.poster_path}`)
        })
        data.push(...json.results)
        if (pageIndex <= json.total_pages)
          topRated(pageIndex + 1)
        console.log(`page ${pageIndex} finished`, data)

        await topRated(pageIndex + 1)
      })
      .catch(err => console.error(`error:${err}`))
  }

  async function fetchData() {
    await topRated(1)
    const dirPath = path.join(__dirname, '..', '..', 'public')
    const filePath = path.join(dirPath, 'data.json')

    console.log('dirPath', dirPath, filePath)

    fs.mkdir(dirPath, { recursive: true }, (err) => {
      if (err) {
        console.error('Error creating directory', err)
      }
      else {
        fs.writeFile(filePath, JSON.stringify(data, null, 2), (err) => {
          if (err)
            console.error('Error writing file', err)

          else
            console.log('Successfully wrote file')
        })
      }
    })

    imgPaths.forEach((imgPath, index) => {
      const fileUrl = imgPath
      const filePath = path.join(__dirname, 'public', 'imgs', `${data[index].id}.jpg`)

      const file = fs.createWriteStream(filePath)
      https.get(fileUrl, (response) => {
        response.pipe(file)
      })
    })
  }

  fetchData()

  return {
    status: 200,
  }
})
 */

import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const url = 'https://api.themoviedb.org/3/movie/top_rated?language=en-US&page=1&region=2'
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0ZDQzMGEzMjY2NGJmMmRlNzY0NzliNjU5NmJlMmYzYiIsInN1YiI6IjY1NDc3Njk3MWFjMjkyN2IyZGNkYjU2MyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.Am-jTPiYN756qKGJg7BMuKiyWQoloA5hHwgMkcLX4Cg',
    },
  }

  await fetch(url, options)
    .then(res => res.json())
    .then(json => console.log(json))
    .catch(err => console.error(`error:${err}`))

  return {
    status: 200,
  }
})
