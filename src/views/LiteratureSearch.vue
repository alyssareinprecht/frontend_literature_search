<template>
  <div class="container">
    <!-- Header and tags section -->
    <div class="header">
      <h1>Literature Browser</h1>
      <h2>Priority Ranking</h2>
      <div class="tag-container">
        <!-- Include tags with priority -->
        <div class="tag" v-for="(tag, index) in includeTags" :key="index">
          {{ tag.keyword }} (Priority: {{ tag.priority }})
          <button @click="removeIncludeTag(tag)">Remove</button>
          <button @click="increasePriority(tag)">↑</button>
          <button @click="decreasePriority(tag)">↓</button>
        </div>
      </div>
    </div>

    <!-- Main content section -->
    <div class="content">
      <!-- Priority table -->
      <div class="priority-table-container">
        <div class="priority-table">
          <div class="priority-header">
            <div class="table-column rank">Rank</div>
            <div class="table-column title">Document Title</div>
            <div class="table-column distributions">Key Distributions</div>
          </div>
          <div class="priority-body">
            <!-- Display loading spinner -->
            <div v-if="isLoading" class="spinner"></div>
            <!-- Display ranked papers -->
            <div v-else v-for="(item, index) in paginatedItems" :key="index" class="priority-row">
              <div class="table-column rank">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
              <div class="table-column title">{{ item.title }}</div>
              <div class="table-column distributions">
                <!-- Display keyword distributions -->
                <div class="keyword-bar orange" :style="{ width: item.keywordDistribution.orange + '%' }"></div>
                <div class="keyword-bar blue" :style="{ width: item.keywordDistribution.blue + '%' }"></div>
                <div class="keyword-bar green" :style="{ width: item.keywordDistribution.green + '%' }"></div>
                <div class="keyword-bar red" :style="{ width: item.keywordDistribution.red + '%' }"></div>
              </div>
            </div>
          </div>
        </div>

        <!-- Pagination controls -->
        <div class="pagination">
          <button @click="prevPage" :disabled="currentPage === 1">Previous</button>
          <span>Page {{ currentPage }} of {{ totalPages }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages">Next</button>
        </div>
      </div>

      <!-- Keyword tags section -->
      <div class="keyword-tags">
        <h3>Keyword Tags</h3>
        <!-- Keyword search input -->
        <div class="keyword-search">
          <input type="text" v-model="searchQuery" @input="resetIncludePage" placeholder="Search keyword tags...">
        </div>
        <!-- Include keyword tags -->
        <div class="keyword-tag-section include">
          <h4>Include</h4>
          <div class="keyword-tag-row">
            <div v-for="(tag, index) in paginatedIncludeTags" :key="index" class="keyword-tag include" @click="toggleIncludeTag(tag)">
              {{ tag }}
            </div>
          </div>
          <!-- Include tags pagination controls -->
          <div class="pagination">
            <button @click="prevIncludePage" :disabled="includeCurrentPage === 1">Previous</button>
            <span>Page {{ includeCurrentPage }} of {{ includeTotalPages }}</span>
            <button @click="nextIncludePage" :disabled="includeCurrentPage === includeTotalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  name: 'LiteratureSearch',
  data() {
    return {
      items: [],
      allKeywords: [],
      includeTags: [],
      excludeTags: [],
      currentPage: 1,
      itemsPerPage: 15,
      searchQuery: '',
      includeCurrentPage: 1,
      includeItemsPerPage: 12,
      excludeCurrentPage: 1,
      excludeItemsPerPage: 12,
      isLoading: false, // Add loading state
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.items.length / this.itemsPerPage);
    },
    paginatedItems() {
      const startIndex = (this.currentPage - 1) * this.itemsPerPage;
      return this.items.slice(startIndex, startIndex + this.itemsPerPage);
    },
    paginatedIncludeTags() {
      const startIndex = (this.includeCurrentPage - 1) * this.includeItemsPerPage;
      return this.filteredIncludeTags.slice(startIndex, startIndex + this.includeItemsPerPage);
    },
    filteredIncludeTags() {
      return this.allKeywords.filter(tag => tag.toLowerCase().includes(this.searchQuery.toLowerCase()));
    },
    includeTotalPages() {
      return Math.ceil(this.filteredIncludeTags.length / this.includeItemsPerPage);
    },
  },
  methods: {
    async fetchRankedPapers() {
      this.isLoading = true; // Set loading state to true
      try {
        let response;
        if (this.includeTags.length === 0 && this.excludeTags.length === 0) {
          response = await axios.get('http://localhost:5000/all_papers');
        } else {
          response = await axios.post('http://localhost:5000/rank_papers', {
            include: this.includeTags,
            exclude: this.excludeTags
          });
        }
        this.items = response.data.map(item => ({
          title: item.title,
          keywordDistribution: {
            orange: item.word_frequency_dict.orange || 0,
            blue: item.word_frequency_dict.blue || 0,
            green: item.word_frequency_dict.green || 0,
            red: item.word_frequency_dict.red || 0
          }
        }));
        // Adjust current page if it exceeds total pages
        if (this.currentPage > this.totalPages) {
          this.currentPage = this.totalPages;
        }
      } catch (error) {
        console.error('Error fetching ranked papers:', error);
      } finally {
        this.isLoading = false; // Set loading state to false
      }
    },
    async fetchKeywords() {
      try {
        const response = await axios.get('http://localhost:5000/keywords');
        this.allKeywords = response.data;
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    },
    toggleIncludeTag(tag) {
      const existingTag = this.includeTags.find(t => t.keyword === tag);
      if (existingTag) {
        this.includeTags = this.includeTags.filter(t => t.keyword !== tag);
      } else if (this.includeTags.length < 5) {
        this.includeTags.push({ keyword: tag, priority: 5 - this.includeTags.length });
      } else {
        alert('You can only include up to 5 keyword tags.');
      }
      this.adjustPriorities();
      this.fetchRankedPapers();
    },
    removeIncludeTag(tag) {
      this.includeTags = this.includeTags.filter(t => t.keyword !== tag.keyword);
      this.adjustPriorities();
      this.fetchRankedPapers();
    },
    adjustPriorities() {
      const numTags = this.includeTags.length;
      this.includeTags.forEach((tag, index) => {
        tag.priority = 5 - index;
      });
    },
    increasePriority(tag) {
      const index = this.includeTags.indexOf(tag);
      if (index > 0) {
        const temp = this.includeTags[index - 1];
        this.includeTags[index - 1] = tag;
        this.includeTags[index] = temp;
        this.adjustPriorities();
        this.fetchRankedPapers();
      }
    },
    decreasePriority(tag) {
      const index = this.includeTags.indexOf(tag);
      if (index < this.includeTags.length - 1) {
        const temp = this.includeTags[index + 1];
        this.includeTags[index + 1] = tag;
        this.includeTags[index] = temp;
        this.adjustPriorities();
        this.fetchRankedPapers();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevIncludePage() {
      if (this.includeCurrentPage > 1) {
        this.includeCurrentPage--;
      }
    },
    nextIncludePage() {
      if (this.includeCurrentPage < this.includeTotalPages) {
        this.includeCurrentPage++;
      }
    },
    resetIncludePage() {
      this.includeCurrentPage = 1;
    }
  },
  watch: {
    searchQuery() {
      this.resetIncludePage();
    }
  },
  created() {
    this.fetchRankedPapers();
    this.fetchKeywords();
  },
};
</script>

<style scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.header {
  display: flex;
  flex-direction: column; /* Change to column to stack elements vertically */
  align-items: flex-start; /* Align items to the start */
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.5em;
  margin: 0;
  color: #333;
}

.header h2 {
  font-size: 1.5em;
  margin: 10px 0 0 0; /* Add margin to separate from h1 */
  color: #666;
}

.tag-container {
  display: flex;
  gap: 10px;
  margin-top: 10px; /* Add margin to separate from h2 */
}

.tag {
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.tag:hover {
  background-color: #d0d0d0;
}

.content {
  display: flex;
  gap: 20px;
}

.priority-table-container {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.priority-table {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.priority-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
}

.priority-body {
  overflow-y: auto;
}

.priority-row {
  display: flex;
  align-items: center;
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.table-column {
  flex: 1;
  padding: 10px;
  text-align: left;
}

.rank {
  width: 10%;
  font-weight: bold;
}

.title {
  width: 50%;
}

.distributions {
  width: 40%;
  display: flex;
  align-items: center;
}

.keyword-bar {
  height: 20px;
  margin-right: 5px;
  border-radius: 3px;
}

.keyword-bar.orange {
  background-color: orange;
}

.keyword-bar.blue {
  background-color: blue;
}

.keyword-bar.green {
  background-color: green;
}

.keyword-bar.red {
  background-color: red;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 10px;
}

.pagination button {
  margin: 0 10px;
  padding: 5px 10px;
  cursor: pointer;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  transition: background-color 0.3s;
}

.pagination button:hover {
  background-color: #0056b3;
}

.pagination button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.keyword-tags {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.keyword-search input {
  width: 100%;
  padding: 10px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.keyword-tag-section {
  border: 1px solid #ccc;
  border-radius: 8px;
  overflow: hidden;
  background-color: #fff;
}

.keyword-tag-row {
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  gap: 5px;
}

.keyword-tag {
  background-color: #e0e0e0;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.keyword-tag.include {
  background-color: lightgreen;
}

.keyword-tag.exclude {
  background-color: lightcoral;
}

.keyword-tag:hover {
  background-color: #d0d0d0;
}

.keyword-tag-section h4 {
  margin: 0;
  padding: 10px;
  background-color: #f0f0f0;
  border-bottom: 1px solid #ccc;
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
