export const manuals = {
  first_true_breath: {
    id: 'first_true_breath',
    title: 'The First True Breath',
    type: 'breakthrough',
    tier: 0,
    description: '',
    onSuccess: (gameState, helpers) => {
      helpers.addStoryEntry(gameState, 'first_true_breath_end')
    },
    onFail: () => {},
  },
}
