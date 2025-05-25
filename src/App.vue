<script setup lang="ts">
import { onMounted, ref } from 'vue';

// import Authenticator from "./components/Authenticator.vue";
import Banner from "./components/Banner.vue";
import Todos from "./components/Todos.vue";
import UpcomingShows from "./components/UpcomingShows.vue";
import ContactForm from "./components/ContactForm.vue";
import MediaGallery from "./components/MediaGallery.vue";
import UploadMedia from './components/UploadMedia.vue';
import Bio from "./components/Bio.vue"
// TO-DO: remove everything related to Todos

import { Authenticator, useAuthenticator} from "@aws-amplify/ui-vue"
import "@aws-amplify/ui-vue/styles.css"; 
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

const auth = useAuthenticator();

const isAdmin = ref<boolean>(false)
onMounted(async () => {
  try {
    const session = await fetchAuthSession()
    if (session.tokens) {
      const payload = session.tokens.accessToken.payload['cognito:groups'] || [];
      if (payload) {isAdmin.value = payload.includes('ADMINS');}
    }
  } catch (error) {
    console.error('Failed to fetch user session:', error)
  }
})

// const { username, userId, signInDetails } = await getCurrentUser()
// const session = await fetchAuthSession();
// const groups = session.tokens.accessToken.payload('cognito:groups') || [];
// console.log("Users's groups: ", groups)

const showAuthenticator = ref(false);

const toggleAuthenticator = () => {
  showAuthenticator.value = !showAuthenticator.value;
  //showAuthenticator.value = true;
};

// const isAuthenticated = ref(false);
// //const userDetails = await getCurrentUser();
// const toggleAuthentication = () => {
//   isAuthenticated.value = !isAuthenticated.value;
// }

</script>





<template>
  <main>
    <!-- Authenticator is a toggling modal that overlays/disappears -->
    <Authenticator variation="modal" v-if="showAuthenticator || auth.route === 'authenticated'" social-providers={[google]} >
      <template v-slot:sign-in-header>
      </template>

      <template v-slot="{ user, signOut }">
        <h1>Hello {{ user.username }}!</h1>
        <button @click="signOut">Sign Out</button>
      </template>

      <template v-slot:sign-in-footer>
        <button @click="toggleAuthenticator">Close</button>
      </template>
    </Authenticator>

    <template v-if="auth.route !== 'authenticated'">
      <button class="admin-login-btn" @click="toggleAuthenticator">Sign In / Sign Up</button>
    </template>
    

    <!-- Banner is the band photo and name across the top -->
    <Banner />

    <!-- Everything under the banner, in order -->
    <div class="contents">
      <Bio />
      <UpcomingShows />
      <ContactForm />
      <MediaGallery />
      <UploadMedia v-if="isAdmin.valueOf()"/>
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