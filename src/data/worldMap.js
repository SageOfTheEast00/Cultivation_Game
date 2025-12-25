/* eslint-disable no-unused-vars */
// TODO: Implement world map structure and flattening function
const WorldMap = {
  cave: {
    name: 'Cave',
    childeren: {
      lowerCave: {
        name: 'Lower Cave',
        childeren: {},
      },
      upperCave: {
        name: 'Upper Cave',
        childeren: {},
      },
    },
  },
}

const flattenWorldMap = (tree, parent = null, result = {}) => {
  for (const [key, value] of Object.entries(tree)) {
    if (parent) {
      result[key] = parent
    }

    if (value.childeren) {
      flattenWorldMap(value.childeren, key, result)
    }
  }
  return result
}
