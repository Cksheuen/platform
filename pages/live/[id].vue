<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <div bg-gray-1 align-top>
    <BilibiliVideo :id="route.params.id" />
  </div>
</template>
