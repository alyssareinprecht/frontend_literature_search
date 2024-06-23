<template>
  <div class="about">
    <h1>This is an about page</h1>
  </div>
</template>

<style>
.about {
  width: 100%; /* Ensure the about section takes up the full width */
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center; /* Center the content horizontally */
  }
}
</style>
