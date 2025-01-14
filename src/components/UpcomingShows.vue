<script setup lang="ts">
import "@/assets/main.css";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

//To-Do: replace with reference to table
const UpcomingShows = [
  {
    "id": "Gig1",
    "datetime": "Friday, Jan 24th, 2025, 9:00pm CST",
    "venue": "Driftwood Char Bar",
    "details":
      "We're coming back to Driftwood Char Bar for another Evening with Red40! Venue is 18+, $5 cash at the door.",
  },
  {
    "id": "Gig2",
    "datetime": "Friday, Jan 31st, 2025, 8:00pm CST",
    "venue": "CanCan Wonderland",
    "details": "Doesn't actually exist yet.",
  },
];

const headers = Object.keys(UpcomingShows[0]);
</script>

<template>
  <main>
    <h1>Upcoming Shows</h1>
    <table>
      <thead>
        <tr>
          <th
            v-for="(header, i) in headers"
            :key="`${header}${i}`"
            class="header-item"
          >
            {{ header }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="show in UpcomingShows"
          :key="`show-${show.id}`"
          class="table-rows"
        >
          <td
            v-for="(header, i) in headers"
            :key="`${header}-${i}`"
          >
            {{ header }}
          </td>
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
