<template>
  <div class="about">
    <div class="content">
      <h1>About the Literature Browser</h1>
      <p>The Literature Browser is a helpful tool for navigating the world of scholarly publications related to all kinds of technical topics. This platform is designed for ease of exploration, with the use of keywords and tags.</p>
      <p>Upon opening the Dashboard, the window will show various papers for further inspection, ranking, and filtering.</p>
      <p>Select up to five tags to refine your search results in the "Include" section. Tags can be easily rearranged by dragging and dropping them to ensure that your keyword priorities are listed from left (most important) to right (least important).</p>
      <p>To further refine your search, use our tag exclusion feature to filter out papers that contain specific unwanted keywords.</p>
      <p>The search bars for each section will help narrow down and define what tags you want to use.</p>
      <p>The main content area will then display all papers that match your selected tags and filters, prioritized according to your preferences. For quick reference, stacked bar graphs illustrate tag distribution next to the respective paper titles.</p>
      <p>When you find a paper of interest, clicking on its title opens a word cloud on the right, providing a visual representation of its themes and content for further exploration.</p>
      <p>Happy Exploring!</p>
    </div>
  </div>
</template>

<style scoped>
.about {
  width: 100%;
  padding: 20px;
  box-sizing: border-box;
  color: #333; 
}

.content {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #cae3ca; 
  border-radius: 8px; /* Rounded corners */
}

h1 {
  font-size: 2em;
  margin-bottom: 20px;
  color: #2c3e50; 
}

p {
  line-height: 1.6;
  margin-bottom: 15px;
  font-size: 1.1em;
}

@media (min-width: 1024px) {
  .about {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>
