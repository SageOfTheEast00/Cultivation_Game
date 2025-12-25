<template>
  <div class="main-cultivation">
    <div class="Inventory">
      <GameInventory />
    </div>
    <div class="cultivation-page">
      <h1>Cultivation Page</h1>
      <ActionCard />
    </div>
    <div class="manual-page"></div>
  </div>
</template>

<script setup>
import ActionCard from './ActionCard.vue'
import GameInventory from './GameInventory.vue'
</script>

<style lang="scss" scoped>
.main-cultivation {
  display: grid;
  grid-template-columns: 1fr 2fr 1fr;
  color: $color-text-main;
  box-sizing: border-box;
  justify-content: center;
}

.Inventory {
  height: 100vh;
  overflow-y: auto;
  border-right: 2px solid gray;
}

.manual-page {
  height: 100vh;
  border-left: 2px solid gray;
}
</style>
