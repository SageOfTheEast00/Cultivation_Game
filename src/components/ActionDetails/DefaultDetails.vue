<template>
  <div class="action-details">
    <p>
      Progress: {{ action.currentProgress }} / {{ action.progressRequired }} ({{ timeToComplete }}
      ticks)
    </p>
  </div>
  <div class="flavor-text">
    <p>{{ action.flavor }}</p>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  action: { type: Object, required: true },
})

//import { useGameStore } from '@/stores/gameStore'
//const gameStore = useGameStore()
const timeToComplete = computed(() => {
  const action = props.action
  const remaining_progress = action.progressRequired - action.currentProgress
  const time_to_complete = Math.ceil(remaining_progress / 20) // for now
  return time_to_complete
})
</script>

<style lang="scss" scoped>
.action-details {
  padding-left: 5px;
}
.flavor-text {
  font-style: italic;
  text-align: right;
}
p {
  margin: 0;
}
</style>
