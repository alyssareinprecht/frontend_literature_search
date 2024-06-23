<template>
  <main class="home">
    <div class="content">
      <h1>Welcome to Literature Search</h1>
      <p>Start exploring and discovering new insights.</p>
    </div>
  </main>
</template>

<script setup lang="ts">
</script>

<style scoped>
.home {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh; /* Full viewport height */
}

.content {
  text-align: center;
}

h1 {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #333; /* Dark text color */
}

p {
  font-size: 1.5rem;
  color: #666; /* Medium-dark text color */
}
</style>
