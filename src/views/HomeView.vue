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
  align-items: flex-start; 
  height: 100vh; 
  padding-top: 20px; 
  background-image: url('@/assets/background.png'); 
  background-size: contain; 
  background-position: center; 
  background-repeat: no-repeat; /* Prevent the image from repeating */
}

.content {
  text-align: center;
  padding: 10px;
  border-radius: 8px;
}

h1 {
  font-size: 3rem;
  margin-bottom: 0.5rem; 
  color: #333; 
}

p {
  font-size: 1.5rem;
  color: #666; 
  margin-bottom: 0.5rem; 
}

.start-button {
  margin-top: 30px; 
  padding: 6px 18px; 
  font-size: 1.1rem; 
  color: #fff;
  background-color: darkseagreen; 
  border: none;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.start-button:hover {
  background-color: seagreen; 
}
</style>
