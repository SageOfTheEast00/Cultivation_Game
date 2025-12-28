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
    visibleActions: ['wake_up', 'study_sifting_sand_to_see_the_nature'],
    storyHistory: [],
    selectedManualId: null,
  },
})

// Helpers for action processing

const resetIfNotContinuous = (actionData) => {
  if (!actionData) return
  const { def: actionDef, state: actionState, type: actionType } = actionData
  if (!actionDef.is_continuous && actionType !== 'cultivation') {
    actionState.currentProgress = 0
  }
}

const handleOneTimeActions = (actionId, actionState) => {
  const { activeActions } = state.value.game
  const removeIndex = activeActions.indexOf(actionId)
  if (removeIndex > -1) {
    activeActions.splice(removeIndex, 1)
  }
  helpers.hideAction(state.value, actionId)
  actionState.currentProgress = 0
}

const getActionById = (actionId) => {
  if (actionId === null || actionId === undefined) return null
  if (ActionDefinitions[actionId]) {
    return {
      type: 'normal',
      def: ActionDefinitions[actionId],
      state: state.value.actions[actionId],
    }
  }

  if (cultivationActions[actionId]) {
    return {
      type: 'cultivation',
      def: cultivationActions[actionId],
      state: state.value.player.knowledge.manuals[actionId],
    }
  }
  console.warn('Action not found for id:', actionId)
  return null
}

// eslint-disable-next-line no-unused-vars
const calculateProgressGain = (actionDef, actionState) => {
  // Placeholder logic for progress gain calculation
  return 2 // Fixed progress gain for now
}

// Process one acton
const processActionTick = (actionId) => {
  const actionData = getActionById(actionId)
  if (!actionData) return

  // eslint-disable-next-line no-unused-vars
  const { def: actionDef, state: actionState, type: actionType } = actionData

  const oldProgress = actionState.currentProgress
  const progressGain = calculateProgressGain(actionDef, actionState)
  actionState.currentProgress += progressGain

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
      handleOneTimeActions(actionId, actionState)
      break
    }
    actionState.currentProgress -= actionState.progressRequired
  }
}

// Populate actions from definitions

for (const id in ActionDefinitions) {
  const actionDef = ActionDefinitions[id]
  if (!state.value.actions[id]) {
    state.value.actions[id] = {
      id: id,
      currentProgress: 0,
      progressRequired: actionDef.base_progress_required || 0,
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
    let loopId = null

    // --- Game Tick Start ---
    const gameTick = () => {
      const activeIds = [...state.value.game.activeActions]
      if (activeIds.length === 0) return

      handleDateProgression()

      activeIds.forEach((actionId) => {
        processActionTick(actionId)
      })
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
    const handleActiveAction = (clickedActionId) => {
      const activeActions = state.value.game.activeActions
      const actionData = getActionById(clickedActionId)
      if (!actionData) return

      const index = activeActions.indexOf(clickedActionId) //find index of action in active actions

      if (index > -1) {
        // Action is already active, so remove it
        activeActions.splice(index, 1)
        resetIfNotContinuous(actionData)
      } else {
        if (actionData.type === 'cultivation') {
          // For cultivation actions, clear all other active actions
          activeActions.forEach((activeId) => {
            const activeActionData = getActionById(activeId)
            resetIfNotContinuous(activeActionData)
          })
          activeActions.length = 0
        }
        activeActions.push(clickedActionId)
        const { maxActiveActions } = state.value.player.upgrades
        if (activeActions.length > maxActiveActions) {
          const removedId = activeActions.shift()
          const removedActionData = getActionById(removedId)
          resetIfNotContinuous(removedActionData)
        }
      }
    }

    const getVisibleActions = computed(() => {
      return (area) => {
        return state.value.game.visibleActions
          .map((id) => getActionById(id))
          .filter((action) => action !== null) // Filter out null actions
          .filter((action) => !area || action.def.area === area) // Filter by area if provideds
          .map((action) => {
            return {
              ...action.def,
              ...action.state,
              type: action.type,
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
      getActionById,
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
