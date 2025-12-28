import { ItemDefinitions } from '../data/itemDefinitions.js'
import { cultivationActions } from '@/data/cultivationActions.js'

export const helpers = {
  addItemToInventory: (gameState, itemId, quantity) => {
    let itemSlot = gameState.player.inventory[itemId]
    if (!itemSlot) {
      const itemDef = ItemDefinitions[itemId]
      if (!itemDef) {
        console.warn(`Item definition for ${itemId} not found!`)
        return
      }
      itemSlot = { id: itemId, name: itemDef.name, quantity: 0 }
    }
    gameState.player.inventory[itemId] = itemSlot
    itemSlot.quantity += quantity
  },

  addStoryEntry: (gameState, storyId) => {
    if (!gameState.game.storyHistory.includes(storyId))
      gameState.game.storyHistory.push({
        id: storyId,
        date: { ...gameState.game.date },
        read: false,
      })
  },

  addManualToKnowledge: ({ gameState, manualId, manualData }) => {
    if (gameState.player.knowledge.manuals[manualId]) {
      console.log(`Manual ${manualId} already exists in knowledge.`)
      return
    }
    gameState.player.knowledge.manuals[manualId] = {
      id: manualId,
      progressRequired: cultivationActions[manualId].base_progress_required || 100,
      currentProgress: 0,
      masteryProgress: 0,
      acquiredDate: { ...gameState.game.date },
      ...manualData, // Additional data about the manual
    }
    console.log(`Added manual ${manualId} to knowledge.`)
  },

  showAction(gameState, actionId) {
    if (!gameState.game.visibleActions.includes(actionId)) {
      gameState.game.visibleActions.push(actionId)
    }
  },

  hideAction(gameState, actionId) {
    const index = gameState.game.visibleActions.indexOf(actionId)
    if (index !== -1) {
      gameState.game.visibleActions.splice(index, 1)
    }
  },
}
