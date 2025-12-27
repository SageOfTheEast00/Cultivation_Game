import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { ActionDefinitions } from '@/data/actions.js'
import { helpers } from '@/stores/helpers.js'
import { cultivationActions } from '@/data/cultivationActions.js'

const state = ref({
  actions: {},
  player: {
    location: 'cave',
    inventory: {},
    knowledge: { manuals: {} },
    upgrades: { maxActiveActions: 2, gameSpeed: 1 },
    cultivation: { body: 'mortal', root: 'mortal', soul: 'mortal', stage: 'mortal' },
  },
  game: {
    date: { day: 0, year: 1000 },
    activeActions: [],
    storyHistory: [],
    selectedManual: null,
  },
})

// New Action Getter

// Populate actions from definitions

for (const id in ActionDefinitions) {
  const actionDef = ActionDefinitions[id]
  if (!state.value.actions[id]) {
    state.value.actions[id] = {
      id: id,
      is_visible: actionDef.visible_by_default || false,
      currentProgress: 0,
      progressRequired: actionDef.base_progress_required || 0,
      is_continuous: actionDef.is_continuous || false,
    }
  }
}

// Slowly move functions outside of the store for better organization
// Date progression handler
let tickCount = 0
const handleDateProgression = () => {
  tickCount++
  if (tickCount % 10 === 0) {
    state.value.game.date.day += 1
    tickCount = 0
  }
  if (state.value.game.date.day > 400) {
    state.value.game.date.year += 1
    state.value.game.date.day = 0
  }
}

export const useGameStore = defineStore(
  'game',
  () => {
    // initialize state

    let loopId = null

    // --- Game Tick Start ---
    const gameTick = () => {
      const activeIds = [...state.value.game.activeActions]
      if (activeIds.length === 0) return

      handleDateProgression()

      activeIds.forEach((actionId) => {
        const actionDef = ActionDefinitions[actionId]
        const actionState = state.value.actions[actionId]

        if (!actionDef || !actionState) return

        // TODO:make a more sophisticated progress increment later
        const oldProgress = actionState.currentProgress
        actionState.currentProgress += 2

        // --- onProgress hook ---
        if (actionDef.onProgress) {
          actionDef.onProgress({
            helpers: helpers,
            current: actionState.currentProgress,
            old: oldProgress,
            gameState: state.value,
          })
        }

        // completion check
        while (actionState.currentProgress >= actionState.progressRequired) {
          if (actionDef.onComplete) {
            actionDef.onComplete(state.value, helpers)
          }

          // if one-time action, remove from active actions and hide
          if (actionDef.one_time) {
            console.log('Handling one-time action completion for:', actionId)
            handleOneTimeActions(actionId, actionState)
            break
          }
          actionState.currentProgress -= actionState.progressRequired
        }
      })
    }

    const handleOneTimeActions = (actionId, actionState) => {
      const { activeActions } = state.value.game
      const removeIndex = activeActions.indexOf(actionId)
      if (removeIndex > -1) {
        activeActions.splice(removeIndex, 1)
      }
      actionState.is_visible = false
      actionState.currentProgress = 0
    }
    // --- Game Tick End ---

    const startGameLoop = () => {
      if (loopId) return
      const { gameSpeed } = state.value.player.upgrades
      loopId = setInterval(gameTick, 100 / gameSpeed)
    }

    const stopGameLoop = () => {
      if (loopId) {
        clearInterval(loopId)
        loopId = null
      }
    }

    // Active Actions Management
    const handleActiveAction = (clickedAction, type = 'normal') => {
      const actionId = clickedAction.id
      const activeActions = state.value.game.activeActions
      const actionState = state.value.actions[actionId]

      const index = activeActions.indexOf(actionId) //find index of action in active actions

      if (index > -1) {
        // Action is already active, so remove it
        activeActions.splice(index, 1)
        if (!actionState.is_continuous) {
          actionState.currentProgress = 0 // reset progress if not continuous
        }
      } else {
        if (type === 'cultivation') {
          // For cultivation actions, clear all other active actions
          activeActions.length = 0
        }
        activeActions.push(actionId)
        const { maxActiveActions } = state.value.player.upgrades
        if (activeActions.length > maxActiveActions) {
          const removeId = activeActions.shift()
          const removeActionState = state.value.actions[removeId]
          if (!removeActionState.is_continuous) {
            removeActionState.currentProgress = 0 // reset progress if not continuous
          }
        }
      }
    }

    const getVisibleActions = computed(() => {
      return (area) => {
        return Object.values(state.value.actions)
          .filter((action) => action.is_visible)
          .filter((action) => (area ? ActionDefinitions[action.id].area === area : true))
          .map((action) => {
            const staticDef = ActionDefinitions[action.id]
            return {
              ...staticDef,
              ...action,
            }
          })
      }
    })

    const getAvailableManuals = computed(() => {
      return Object.values(state.value.player.knowledge.manuals).map((manualDynamic) => {
        const manualDef = cultivationActions[manualDynamic.id]
        return {
          ...manualDef,
          ...manualDynamic,
        }
      })
    })

    // --- EXPORT ---
    return {
      state,
      getVisibleActions,
      getAvailableManuals,
      handleActiveAction,
      startGameLoop,
      stopGameLoop,
    }
  },
  {
    // uncomment to enable saving store state between sessions
    //persist: true,
  },
)
