<script setup lang="ts">
import { ref } from 'vue';

import Authenticator from "./components/Authenticator.vue";
import Banner from "./components/Banner.vue";
import Todos from "./components/Todos.vue";
import UpcomingShows from "./components/UpcomingShows.vue";
import ContactForm from "./components/ContactForm.vue";
// TO-DO: remove everything related to Todos

const showAuthenticator = ref(false);

const toggleAuthenticator = () => {
  showAuthenticator.value = !showAuthenticator.value;
  //showAuthenticator.value = true;
};
</script>

<template>
  <main>
    <Authenticator v-if="showAuthenticator"/>
    <button class="admin-login-btn" @click="toggleAuthenticator">Admin Login</button>
    <Banner />
    <div class="contents">
      <UpcomingShows />
      <ContactForm />
    </div>
  </main>
</template>

<style>

.admin-login-btn {
  position: absolute;
  top: 0;
  right: 0;
  width: fit-content;
  margin: 5px;
}

</style>