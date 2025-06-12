<script setup lang="ts">
import "@/assets/main.css";
import { onMounted, reactive, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

defineProps({
  isAdmin: Boolean,
});

const client = generateClient<Schema>();
//To-Do: replace with reference to table
interface UpcomingShow {
  datetime: string;
  venue: string;
  details: string;
}

const formData = reactive<UpcomingShow>({
  datetime: "",
  venue: "",
  details: "",
});

const shows = ref<Array<Schema["Shows"]["type"]>>([]);

function listShows() {
  client.models.Shows.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      shows.value = items;
    },
  });
}

function createShow() {
  client.models.Shows.create({
    datetime: formData.datetime,
    venue: formData.venue,
    details: formData.details,
  }).then(() => {
    listShows();
  });
}

const UpcomingShows = [
  {
    id: "Gig1",
    datetime: "Friday, Jan 24th, 2025, 9:00pm CST",
    venue: "Driftwood Char Bar",
    details:
      "We're coming back to Driftwood Char Bar for another Evening with Red40! Venue is 18+, $5 cash at the door.",
  },
  {
    id: "Gig2",
    datetime: "Friday, Jan 31st, 2025, 8:00pm CST",
    venue: "CanCan Wonderland",
    details: "Doesn't actually exist yet.",
  },
];

const headers = Object.keys(UpcomingShows[0]);

onMounted(() => {
  listShows();
});
</script>

<template>
  <main>
    <div v-if="isAdmin">
      <h1>Add New Show (Admin only)</h1>
      <form @submit.prevent="createShow">
        <label
          >Date and Time
          <input type="text" id="date-time" v-model="formData.datetime" />
        </label>
        <label
          >Venue <input type="text" id="venue" v-model="formData.venue"
        /></label>
        <label
          >Details <input type="text" id="details" v-model="formData.details"
        /></label>
        <button type="submit">Submit</button>
      </form>
    </div>
    
    <h1>Upcoming Shows</h1>
    <!-- <ul>
      <li v-for="show in shows" :key="show.id">
        {{ show.venue }}
      </li>
    </ul> -->
    <table v-if="shows.length">
      <thead>
        <tr>
          <th>Date and Time</th>
          <th>Venue</th>
          <th>Details</th>
          <!-- <th
            v-for="(header, i) in headers"
            :key="`${header}${i}`"
            class="header-item"
          >
            {{ header }}
          </th> -->
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="show in shows"
          :key="`show-${show.id}`"
          class="table-rows"
        >
          <!-- <td>
            {{ show.id }}
          </td> -->
          <td>{{ show.datetime }}</td>
          <td>{{ show.venue }}</td>
          <td>{{ show.details }}</td>
        </tr>
      </tbody>
    </table>
  </main>
</template>

<style>
table {
  border-collapse: collapse;
  width: auto;
  table-layout: auto !important;
  word-wrap: break-word;
  border: 1px solid;
  border-radius: 8px;
}

td {
  padding: 24px;
  text-align: center;
  border-bottom: 1px solid;
}

.header-item {
  padding: 30px 20px;
  font-size: 12px;
  background-color: white;
  text-transform: uppercase;
}

.table-rows {
  background-color: lightpink;
}
/*
.table-rows:nth-child(even) {
    background-color: lightpink;
}

.table-rows:nth-child(odd) {
    background-color: lightgrey;
}
*/
</style>
