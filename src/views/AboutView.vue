<!-- YoutubeEmbed.vue -->
<template>
  <div class="video-container">
    <iframe
      width="560"
      height="315"
      :src="videoUrl"
      frameborder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowfullscreen
    ></iframe>
  </div>
</template>

<script>
export default {
  computed: {
    videoUrl() {
      return `https://www.youtube-nocookie.com/embed/Ly_gPiceq1Y`;
      // return "https://youtu.be/Ly_gPiceq1Y?si=gRn7bieutZL05upB";
    },
  },
};
</script>

<style>
.video-container {
  width: 100%;
  max-width: 500px;
  margin: auto;
  position: relative;
  overflow: hidden;
}

.video-container::before {
  content: "";
  display: block;
  padding-top: 56.25%; /* 16:9 aspect ratio */
}

.video-container iframe {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  border: 0;
}
</style>
