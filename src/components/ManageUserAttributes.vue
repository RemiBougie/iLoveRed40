<script setup lang="ts">
import "@/assets/main.css";
import { onMounted, ref, reactive } from "vue";
import type { Schema } from "../../amplify/data/resource";

import {
  fetchUserAttributes,
  updateUserAttributes,
  type UpdateUserAttributesOutput,
} from "aws-amplify/auth";

// const userAttributes = ref<{
//   fullname: string;
//   email: string;
//   phone_number: string;
//   email_notifications: boolean;
//   text_notifications: boolean;
// }>({
//   fullname: "",
//   email: "",
//   phone_number: "",
//   email_notifications: false,
//   text_notifications: false,
// });
interface UserAttributes {
  name: string;
  email: string;
  phone_number: string;
  email_notifications: boolean;
  text_notifications: boolean;
}
const userAttributes = reactive<UserAttributes>({
  name: "",
  email: "",
  phone_number: "",
  email_notifications: false,
  text_notifications: false,
});

// Don't let the user change their email address.
async function handleUpdateUserAttribute(
    attributes: UserAttributes
//   fullname: string,
//   phone_number: string,
//   email_notifications: boolean,
//   text_notifications: boolean
) {
  try {
    const output = await updateUserAttributes({
      userAttributes: {
        name: attributes.name,
        phone_number: attributes.phone_number,
        "custom:email-notifications": String(attributes.email_notifications),
        "custom:text-notifications": String(attributes.text_notifications),
      },
    });
  } catch (error) {
    console.log(error);
  }
}

function validatePhoneNumber() {
  console.log("This will validate the phone number...");
}

function handleSubmit() {
  console.log("User Attributes to update:", userAttributes.valueOf());
  handleUpdateUserAttribute(userAttributes)
}

onMounted(async () => {
  try {
    const result = await fetchUserAttributes();
    if (result) {
      userAttributes.email = result["email"] || "";
      userAttributes.name = result["name"] || "";
      userAttributes.phone_number = result["phone_number"] || "";
      userAttributes.email_notifications =
        Boolean(result["custom:email-notifications"]) || false;
      userAttributes.text_notifications =
        Boolean(result["custom:text-notifications"]) || false;
      //   const result_mapping = {
      //     email: result["email"] || "",
      //     fullname: result["fullname"] || "",
      //     phone_number: result["phone_number"] || "",
      //     email_notifications: Boolean(result["custom:email-notifications"]) || false,
      //     text_notifications: Boolean(result["custom:text-notifications"]) || false,
      //   }
      //   userAttributes = result_mapping;

      //   const email = result["email"] || "";
      //   const fullname = result["fullname"] || "not set";
      //   const phone_number = result["phone_number"] || "not set";
      //   const email_notifications =
      //     result["custom:email-notifications"] || "not set";
      //   const text_notifications =
      //     result["custom:text-notifications"] || "not set";
      //   console.log("result of fetchUserAttributes:", result);
      //   console.log("email:", email);
      // console.log("fullname", fullname);
      // console.log("phone_number", phone_number);
      // console.log("email_notifications", email_notifications);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div>
    <h1>Manage Your User Settings!</h1>
    <!-- <p>{{ userAttributes.valueOf() }}</p> -->
    <form @submit.prevent="handleSubmit">
      <div class="form-input">
        <label for="name">Name</label>
        <input
          type="text"
          id="name"
          v-model="userAttributes.name"
          placeholder="John/Jane Doe"
        />
      </div>
      <div class="form-input">
        <label for="email">Email (Can't change)</label>
        <input
          type="text"
          id="email"
          v-model="userAttributes.email"
          placeholder="JDoe@example.com"
          :disabled="true"
        />
      </div>
      <div class="form-input">
        <label for="email-notifications">Receive Email Notifications</label>
        <input
          type="checkbox"
          id="email-notifications"
          v-model="userAttributes.email_notifications"
        />
      </div>
      <div class="form-input">
        <label for="phone-number">Phone Number</label>
        <input
          type="text"
          id="phone-number"
          v-model="userAttributes.phone_number"
          @input="validatePhoneNumber"
          placeholder="+16121234567"
          pattern="^\+[1-9]\d{1,14}"
        />
      </div>
      <div class="form-input">
        <label for="text-notifications">Receive Text Notifications</label>
        <input
          type="checkbox"
          id="text-notifications"
          v-model="userAttributes.text_notifications"
        />
      </div>
    </form>
    <button type="submit" @click="handleSubmit">Submit</button>
  </div>
</template>

<style></style>
