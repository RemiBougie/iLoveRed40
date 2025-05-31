<script setup lang="ts">
import "@/assets/main.css";
import { onMounted, ref } from "vue";
import type { Schema } from "../../amplify/data/resource";
import { generateClient } from "aws-amplify/data";

const client = generateClient<Schema>();

const contactInfo = ref<Schema["Contacts"]["type"]>();
const contacts = ref<Array<Schema["Contacts"]["type"]>>([]);

//const errors: string[] = [];
let error = "";

function listContacts() {
  client.models.Contacts.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      contacts.value = items;
    },
  });
}

let data = {
  name: "",
  email: "",
  phone_number: "",
};

let name = "";
let email = "";
let phone_number = "";
/*
function createContact(data) {
    client.models.Contacts.create({
        name: "",
        email: "",
        phone_number: ""
    })
}
*/

function validateData() {
  if (
    data.name.length == 0 ||
    (data.email.length == 0 && data.phone_number.length == 0)
  ) {
    console.log("error in field input");
    //errors.push("Ruh roh, looks like you forgot a required field.");
    error = "Ruh roh, looks like you forgot a required field.";
  } else {
    error = "";
  }
}

function handleSubmit() {
  //console.log("Form data: ", name, email, phone_number);
  console.log("Form data: ", data);
  validateData();
  if (error.length > 0) {
    console.log("Error: ", error);
  } else {
    const onStart = client.models.Contacts.create({
      name: data.name,
      email: data.email,
      phone_number: data.phone_number,
    }).then(() => {
      listContacts();
    });
  }
}

/*
const onStart = client.models.Contacts.create({
    name: "Remi Bougie",
    email: "remi.bougie@gmail.com",
    phone_number: "612-321-1470"
}).then(() => {
    listContacts();
});
*/

onMounted(() => {
  listContacts();
});
</script>

<template>
  <main>
    <h1>Stay Updated!</h1>
    <form @submit.prevent="handleSubmit">
      <div class="form-input">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model="data.name"
          placeholder="John/Jane Doe"
        />
      </div>
      <div class="form-input">
        <label for="email">Email</label>
        <input
          type="text"
          id="email"
          v-model="data.email"
          placeholder="JDoe@example.com"
        />
      </div>
      <div class="form-input">
        <label for="phone-number">Phone Number</label>
        <input
          type="text"
          id="phone-number"
          v-model="data.phone_number"
          placeholder="612-123-4567"
          pattern="[0-9]{3}-[0-9]{3}-[0-9]{4}"
        />
      </div>
    </form>
    <button type="submit" @click="handleSubmit">Submit</button>
    <div>
      {{ error }}
    </div>
    <ul>
      <li v-for="contact in contacts" :key="contact.id">
        {{ contact.name }}
        {{ contact.email }}
        {{ contact.phone_number }}
      </li>
    </ul>
  </main>
</template>
