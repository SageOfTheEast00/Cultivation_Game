<template>
  <div class="header-wrapper">
    <div class="date-display" v-if="showDate">
      <span class="Day">Day {{ date.day }}</span>
      <span class="Year">Year {{ date.year }}</span>
    </div>

    <nav class="nav-container">
      <ul>
        <li
          v-for="page in pages"
          :key="page"
          :class="{ active: activePage === page }"
          @click="selectPage(page)"
        >
          {{ page }}
        </li>
      </ul>
    </nav>
  </div>
</template>

<script setup>
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
const date = gameStore.state.game.date
defineProps({
  pages: {
    type: Array,
    required: true,
  },
  showDate: {
    type: Boolean,
    default: true,
  },
})

const activePage = defineModel('activePage')

const selectPage = (page) => {
  activePage.value = page
}
</script>

<style scoped lang="scss">
.header-wrapper {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  width: 100%;
}

.date-display {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  line-height: 1.2;
  color: $color-text-main;
  font-family: monospace;
  font-size: 0.9rem;
}

.nav-container ul {
  display: flex;
  list-style: none;
  gap: 20px;
  padding: 0;
  margin: 0;
}

.nav-container li {
  padding-bottom: 5px;
  transition: all 0.2s ease-in-out;
  border-bottom: 2px solid transparent;
  color: #71717a;
  cursor: pointer;
}

.nav-container li:hover {
  color: #a1a1aa;
  border-bottom: 2px solid #a1a1aa;
}

.nav-container li.active {
  border-bottom: 2px solid #fafafa;
  color: #fafafa;
  font-weight: bold;
}
</style>
