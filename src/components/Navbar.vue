<template>
  <div class="navbar">
    <img class="logo" src="../assets/logo.png" />
    <div class="links-wrapper">
      <router-link class="navlink" active-class="active" to="/"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-user"
          width="34"
          height="34"
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
          width="34"
          height="34"
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
      <router-link class="navlink" active-class="active" to="/stats"
        ><svg
          xmlns="http://www.w3.org/2000/svg"
          class="icon icon-tabler icon-tabler-chart-bar"
          width="34"
          height="34"
          viewBox="0 0 24 24"
          stroke-width="1.5"
          stroke="#fff"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <rect x="3" y="12" width="6" height="8" rx="1" />
          <rect x="9" y="8" width="6" height="12" rx="1" />
          <rect x="15" y="4" width="6" height="16" rx="1" />
          <line x1="4" y1="20" x2="18" y2="20" /></svg
      ></router-link>
    </div>
    <a
      class="github-logo"
      href="https://github.com/juliancesaro/kudos"
      target="_blank"
    >
      <img src="../assets/github_logo.png" />
    </a>
  </div>
</template>

<script>
export default {
  name: 'Navbar',
}
</script>

<style scoped>
.navbar {
  z-index: 1;
}
.navbar {
  position: absolute;
  bottom: 0;
  left: 0;
  background-color: #fc4c02;
  display: flex;
}
.logo {
  width: 40px;
  position: absolute;
  top: 20px;
  left: 20px;
}
.links-wrapper {
  display: flex;
}
.navlink {
  display: flex;
  align-items: center;
  justify-content: center;
}
.github-logo {
  width: 40px;
  height: 40px;
  position: absolute;
  bottom: 20px;
  left: 20px;
}
.github-logo > img {
  width: 100%;
}
/* Desktop only CSS */
@media only screen and (min-width: 750px) {
  .navbar {
    width: 80px;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    -webkit-box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.1);
    box-shadow: 0px 0px 12px 3px rgba(0, 0, 0, 0.1);
  }
  .links-wrapper {
    flex-direction: column;
    justify-content: center;
  }
  .navlink {
    height: 70px;
    width: 80px;
  }
  .active {
    width: 75px;
    border-left: 5px solid #ffb89a;
  }
}
/* Mobile only CSS */
@media only screen and (max-width: 750px) {
  .navbar {
    width: 100%;
    height: 50px;
  }
  .logo {
    display: none;
  }
  .github-logo {
    display: none;
  }
  .links-wrapper {
    width: 100%;
  }
  .navlink {
    width: 50%;
    height: 50px;
  }
  .active {
    padding-top: 5px;
    border-bottom: 5px solid #ffb89a;
  }
}
</style>
