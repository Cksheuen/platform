<script setup lang="ts">
const { userId } = defineProps({
  userId: String,
})
</script>

<template>
  Collection{{ userId }}
</template>
