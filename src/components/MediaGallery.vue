<script setup lang="ts">
import { ref, onMounted } from "vue";
//import { Storage } from "aws-amplify";
import "@/assets/main.css";
import { list, getUrl, uploadData, downloadData } from "aws-amplify/storage";
import type { Url } from "url";

interface fileWithUrl {
  key: string;
  url: URL;
}
const mediaFiles = ref(<Array<fileWithUrl>>[]);

const fetchMedia = async () => {
  console.log("mediaFiles BEFORE try statement: ", mediaFiles);
  try {
    //const files = await storage.list('');
    const files = await list({ path: "media/" });
    console.log("files: ", files);
    console.log("files.items: ", files.items);
    const filesWithUrls = await Promise.all(
      files.items.map(async (file) => ({
        key: file.path,
        url: (await getUrl({ path: file.path })).url,
      }))
    );
    mediaFiles.value = filesWithUrls;
    console.log("mediaFiles AFTER try statement: ", mediaFiles);
  } catch (error) {
    console.error("Error fetching media: ", error);
  }
};

onMounted(fetchMedia);
</script>

<template>
  <main>
    <div>
      <h1>Media Gallery</h1>
      <div v-if="mediaFiles.length" class="gallery">
        <div v-for="file in mediaFiles" :key="file.key" class="media=item">
          <!--p>{{ file.url.url }}</p-->
          <!--img :src="file.url.href" alt="Media" class="media" /-->
          <template v-if="file.key.toLowerCase().endsWith('.mp4') || file.key.toLowerCase().endsWith('.mov')">
            <video controls :src="file.url.href" class="media"></video>
          </template>
          <template v-else-if="file.key.toLowerCase() !== 'media/'">
            <img :src="file.url.href" alt="Media" class="media" />
          </template>
        </div>
      </div>
    </div>
  </main>
</template>

<style>
.gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.media-item {
  text-align: center;
}

.media {
  width: 100%;
  height: auto;
  max-height: 300px;
}

.media {
  width: 100%;
  height: auto;
  max-height: 300px;
}
</style>
