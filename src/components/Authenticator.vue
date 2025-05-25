<!-- <script setup lang="ts">
import { ref } from 'vue';

import { Authenticator } from "@aws-amplify/ui-vue";
import "@aws-amplify/ui-vue/styles.css";

import { Amplify } from "aws-amplify";
//import outputs from '../amplify_outputs.json';

//Amplify.configure(outputs);
const showAuthenticator = ref(true);

const toggleAuthenticator = () => {
  showAuthenticator.value = !showAuthenticator.value;
}
</script>




<template>
  <Authenticator variation="modal" v-if="showAuthenticator" social-providers={[google]} >
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
  
</template> -->
