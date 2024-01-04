<script setup lang="ts">
const { userId } = defineProps({
  userId: String,
})
const params = new URLSearchParams({
  id: userId,
  cursor: 0,
  pageSize: 6,
  order: 'hot',
})

await fetch(`http://172.20.10.13:8888/user/video/${userId}?${params}`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': localStorage.getItem('accessToken'),
  },
})
  .then(res => res.json())
  .then((res) => {
    console.log(res)
  })
</script>

<template>
  selfVideo{{ userId }}
</template>
