<template>
  <div class="main-cultivation">
    <div class="Inventory">
      <GameInventory />
    </div>
    <div class="cultivation-page">
      <h1>Cultivation Page</h1>
      <p>selected manual: {{ selectedManual }}</p>
      <p>active: {{ gameStore.state.game.activeActions }}</p>
      <div class="button-container">
        <div class="cultivation-progress-bar"></div>
        <ActionCard
          v-if="selectedManual"
          :action="selectedManual"
          :key="selectedManual.id"
          :show-expand-button="false"
          @click="gameStore.handleActiveAction(selectedManual.id)"
        />
      </div>
    </div>
    <div class="manual-page">
      <h1>Available Manuals</h1>
      <ActionCard
        v-for="manual in availableManuals"
        :key="manual.id"
        :action="manual"
        :isActive="selectedManual?.id === manual.id"
        @click="handleSelectManual(manual.id)"
      />
    </div>
  </div>
</template>

<script setup>
import ActionCard from './ActionCard.vue'
import GameInventory from './GameInventory.vue'
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
import { computed } from 'vue'

const availableManuals = computed(() => {
  return gameStore.getAvailableManuals
})

const handleSelectManual = (manualId) => {
  const current = gameStore.state.game.selectedManualId
  gameStore.state.game.selectedManualId = current === manualId ? null : manualId
}

const selectedManual = computed(() => {
  if (!gameStore.state.game.selectedManualId) return null
  const {
    def: actionDef,
    state: actionState,
    type,
  } = gameStore.getActionById(gameStore.state.game.selectedManualId) || null
  return {
    ...actionDef,
    ...actionState,
    type,
  }
})
</script>

<style lang="scss" scoped>
@mixin bottom-center($offset: 20px) {
  position: fixed;
  bottom: $offset;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
}
.main-cultivation {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  color: $color-text-main;
  box-sizing: border-box;
  justify-content: center;
}

.Inventory {
  padding: 1rem;
  height: 100vh;
  overflow-y: auto;
  border-right: 2px solid gray;
}

.cultivation-page {
  padding: 1rem;
  overflow-y: auto;
  .button-container {
    @include bottom-center(60px);
  }
}

.manual-page {
  padding: 1rem;
  overflow-y: auto;
  height: 100vh;
  border-left: 2px solid gray;
}
</style>
