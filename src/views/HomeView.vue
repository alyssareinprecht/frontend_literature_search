<template>
  <main class="home">
    <div class="content">
      <h1>Welcome to Literature Search</h1>
      <p>Start exploring and discovering technical literature!</p>
      <router-link to="/literature-search">
        <button class="start-button">Start</button>
      </router-link>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: flex-start; /* Align items to the start (top) */
  height: 100vh; /* Full viewport height */
  padding-top: 20px; /* Reduce padding to move content up */
  background-image: url('@/assets/background.png'); /* Path to your image */
  background-size: contain; /* Ensure the image covers the entire background */
  background-position: center; /* Center the image */
  background-repeat: no-repeat; /* Prevent the image from repeating */
}

.content {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem; /* Reduce bottom margin */
  color: #333; /* Dark text color */
}

p {
  font-size: 1.5rem;
  color: #666; /* Medium-dark text color */
  margin-bottom: 0.5rem; /* Reduce bottom margin */
}

.start-button {
  margin-top: 30px; /* Reduce the margin to move the button up */
  padding: 6px 18px; /* Reduce the padding to make the button smaller */
  font-size: 1.1rem; /* Adjust the font size to make the text smaller */
  color: #fff;
  background-color: darkseagreen; /* Button background color */
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: seagreen; /* Darker shade on hover */
}
</style>
