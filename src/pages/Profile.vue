<template>
  <div class="logout">
    <h1>You're logged in</h1>
    <button @click="logout">Logout</button>
  </div>
</template>

<script>
export default {
  name: 'Profile',
  methods: {
    logout() {
      this.$store.dispatch('removeToken')
    },
  },
}
</script>

<style scoped>
h1 {
  color: #fc4c02;
  font-family: MaisonNeue-Bold, sans-serif;
}
</style>
