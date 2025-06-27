<script setup lang="ts">
import { onMounted, ref } from "vue";

import Banner from "./components/Banner.vue";
import Todos from "./components/Todos.vue";
import ManageUserAttributes from "./components/ManageUserAttributes.vue";
import UpcomingShows from "./components/UpcomingShows.vue";
import ContactForm from "./components/ContactForm.vue";
import MediaGallery from "./components/MediaGallery.vue";
import UploadMedia from "./components/UploadMedia.vue";
import Bio from "./components/Bio.vue";
// TO-DO: remove everything related to Todos

// import { sayHello } from "amplify/functions/myDynamoDBFunction/resource";

import { Authenticator, useAuthenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";
import { fetchAuthSession, getCurrentUser } from "aws-amplify/auth";

const auth = useAuthenticator();
const isAuthenticated = ref(false);
const isAdmin = ref<boolean>(false);

onMounted(async () => {
  // determine if the user is authenticated and an admin
  try {
    const session = await fetchAuthSession();
    if (session.tokens) {
      isAuthenticated.value = true;
      const payload = session.tokens.accessToken.payload["cognito:groups"];
      if (Array.isArray(payload)) {
        isAdmin.value = payload.includes("ADMINS");
      }
    }
  } catch (error) {
    console.error("Failed to fetch user session:", error);
  }
});

const showAuthenticator = ref(false);

const toggleAuthenticator = () => {
  showAuthenticator.value = !showAuthenticator.value;
};

// const runHelloWorld = () => {
//   const result = sayHello.
// }
</script>

<template>
  <main>
    <!-- Authenticator is a toggling modal that overlays/disappears -->
    <Authenticator
      variation="modal"
      v-if="showAuthenticator || isAuthenticated.valueOf()"
      social-providers="{[google]}"
    >
      <template v-slot:sign-in-header> </template>

      <template v-slot="{ user, signOut }">
        <!-- <h1>Hello {{ user.fullname === "" ? user.username : user.fullname }}!</h1> -->
        <button @click="signOut">Sign Out</button>
      </template>

      <template v-slot:sign-in-footer>
        <div class="auth-footer">
          <button
            @click="toggleAuthenticator"
            class="amplify-button amplify-field-group__control"
          >
            Close
          </button>
        </div>
      </template>

      <template v-slot:sign-up-footer>
        <div class="auth-footer">
          <button
            @click="toggleAuthenticator"
            class="amplify-button amplify-field-group__control"
          >
            Close
          </button>
        </div>
      </template>
    </Authenticator>

    <template v-if="!isAuthenticated.valueOf()">
      <button class="admin-login-btn" @click="toggleAuthenticator">
        Sign In / Sign Up
      </button>
    </template>

    <!-- Banner is the band photo and name across the top -->
    <Banner />

    <!-- Everything under the banner, in order -->
    <div class="contents">
      <ManageUserAttributes v-if="isAuthenticated.valueOf()" />
      <!-- <ContactForm v-if="isAuthenticated.valueOf()"/> -->
      <Bio />
      <UpcomingShows :isAdmin="isAdmin.valueOf()" />

      <!-- to-do: combine the following two components into one -->
      <MediaGallery :isAdmin="isAdmin.valueOf()"/>
      <!-- <UploadMedia v-if="isAdmin.valueOf()" /> -->
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

.close-auth-btn {
  position: relative;
  right: -50%;
  text-align: center;
}

.auth-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 10px;
}
</style>
