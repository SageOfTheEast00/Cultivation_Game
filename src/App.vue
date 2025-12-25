<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useGameStore } from './stores/gameStore'
import OptionsScreen from './components/OptionsScreen.vue'

const currentPage = ref('Main')

const gameStore = useGameStore()
onMounted(() => {
  gameStore.startGameLoop()
  console.log('Game loop started')
})

onUnmounted(() => {
  gameStore.stopGameLoop()
})

const navPages = [
  { id: 'Main', label: 'Main' },
  { id: 'Cultivation', label: 'Cultivation' },
  { id: 'Options', label: 'Options' },
  { id: 'Profile', label: 'Profile' },
  { id: 'About', label: 'About' },
]
</script>

<template>
  <div class="app-container">
    <!-- Navigation Bar -->
    <NavBar :pages="navPages" v-model:activePage="currentPage" />
    <!-- Main Content -->
    <MainScreen v-if="currentPage === 'Main'" />
    <!-- Cultivation Screen -->
    <CultivationScreen v-else-if="currentPage === 'Cultivation'" />
    <!-- Options Screen -->
    <OptionsScreen v-else-if="currentPage === 'Options'" />
  </div>
</template>

<style lang="scss">
.app-container {
  height: 100dvh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  overflow: hidden;
}
body {
  background: #2a2a2a;
  font-family: sans-serif;
  margin: 0;
}
</style>
