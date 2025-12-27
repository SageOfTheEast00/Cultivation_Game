<template>
  <div class="main-screen">
    <!-- main screen has 3 collumns: Inventory, Actions, Log -->
    <div class="Inventory">
      <GameInventory />
    </div>
    <div class="Actions">
      <div v-for="(column, colIndex) in masonryColumns" :key="colIndex" class="MasonryContainer">
        <!-- List of Action Cards using Action_Card component -->
        <ActionCard
          class="Action-card"
          v-for="action in column"
          :key="action.id"
          :action="action"
          @click="gameStore.handleActiveAction(action)"
          :isActive="gameStore.state.game.activeActions.includes(action.id)"
        >
          <template #details>
            <DefaultDetails :action="action" />
          </template>
        </ActionCard>
      </div>
    </div>
    <div class="right-panel">
      <NavBar :pages="rightNavPages" v-model:activePage="currentPage" :showDate="false" />
      <StoryPanel v-if="currentPage === 'Story'" />
      <div class="Log" v-if="currentPage === 'Log'">
        <!-- Debugging Stuff -->
        <h2>active actions {{ gameStore.state.game.activeActions }}</h2>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
import DefaultDetails from './ActionDetails/DefaultDetails.vue'
import GameInventory from './GameInventory.vue'
import { computed, ref } from 'vue'
import NavBar from './NavBar.vue'
import StoryPanel from './StoryPanel.vue'

const currentPage = ref('Log')

const unReadStories = computed(() => {
  return gameStore.state.game.storyHistory.filter((entry) => !entry.read).length
})

const StoryPageTitle = computed(() =>
  unReadStories.value > 0 ? `Story (${unReadStories.value})` : 'Story',
)

const rightNavPages = computed(() => [
  { id: 'Log', label: 'Log' },
  { id: 'Story', label: StoryPageTitle.value },
])

const visibleActions = computed(() => {
  return gameStore.getVisibleActions(gameStore.state.player.location)
})

const masonryColumns = computed(() => {
  const leftActions = []
  const rightActions = []
  visibleActions.value.forEach((action, index) => {
    if (index % 2 === 0) {
      leftActions.push(action)
    } else {
      rightActions.push(action)
    }
  })
  return [leftActions, rightActions]
})
</script>

<style lang="scss" scoped>
// main screen has 3 collumns: Inventory, Actions, Log
.main-screen {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;

  height: 100vh;
  overflow: hidden;
  box-sizing: border-box;
}

.Inventory,
.Actions,
.Log {
  height: 100%;
  overflow-y: auto;
}

.Inventory {
  border-right: 2px solid gray;
}

.Actions {
  display: flex;
  flex-direction: row;
  padding-right: 10px;
  padding-left: 8px;
  gap: 2%;
  width: 100%;
  box-sizing: border-box;
}

.MasonryContainer {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
  min-width: 0;
}

.Action-card {
  width: 100%;
}

.right-panel {
  display: flex;
  flex-direction: column;
  height: 100%;
  border-left: 2px solid gray;
  color: $color-text-main;
}

.Log {
  padding: 10px;
}
</style>
