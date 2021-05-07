<template>
  <div class="stat">
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
  },
}
</script>

<style scoped>
.stat {
  background-color: white;
  max-width: 400px;
  margin: 20px auto;
  padding: 15px 20px;
  border-radius: 3px;
  -webkit-box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
  box-shadow: 0px 0px 12px 0px rgba(0, 0, 0, 0.06);
}
.stat > p {
  margin-bottom: 25px;
}
p {
  margin: 0;
  word-wrap: break-word;
  text-align: left;
  font-weight: 600;
}
p:nth-child(2) {
  display: flex;
  align-items: flex-end;
  color: #fc4c02;
}
.stat-text {
  display: flex;
  justify-content: space-between;
}
.stat-text > p {
  max-width: calc(50% - 5px);
}
/* Mobile only CSS */
@media only screen and (max-width: 750px) {
  p {
    font-size: 14px;
  }
}
</style>
