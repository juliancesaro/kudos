<template>
  <div class="loader-wrapper">
    <div class="lds-dual-ring"></div>
  </div>
</template>

<script>
export default {
  name: 'Loader',
}
</script>

<style scoped>
.loader-wrapper {
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.lds-dual-ring {
  display: inline-block;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 80px;
  height: 80px;
}
.lds-dual-ring:after {
  content: ' ';
  display: block;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: 6px solid #fc4c02;
  border-color: #fc4c02 transparent #fc4c02 transparent;
  animation: lds-dual-ring 1.2s linear infinite;
}
@keyframes lds-dual-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
