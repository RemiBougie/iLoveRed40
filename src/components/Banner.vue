<template>
  <div class="background-image">
    <h2 class="banner-h2">I LOVE</h2>
    <h1 class="banner-h1">Red40</h1>
  </div>
</template>

<style>
.background-image {
  position: sticky; 
  top: 0;
  left: 0;
  width: 100%;
  height: 500px;
  background-image: url('/images/Red40_12Dec2024.jpg');
  background-size: cover;
  background-position: center;
  background-blend-mode: lighten;
  background-color: rgba(255,255,255,0.6);
  z-index: -1;
  justify-content: center;
  align-content: center;
}

.banner-h2 {
  font-family: "Jersey 25", sans-serif;
  font-size: 50px;
  text-align: center;
  margin: 0;
  top: 70%;
}

.banner-h1 {
  font-family: "Jersey 25", sans-serif;
  font-size: 100px;
  text-align: center;
  margin: 0;
  color: red;
  -webkit-text-fill-color: red;
  /*-webkit-text-stroke: 1px black;*/
}
</style>