<script setup lang="ts">
let id = localStorage.getItem('id')
onMounted(() => {
  window.addEventListener('storage', (e) => {
    id = localStorage.getItem('id')
  })
})
</script>

<template>
  <div h-20 flex items-center bg-light text="center gray-500">
    <div ml-5>
      <NuxtLink to="/">
        home
      </NuxtLink>
    </div>
    <div flex justify-center>
      <NuxtLink to="/List">
        List
      </NuxtLink>
    </div>
    <div text="right" float-right mr-10 flex-1>
      <NuxtLink to="/createAndCharge">
        <span i-carbon-data-enrichment-add mr-5 inline-block h-5 w-5 />
      </NuxtLink>
      <NuxtLink to="/notice">
        <span i-carbon-notification-new mr-5 inline-block h-5 w-5 />
      </NuxtLink>
      <NuxtLink :to="`/user/${id}`">
        <span i-carbon-user-avatar inline-block h-5 w-5 />
      </NuxtLink>
    </div>
    <div absolute right-10 top-17 font-size-2>
      id: {{ id }}
    </div>
  </div>
</template>
