<script setup lang="ts">
import { ref } from 'vue';

import Authenticator from "./components/Authenticator.vue";
import Banner from "./components/Banner.vue";
import Todos from "./components/Todos.vue";
import UpcomingShows from "./components/UpcomingShows.vue";
import ContactForm from "./components/ContactForm.vue";
import MediaGallery from "./components/MediaGallery.vue";
import UploadMedia from './components/UploadMedia.vue';
// TO-DO: remove everything related to Todos

import { getCurrentUser } from 'aws-amplify/auth';

const showAuthenticator = ref(false);

const toggleAuthenticator = () => {
  showAuthenticator.value = !showAuthenticator.value;
  //showAuthenticator.value = true;
};

const isAuthenticated = ref(false);
//const userDetails = await getCurrentUser();
const toggleAuthentication = () => {
  isAuthenticated.value = !isAuthenticated.value;
}

</script>

<template>
  <main>
    <Authenticator v-if="showAuthenticator"/>
    <button class="admin-login-btn" @click="toggleAuthenticator">Admin Login</button>
    <Banner />
    <div class="contents">
      <UpcomingShows />
      <ContactForm />
      <MediaGallery />
      <UploadMedia />
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