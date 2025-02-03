<script setup lang="ts">
import { ref } from "vue";
import { uploadData } from "aws-amplify/storage";

/*
const file = document.getElementById("file");
const upload = document.getElementById("upload");

upload.addEventListener("click", () => {
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file.files[0]);

  fileReader.onload = async (event) => {
    console.log("Complete File read successfully!", event.target.result);
    try {
      await uploadData({
                data: event.target.result,
                path: file.files[0].name
            });
    } catch (e) {
      console.log("error", e);
    }
  };
});
*/
//const file = document.getElementById("file");
//const upload = document.getElementById("upload");

const fileInput = ref<File | null>(null);
const selectedFile = ref<File | null>(null);

const handleFileUpload = (event: Event) => {
  console.log("handleFileUpload called!");
  const target = event.target as HTMLInputElement;
  //const file = target.files[0];
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
    console.log("Selected file:", selectedFile.value);
  }
};

//const fileReader = new FileReader();
const uploadFile = async () => {
  if (!selectedFile.value) {
    console.log("No file selected");
    return;
  }
  console.log("Uploading file:", selectedFile.value);
  console.log("This is what the entire file object looks like:", selectedFile);

  try {
    await uploadData({
      data: selectedFile.value,
      path: `media/${selectedFile.value.name}`,
    });

    fileInput.value = null;
  } catch (e) {
    console.log("error", e);
  }
};

/*
const uploadMedia = async (event) => {
    console.log("uploadMedia function called!")
  const fileReader = new FileReader();
  fileReader.readAsArrayBuffer(file.files[0]);

  fileReader.onload = async (event) => {
    console.log("Complete File read successfully!", event.target.result);
    try {
      await uploadData({
        data: event.target.result,
        path: `media/${file.files[0].name}`,
      });
    } catch (e) {
      console.log("error", e);
    }
  };
};

/*
const uploadMedia = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  try {
    await uploadData({
      data: event.target.result,
      path: `media/testFile1.jpg`,
    });
  } catch (error) {
    console.error(error);
  }
};
*/
</script>

<template>
  <main>
    <h1>Upload Media</h1>
    <input type="file" @change="handleFileUpload" ref="fileInput" />
    <button @click="uploadFile">Upload</button>
  </main>
</template>
