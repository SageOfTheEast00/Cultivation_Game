import { ItemDefinitions } from '../data/itemDefinitions.js'

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
    if (!gameState.game.storyHistory.includes(storyId)) {
      gameState.game.storyHistory.push({
        id: storyId,
        date: { ...gameState.game.date },
        read: false,
      })
    }
  },
}
