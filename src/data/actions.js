export const ActionDefinitions = {
  wake_up: {
    title: 'Wake Up',
    flavor: 'Where am I?',
    visible_by_default: true,
    one_time: true,
    area: 'cave',
    base_progress_required: 40,
    onComplete: (gameState, helpers) => {
      gameState.actions['get_golden_book'].is_visible = true
      gameState.actions['get_mushroom'].is_visible = true
      helpers.addStoryEntry(gameState, 'wake_up_1')
    },
  },
  get_golden_book: {
    title: 'Pick up the Golden Book',
    flavor: 'A mysterious book lies here, its cover shimmering with a golden hue.',
    one_time: true,
    area: 'cave',
    base_progress_required: 50,
    onComplete: (gameState, helpers) => {
      gameState.actions['read_golden_book'].is_visible = true
      gameState.actions['explore_cave'].is_visible = true
      helpers.addStoryEntry(gameState, 'get_golden_book_1')
    },
  },
  read_golden_book: {
    title: 'Read the Golden Book',
    flavor: 'The book radiates a strange energy.',
    area: 'cave',
    is_continuous: true,
    base_progress_required: 10000,
    onProgress: ({ gameState, current, old, helpers }) => {
      if (old < 50 && current >= 50) {
        helpers.addStoryEntry(gameState, 'read_golden_book_start')
      }
      if (old < 100 && current >= 100) {
        helpers.addStoryEntry(gameState, 'read_golden_book_1')
        gameState.actions['first_true_breath'].is_visible = true
      }
    },
    onComplete: () => {},
  },
  explore_cave: {
    title: 'Explore the Cave',
    flavor: 'There might be something interesting deeper inside.',
    area: 'cave',
    is_continuous: true,
    base_progress_required: 2000,
    onProgress: () => {},
    onComplete: () => {},
  },
  get_mushroom: {
    title: 'Pick Mushroom',
    flavor: 'A juicy mushroom grows here.',
    area: 'cave',
    base_progress_required: 10,
    onComplete: (gameState, helpers) => {
      helpers.addItemToInventory(gameState, 'food', 1)
    },
  },
  study_sifting_sand_to_see_the_nature: {
    title: 'Study Sifting Sand to See the Nature',
    flavor: 'Attempt to harness the power of true breath.',
    area: 'cave',
    base_progress_required: 5000,
    onProgress: ({ gameState, current, old, helpers }) => {
      if (old == 0 && current >= 1) {
        helpers.addStoryEntry(gameState, 'study_sifting_sand_to_see_the_nature_start')
      }
    },
    onComplete: (gameState, helpers) => {
      helpers.addStoryEntry(gameState, 'first_true_breath_1')
    },
  },
}
