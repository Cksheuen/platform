<script setup lang='ts'>
const props = defineProps<{
  scal?: number
  imgPath: string
  toPage?: number
  animate: boolean
}>()
const router = useRouter()
</script>

<template>
  <div
    relative z-20 h-full w-full select-none overflow-hidden
    transition-all duration-900
  >
    <img
      :src="imgPath"
      alt=""
      inline-block
      h-100
    >
    <!-- @click="props.toPage ? router.push(`/movie/${props.toPage}`) : () => {}" -->
  </div>
</template>
