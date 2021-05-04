<template>
  <div :class="`stat${show ? ' show' : ' hide'}`">
    <p>{{ stat.emoji }}</p>
    <div class="stat-text">
      <p>{{ stat.name }}</p>
      <p>{{ stat.val }}</p>
    </div>
  </div>
</template>

<script>
export default {
  name: 'StatCard',
  props: {
    stat: Object,
    show: Boolean,
  },
}
</script>

<style scoped>
.stat {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: white;
  max-width: 400px;
  margin: 10px auto;
  padding: 15px 20px;
  border-radius: 3px;
  height: 125px;
  transition: all 1s;
}
.show {
  position: relative;
  -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
}
.hide {
  position: absolute;
  top: 0;
  -webkit-box-shadow: none;
  z-index: -1;
  box-shadow: none;
}
.stat > p {
  flex: 1;
  margin: 0;
}
p {
  word-wrap: break-word;
  text-align: left;
  font-weight: 600;
  margin: 15px 0 0 0;
}
p:nth-child(2) {
  color: #fc4c02;
}
.stat-text {
  flex: 2;
  display: flex;
  justify-content: space-between;
}
.stat-text > p {
  max-width: calc(50% - 5px);
}
</style>
