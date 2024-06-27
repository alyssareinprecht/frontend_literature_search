<template>
  <div id="app">
    <header>
      <div class="centered-content">
        <!-- Navigation links -->
        <nav>
          <RouterLink to="/">Home</RouterLink>
          <RouterLink to="/about">About</RouterLink>
          <RouterLink to="/literature-search">Literature Search</RouterLink>
        </nav>
      </div>
    </header>
    <main class="wrapper">
      <!-- RouterView -->
      <RouterView />
    </main>
  </div>
</template>

<style scoped>
/* Base reset for margin and padding */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body {
  width: 100%;
  overflow-x: hidden; /* Prevent horizontal overflow */
}

body {
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  color: #333;
}

header {
  background-color: #8FBC8F; 
  color: #fff;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  z-index: 1000;
  border-radius: 0 0 10px 10px; 
}

.centered-content {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
}

nav {
  display: flex;
  gap: 1.5rem;
}

nav a {
  font-size: 1rem;
  font-weight: 600;
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: 4px; 
  transition: background-color 0.3s, color 0.3s;
}

nav a:hover {
  background-color: #2E8B57; /* hover effect */
}

.wrapper {
  width: auto;
  margin: 70px auto 2rem;
  padding: 1rem;
  background-color: whitesmoke;
  border-radius: 8px; 
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

@media (max-width: 768px) {
  nav {
    flex-direction: column;
    align-items: center;
    gap: 0.5rem;
  }

  nav a {
    width: 100%;
    text-align: center;
  }
}
</style>
