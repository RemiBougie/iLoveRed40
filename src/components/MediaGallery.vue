<script setup lang="ts">
import { ref, onMounted } from "vue";
//import { Storage } from "aws-amplify";
import "@/assets/main.css";
import {
  list,
  getUrl,
  uploadData,
  downloadData,
  remove,
} from "aws-amplify/storage";
import type { Url } from "url";

defineProps({
  isAdmin: Boolean,
});

// THE CODE BELOW IS USED IN THE GALLERY DISPLAY
interface fileWithUrl {
  key: string;
  url: URL;
}
const mediaFiles = ref(<Array<fileWithUrl>>[]);

const fetchMedia = async () => {
  // console.log("mediaFiles BEFORE try statement: ", mediaFiles);
  try {
    //const files = await storage.list('');
    const files = await list({ path: "media/" });
    //const filteredFiles = files.filter((file) => {!file.key.endsWith('/')})
    // console.log("files: ", files);
    // console.log("files.items: ", files.items);
    const filesWithUrls = await Promise.all(
      files.items
        .filter((file) => {
          // console.log(!file.path.endsWith("/"));
          return !file.path.endsWith("/");
        })
        .map(async (file) => ({
          key: file.path,
          url: (await getUrl({ path: file.path })).url,
        }))
    );
    mediaFiles.value = filesWithUrls;
    // console.log("mediaFiles AFTER try statement: ", mediaFiles);
  } catch (error) {
    console.error("Error fetching media: ", error);
  }
};

// THE CODE BELOW IS USED IN THE MEDIA UPLOAD (ONLY RENDERED IF ADMIN IS LOGGED IN)
const fileInput = ref<File | null>(null);
const selectedFile = ref<File | null>(null);

const handleFileSelection = (event: Event) => {
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

  fetchMedia();
};

const handleDelete = async (file: fileWithUrl) => {
  console.log("Delete in progress");
  window.confirm("Are you sure you want to delete this item?");
  try {
    console.log(file);
    await remove({
      path: file.key,
      // bucket: "mediaGallery"
    });
    fetchMedia();
  } catch (error) {
    console.log("Error", error);
  }
};

// THE BELOW CODE IS SETUP CODE THAT RELIES ON ABOVE FUNCTION(S)
onMounted(fetchMedia);
</script>

<template>
  <main>
    <div>
      <h1>Media Gallery</h1>
      <div v-if="mediaFiles.length" class="gallery">
        <div v-for="file in mediaFiles" :key="file.key" class="media-item">
          <!--p>{{ file.url.url }}</p-->
          <!--img :src="file.url.href" alt="Media" class="media" /-->
          <template
            v-if="
              file.key.toLowerCase().endsWith('.mp4') ||
              file.key.toLowerCase().endsWith('.mov')
            "
          >
            <video controls :src="file.url.href" class="media"></video>
          </template>
          <template v-else-if="file.key.toLowerCase() !== 'media/'">
            <img :src="file.url.href" alt="Media" class="media" />
          </template>
          <!-- <button v-if="isAdmin" @click="handleDelete(file)">
            REMOVE ITEM
          </button> -->
        </div>
      </div>

      <div v-if="isAdmin">
        <h1>Upload Media (Admin Only)</h1>
        <input type="file" @change="handleFileSelection" ref="fileInput" />
        <button @click="uploadFile">Upload</button>
      </div>
    </div>
  </main>
</template>

<style>
.gallery {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 16px;
  justify-content: center;
  margin: 10px;
}

.media-item {
  flex: 1 1 auto;
  max-width: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: transparent;
  border-radius: 8px;

  /* text-align: center;
  justify-content: center;
  align-items: center;
  position: relative;
  overflow: hidden; */
}

.media-item:hover {
  transition: 0.2ms;
  transform: scale(2);
  background-color: var(--color-text);
  margin: 10px;
  padding: 10px;
}

.media-item img {
  min-width: 200px;
  max-width: 100%;
  max-height: 200px;
  height: auto;
  width: auto;
  object-fit: contain;
}
.media-item video {
  max-width: 100%;
  max-height: 300px;
  height: auto;
  width: auto;
  object-fit: contain;
  /* aspect-ratio: 4 / 3; */
}

/* .media {
  width: minmax(300px, 1fr);
  height: auto;
  aspect-ratio: 4 / 3;
  object-fit: contain;
  background-color: #000;

} */

@import "lightgallery/css/lightgallery.css";
@import "lightgallery/css/lg-thumbnail.css";
@import "lightgallery/css/lg-zoom.css";
</style>
