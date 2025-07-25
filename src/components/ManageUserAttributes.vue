<script setup lang="ts">
import "@/assets/main.css";
import { onMounted, ref, reactive } from "vue";
import type { Schema } from "../../amplify/data/resource";

import {
  fetchUserAttributes,
  updateUserAttributes,
  type UpdateUserAttributesOutput,
} from "aws-amplify/auth";

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

const message = ref<string>('')

// Don't let the user change their email address.
async function handleUpdateUserAttribute(
  attributes: UserAttributes
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

function validatePhoneNumber(e: Event): boolean {
  const phone = (e.target as HTMLInputElement).value;
  const e164Regex = /^\+?[1-9]\d{1,14}$/;
  if (!e164Regex.test(phone)) {
    message.value = "Phone number must follow the format: +1234567890";
    return false;
  } 
  message.value = ""
  return true;
}

function handleSubmit() {
  // console.log("User Attributes to update:", userAttributes.valueOf());
  handleUpdateUserAttribute(userAttributes);
  message.value = "Your preferences have been updated!"
}

onMounted(async () => {
  try {
    const result = await fetchUserAttributes();
    if (result) {
      userAttributes.email = result["email"] || "";
      userAttributes.name = result["name"] || "";
      userAttributes.phone_number = result["phone_number"] || "";
      if (result["custom:email-notifications"]) {
        userAttributes.email_notifications =
          result["custom:email-notifications"].toLowerCase() === "true" ||
          false;
      }
      if (result["custom:text-notifications"]) {
        userAttributes.text_notifications =
          result["custom:text-notifications"].toLowerCase() === "true" || false;
      }
      // console.log("User attributes from cognito: ", result);
      // console.log("User attributes ref: ", userAttributes);
    }
  } catch (error) {
    console.error(error);
  }
});
</script>

<template>
  <div>
    <h1>Hey {{ userAttributes.name }}!</h1>
    <h2>Manage Your User Settings Below</h2>
    <p>NOTE: Neither email or text services are operational yet.</p>
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
          type="tel"
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
    <p>{{ message }}</p>
    <button type="submit" @click="handleSubmit">Submit</button>
  </div>
</template>

<style></style>
