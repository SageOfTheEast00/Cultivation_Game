<script setup>
import { ref, computed } from 'vue'
import { useGameStore } from '@/stores/gameStore'
const gameStore = useGameStore()
defineProps({
  action: {
    type: Object,
    required: true,
  },
  isActive: {
    type: Boolean,
    required: false,
  },
  expandButton: {
    type: Boolean,
    required: false,
    default: true,
  },
})
const transitionSpeed = computed(() => {
  const speed = gameStore.state.player.upgrades.gameSpeed
  const tickRate = 100 / speed

  if (tickRate < 30) {
    return `none`
  }
  return `width ${tickRate}ms linear`
})
const barWidth = (action) => {
  return (action.current_progress / action.progress_required) * 100
}

const isExpanded = ref(false)

const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}
</script>

<template>
  <div class="card" @click="$emit('cardClick')" :class="{ active: isActive }">
    <div class="card-header">
      <div class="title-container">
        <h2 class="card-title">{{ action.title }}</h2>
        <!-- Add 2 progress bars -->
        <div class="bar-container">
          <div
            class="bar-fill action-fill"
            :style="{ width: barWidth(action) + '%', transition: transitionSpeed }"
          ></div>
        </div>
        <div class="bar-container mastery-container">
          <div class="bar-fill mastery-fill" :style="{ width: 40 + '%' }"></div>
        </div>
      </div>

      <div
        class="expand-button"
        @click.stop="toggleExpand"
        :class="{ rotated: isExpanded }"
        v-if="expandButton"
      >
        <!-- Icon for button dont worry about it-->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
      </div>
    </div>

    <div v-if="isExpanded" class="card-body">
      <slot name="details"></slot>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.card {
  background-color: $bg-body;
  border: 2px solid $border-color;
  border-radius: 8px;
  cursor: pointer;
  overflow: hidden;
  transition: border-color 0.2s ease;
  height: fit-content;

  &:hover {
    border-color: $border-hover;
  }

  &.active {
    border-color: $color-active;

    .card-title {
      color: $color-active;
    }
  }
}

.card-header {
  display: flex;
  background-color: $bg-header;
  align-items: stretch;

  .title-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 4px; //look at this
    padding: 8px; // this too
  }

  .card-title {
    color: $color-text-main;
    margin: 0;
    font-size: 0.95rem;
    font-weight: 600;
    line-height: 1.2;
    transition: color 0.2s ease;
  }
}

/* --- Progress Bars --- */
.bar-container {
  width: 100%;
  height: 6px;
  background-color: #111;
  border-radius: 3px;
  overflow: hidden;
  position: relative;

  &.mastery-container {
    height: 6px;
    margin-top: 2px;
  }
}

.bar-fill {
  height: 100%;
  border-radius: 3px;
  transition: width 0.1s linear;

  &.action-fill {
    background-color: $color-action;
  }

  &.mastery-fill {
    background-color: $color-mastery;
  }
}
/* --- Expand Button --- */
.expand-button {
  color: #666;
  display: flex;
  align-items: center;
  transition: color 0.2s ease;
  border-left: 1px solid #333333;
  justify-content: center;
  width: 40px;

  &:hover {
    color: #fff;
  }

  svg {
    transition: transform 0.3s ease;
  }

  &.rotated svg {
    transform: rotate(180deg);
  }
}

.card-body {
  background-color: $bg-body;
  border-top: 1px solid $border-color;
  color: $color-text-sub;
  font-size: 0.9rem;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
