<template>
  <div class="inventory">
    <h2>Inventory</h2>
    <div class="inventory-items" v-for="item in inventory" :key="item.id">
      {{ item.name }} : {{ item.quantity }}
    </div>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
const inventory = gameStore.state.player.inventory
</script>

<style lang="scss" scoped>
.inventory {
  color: $color-text-main;
  padding-left: 5px;
}
</style>
