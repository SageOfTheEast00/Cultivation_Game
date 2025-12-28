export const ActionDefinitions = {
  wake_up: {
    title: 'Wake Up',
    flavor: 'Where am I?',
    one_time: true,
    area: 'cave',
    base_progress_required: 40,
    onComplete: (gameState, helpers) => {
      helpers.showAction(gameState, 'get_golden_book')
      helpers.showAction(gameState, 'get_mushroom')
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
      helpers.showAction(gameState, 'read_golden_book')
      helpers.showAction(gameState, 'explore_cave')
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
        helpers.showAction(gameState, 'study_sifting_sand_to_see_the_nature')
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
    base_progress_required: 50,
    is_continuous: true,
    one_time: true,
    onProgress: ({ gameState, current, old, helpers }) => {
      if (old == 0 && current >= 1) {
        helpers.addStoryEntry(gameState, 'study_sifting_sand_to_see_the_nature_start')
      }
    },
    onComplete: (gameState, helpers) => {
      helpers.addManualToKnowledge({
        gameState,
        manualId: 'sifting_sand_to_see_the_nature',
        manualData: {
          // Additional specific data for this manual can go here
        },
      })
      helpers.addStoryEntry(gameState, 'study_sifting_sand_to_see_the_nature_complete')
    },
  },
}
