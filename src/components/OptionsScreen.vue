<template>
  <div>
    <h2>Game Options</h2>
    <div>
      <h3>Display time</h3>
      <select name="time-display" id="time-display" v-model="time">
        <option value="ticks">ticks</option>
        <option value="seconds">seconds</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      time: 'seconds',
    }
  },
}
</script>

<style lang="scss" scoped></style>
