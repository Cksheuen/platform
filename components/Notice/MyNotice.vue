<script setup lang='ts'>
import { reactive, ref } from 'vue'
</script>

<template>
  <div bg-gray-1 style="height: 100%;">
    <div class="toWho">
      toWho
    </div>
    <div style="height: 100%;" mx-auto flex>
      <div class="list" style="height: 100%;" inline-block w-40 bg-blue>
        list
      </div>

      <div class="content" flex-1 bg-red>
        <div class="history" />
        history here
        <div class="send">
          <div class="sendBtn" />
        </div>
      </div>
    </div>
  </div>
</template>
