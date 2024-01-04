import type homeVue from './home.vue';
<template>
  <div h-100vh w-100vw overflow-x-hidden>
    <HeadLine />
    <main class="px-10 text-center">
      <slot />
    </main>
  </div>
</template>
