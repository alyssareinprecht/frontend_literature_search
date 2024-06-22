<template>
    <div class="word-cloud-container">
      <h1>{{ title }}</h1>
      <div v-if="isLoading" class="spinner"></div>
      <div v-else>
        <img :src="'data:image/png;base64,' + wordCloud" alt="Word Cloud">
      </div>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'WordClouds',
    props: {
      title: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        wordCloud: '',
        isLoading: true
      };
    },
    async created() {
      try {
        const response = await axios.get(`http://localhost:5000/word_cloud/${this.title}`);
        this.wordCloud = response.data.word_cloud;
      } catch (error) {
        console.error('Error fetching word cloud:', error);
      } finally {
        this.isLoading = false;
      }
    }
  };
  </script>
  
  <style scoped>
  .word-cloud-container {
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
    text-align: center;
  }
  
  .spinner {
    border: 4px solid rgba(0, 0, 0, 0.1);
    border-left-color: #09f;
    border-radius: 50%;
    width: 36px;
    height: 36px;
    animation: spin 1s linear infinite;
    margin: auto;
  }
  
  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
  </style>
  