<template>
  <div class="story-panel">
    <div class="story-entries">
      <div
        class="story-entry"
        v-for="entry in storyEntries"
        :key="entry.id"
        :class="{ 'is-new': !entry.read }"
      >
        <h3>Day {{ entry.date.day }}, Year {{ entry.date.year }}</h3>
        <p>{{ storyContents[entry.id]?.content }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { storyContents } from '@/data/storyContents.js'
import { useGameStore } from '@/stores/gameStore'
import { computed, onUnmounted } from 'vue'
const gameStore = useGameStore()
const storyEntries = computed(() => gameStore.state.game.storyHistory)

onUnmounted(() => {
  // Mark all story entries as read when component is unmounted
  storyEntries.value.forEach((entry) => {
    entry.read = true
  })
})
</script>

<style lang="scss" scoped>
.story-panel {
  padding: 4px;
  height: 100%;
  overflow-y: auto;
}
.is-new {
  border-left: 4px solid gray; /* Nice visual indicator */
  padding-left: 1rem;
}
</style>
