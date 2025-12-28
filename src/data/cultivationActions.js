export const cultivationActions = {
  sifting_sand_to_see_the_nature: {
    id: 'sifting_sand_to_see_the_nature',
    title: 'Sifting Sand to See the Nature',
    type: 'breakthrough',
    tier: 0,
    description: '',
    base_progress_required: 100,
    onComplete: (gameState, helpers) => {
      helpers.addStoryEntry(gameState, 'first_true_breath_end')
    },
  },
}
