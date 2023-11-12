<script setup lang="ts">
/* definePageMeta({
  middleware: ['auth'],
}) */
</script>

<template>
  <div flex-1>
    <div class="information" inline-block h-100 w-70>
      <div class="photo" m-10 h-50 w-50 overflow-hidden rd-36 bg-gray-3>
        photo
      </div>
      <span text="left gray-5 " mb-2 ml-3 block font-thin>name</span>
      <span
        block border-1 border-gray-3 border-solid bg-gray-1
        btn hover:bg-gray-2 text="black"
      >
        Edit profile
      </span>
      <div border-b pb-4 text-4>
        <span i-carbon-user-favorite-alt-filled mr-1 inline-block h-4 w-4 />
        <span mr-1>{{ 1 }}</span>
        <span mr-1 text="gray-5">follower·</span>
        <span mr-1>{{ 0 }}</span>
        <span mr-1 text="gray-5">following</span>
      </div>
      <div text="left" ml-3 mt-3>
        <div>
          Major in
        </div>
        <div>{{ '...' }}</div>
      </div>
    </div>
    <div
      class="introduction"
      text="left sm" m-10
      inline-block min-h-20 w-200 items-center border-1 border-gray-3 border-solid p-5 align-top
    >
      <span i-carbon-edit float-right inline-block h-4 w-4 bg-gray-5 btn />
      {{ "It's a place for you to introduce yourself. " }}
    </div>
  </div>
</template>
