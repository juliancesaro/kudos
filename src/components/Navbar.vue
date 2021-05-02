<template>
  <div class="navbar">
    <router-link class="navlink" active-class="active" to="/"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-user"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#fff"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <circle cx="12" cy="7" r="4" />
        <path d="M6 21v-2a4 4 0 0 1 4 -4h4a4 4 0 0 1 4 4v2" /></svg
    ></router-link>
    <router-link class="navlink" active-class="active" to="/map"
      ><svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-map"
        width="44"
        height="44"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        stroke="#fff"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="3 7 9 4 15 7 21 4 21 17 15 20 9 17 3 20 3 7" />
        <line x1="9" y1="4" x2="9" y2="17" />
        <line x1="15" y1="7" x2="15" y2="20" /></svg
    ></router-link>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
@media only screen and (min-width: 751px) {
  .navbar {
    position: absolute;
    bottom: 0;
    top: 0;
    width: 130px;
    height: 100%;
  }
}
@media only screen and (max-width: 750px) {
  .navbar {
    position: absolute;
    display: flex;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 70px;
    background-color: #fc4c02;
  }
  .navlink {
    width: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-bottom: 5px;
  }
  .active {
    border-bottom: 5px solid #ffb89a;
    padding-bottom: 0;
  }
}
</style>
