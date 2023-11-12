<template>
  <div h-20 flex items-center bg-light text="center gray-500">
    <div flex justify-center>
      <span v-for="item in 5" :key="item" ml-4>
        <NuxtLink :to="`/choices/choices${item}`">
          choices{{ item }}
        </NuxtLink>
      </span>
    </div>
    <div text="right" float-right mr-10 flex-1>
      <NuxtLink to="/notice">
        <span i-carbon-notification-new mr-5 inline-block h-5 w-5 />
      </NuxtLink>
      <NuxtLink to="/user">
        <span i-carbon-user-avatar inline-block h-5 w-5 />
      </NuxtLink>
    </div>
  </div>
</template>
