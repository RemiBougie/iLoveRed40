<script setup lang="ts">
import Banner from "./components/Banner.vue";
import Todos from "./components/Todos.vue";
import UpcomingShows from "./components/UpcomingShows.vue";
import ContactForm from "./components/ContactForm.vue";
// TO-DO: remove everything related to Todos
</script>

<template>
  <main>
    <Banner />
    <div class="contents">
      <UpcomingShows />
      <ContactForm />
    </div>
  </main>
</template>
