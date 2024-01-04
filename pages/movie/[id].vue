<script setup lang='ts'>
import { Starport } from 'vue-starport'
import { genresInEnglish } from '~/constants'

const route = useRoute()
const id = Number(route.params.id)

let allData: Data[]

const data = ref<Data>()

const genres = ref<string[]>([])

onMounted(() => {
  allData = JSON.parse(localStorage.getItem('data')!)
  data.value = allData.filter((item: Data) => item.id === id)[0]

  data.value?.genre_ids.forEach((item) => {
    for (let index = 0; index < genresInEnglish.length; index++) {
      if (Number(item) === genresInEnglish[index].id) {
        genres.value.push(genresInEnglish[index].name)
        break
      }
    }
  })
})

function toGenres() {
  console.log('toGenres')

  useRouter().push('/genres')
}
</script>

<template>
  <div class="outBox" absolute z-2 mx-auto flex border-1 border-gray rd-1 p-5>
    <div text="left" flex-1>
      <div
        text="gray-5 hover:gray-7"
        block cursor-pointer rd-0 bg-transparent px-3 py-1 transition-all duration-100 @click="useRouter().push('/')"
      >
        ..Back
      </div>
      <div class="animate__animated animate__fadeInUp" block px-3>
        <h1 text="gray-8" my-3 font-size-7>
          {{ data?.original_title }}
        </h1>
        <h2 text="gray-3" m-1 font-100>
          {{
            new Date(data?.release_date as string).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          }}
        </h2>
        <div>
          <el-tag
            v-for="(item, index) in genres" :key="index"
            m-1 cursor-pointer @click="toGenres"
          >
            {{ genres[index] }}
          </el-tag>
        </div>
        <h3 mr-100 mt-8>
          {{ data?.overview }}
        </h3>
        <WordCloud :img-path="`/images/${id}.jpg`" :movie-id="id" />
      </div>
    </div>
    <Starport port="image" absolute right-0 h-100 w-100>
      <Image
        :img-path="`/images/${id}.jpg`"
        :animate="false"
      />
    </Starport>
    <MoviePeople :movie-id="id" />
  </div>
</template>

<style>
.outBox{
  height: 100vh;
}
</style>
