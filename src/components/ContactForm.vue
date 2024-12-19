<script setup lang="ts">
import '@/assets/main.css';
import { onMounted, ref } from 'vue';
import type { Schema } from '../../amplify/data/resource';
import { generateClient } from 'aws-amplify/data';

const client = generateClient<Schema>();

const contactInfo = ref<Schema['Contacts']["type"]>();
const contacts = ref<Array<Schema['Contacts']["type"]>>([]);

function listContacts() {
    client.models.Contacts.observeQuery().subscribe({
        next: ({ items, isSynced }) => {
            contacts.value = items
        },
    });
}

/*
function createContact(data) {
    client.models.Contacts.create({
        name: "",
        email: "",
        phone_number: ""
    })
}
*/

const onStart = await client.models.Contacts.create({
    name: "Remi Bougie",
    email: "remi.bougie@gmail.com",
    phone_number: "612-321-1470"
}).then(() => {
    listContacts();
});

onMounted(() => {
    listContacts();
});

</script>

<template>
  <main>
    <h1>Stay Updated!</h1>
    <form>
      <div>
        <label for="name">Name:</label>
        <input type="text" id="name" />
      </div>
    </form>
    <ul>
      <li 
        v-for="contact in contacts" 
        :key="contact.id">
        {{ contact.name }}
        {{ contact.email }}
        {{ contact.phone_number }}
      </li>
    </ul>
  </main>
</template>
