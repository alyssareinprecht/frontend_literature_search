<template>
  <div class="container">
    <!-- Header and tags section -->
    <div class="header">
      <h1>Literature Browser</h1>
      <h2>Priority Ranking</h2>
      <div class="tag-container">
        <!-- Include tags with priority -->
        <draggable v-model="includeTags" @end="updatePriorities" class="drag-area" :itemKey="'keyword'">
          <template #item="{ element }">
            <div class="tag" :style="{ backgroundColor: element.color }">
              {{ element.keyword }}
              <button @click="removeIncludeTag(element)" class="btn btn-link p-0">
                <i class="bi bi-x"></i>
              </button>
            </div>
          </template>
        </draggable>
      </div>
      <div class="priority-scale">
        <span>Highest Priority</span>
        <div class="double-arrow"></div>
        <span>Lowest Priority</span>
      </div>
      <div class="exclude-tags">
        <h4>Exclude</h4>
        <div class="tag-container">
          <div class="tag" v-for="tag in excludeTags" :key="tag.keyword" :style="{ backgroundColor: 'gray' }">
            {{ tag.keyword }}
            <button @click="removeExcludeTag(tag)" class="btn btn-link p-0">
              <i class="bi bi-x"></i>
            </button>
          </div>
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
            <div v-else v-for="(item, index) in paginatedItems" :key="item.id" class="priority-row">
              <div class="table-column rank">{{ (currentPage - 1) * itemsPerPage + index + 1 }}</div>
              <div class="table-column title">
                <button class="btn btn-link" type="button" data-toggle="collapse" :data-target="'#collapse' + item.id" aria-expanded="false" aria-controls="collapseExample" @click="toggleWordCloud(item.id)">
                  {{ item.title }}
                </button>
              </div>
              <div class="table-column distributions">
                <!-- Display keyword distributions -->
                <div v-for="(weight, keyword) in sortedKeywordDistributions[index].keywordDistribution" :key="keyword" class="keyword-bar" :style="{ width: weight + '%' }" :class="getKeywordClass(keyword)" :title="weight.toFixed(2) + '%'"></div>
              </div>
              <!-- Word cloud section -->
              <div :id="'collapse' + item.id" class="collapse">
                <div class="word-cloud" v-if="wordClouds[item.id]">
                  <img :src="'data:image/png;base64,' + wordClouds[item.id]" alt="Word Cloud">
                </div>
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
        <!-- Include keyword search input -->
        <div class="keyword-search">
          <input type="text" v-model="includeSearchQuery" @input="resetIncludePage" placeholder="Search include keyword tags...">
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
        <!-- Exclude keyword search input -->
        <div class="keyword-search">
          <input type="text" v-model="excludeSearchQuery" @input="resetExcludePage" placeholder="Search exclude keyword tags...">
        </div>
        <!-- Exclude keyword tags -->
        <div class="keyword-tag-section exclude">
          <h4>Exclude</h4>
          <div class="keyword-tag-row">
            <div v-for="(tag, index) in paginatedExcludeTags" :key="index" class="keyword-tag exclude" @click="toggleExcludeTag(tag)">
              {{ tag }}
            </div>
          </div>
          <!-- Exclude tags pagination controls -->
          <div class="pagination">
            <button @click="prevExcludePage" :disabled="excludeCurrentPage === 1">Previous</button>
            <span>Page {{ excludeCurrentPage }} of {{ excludeTotalPages }}</span>
            <button @click="nextExcludePage" :disabled="excludeCurrentPage === excludeTotalPages">Next</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import draggable from 'vuedraggable';
import { reactive, computed, ref, watch } from 'vue';

export default {
  name: 'LiteratureSearch',
  components: {
    draggable,
  },
  setup() {
    const items = ref([]);
    const allKeywords = ref([]);
    const includeTags = ref([]);
    const excludeTags = ref([]);
    const currentPage = ref(1);
    const itemsPerPage = ref(10);
    const includeSearchQuery = ref('');
    const excludeSearchQuery = ref('');
    const includeCurrentPage = ref(1);
    const includeItemsPerPage = ref(12);
    const excludeCurrentPage = ref(1);
    const excludeItemsPerPage = ref(12);
    const isLoading = ref(false);
    const availableColors = ['lightpink', 'lightskyblue', 'plum', 'moccasin', 'lightgreen'];
    const wordClouds = reactive({});
    const wordCloudsState = reactive({});

    const totalPages = computed(() => Math.ceil(items.value.length / itemsPerPage.value));
    const paginatedItems = computed(() => {
      const startIndex = (currentPage.value - 1) * itemsPerPage.value;
      return items.value.slice(startIndex, startIndex + itemsPerPage.value);
    });
    const paginatedIncludeTags = computed(() => {
      const startIndex = (includeCurrentPage.value - 1) * includeItemsPerPage.value;
      return filteredIncludeTags.value.slice(startIndex, startIndex + includeItemsPerPage.value);
    });
    const paginatedExcludeTags = computed(() => {
      const startIndex = (excludeCurrentPage.value - 1) * excludeItemsPerPage.value;
      return filteredExcludeTags.value.slice(startIndex, startIndex + excludeItemsPerPage.value);
    });
    const filteredIncludeTags = computed(() => {
      return allKeywords.value.filter(tag => tag.toLowerCase().includes(includeSearchQuery.value.toLowerCase()) && !includeTags.value.some(t => t.keyword === tag) && !excludeTags.value.some(t => t.keyword === tag));
    });
    const filteredExcludeTags = computed(() => {
      return allKeywords.value.filter(tag => tag.toLowerCase().includes(excludeSearchQuery.value.toLowerCase()) && !excludeTags.value.some(t => t.keyword === tag) && !includeTags.value.some(t => t.keyword === tag));
    });
    const includeTotalPages = computed(() => Math.ceil(filteredIncludeTags.value.length / includeItemsPerPage.value));
    const excludeTotalPages = computed(() => Math.ceil(filteredExcludeTags.value.length / excludeItemsPerPage.value));
    const sortedKeywordDistributions = computed(() => {
      return paginatedItems.value.map(item => {
        const sortedDistribution = Object.entries(item.keywordDistribution)
          .sort(([keywordA], [keywordB]) => {
            const isKeywordASelected = includeTags.value.some(tag => tag.keyword === keywordA);
            const isKeywordBSelected = includeTags.value.some(tag => tag.keyword === keywordB);
            if (isKeywordASelected && !isKeywordBSelected) {
              return -1;
            } else if (!isKeywordASelected && isKeywordBSelected) {
              return 1;
            } else {
              return 0;
            }
          })
          .reduce((acc, [keyword, weight]) => {
            acc[keyword] = weight;
            return acc;
          }, {});
        return {
          ...item,
          keywordDistribution: sortedDistribution
        };
      });
    });

    const fetchRankedPapers = async () => {
      isLoading.value = true;
      try {
        let response;
        if (includeTags.value.length === 0 && excludeTags.value.length === 0) {
          response = await axios.get('http://localhost:5000/all_papers');
        } else {
          response = await axios.post('http://localhost:5000/rank_papers', {
            include: includeTags.value,
            exclude: excludeTags.value
          });
        }
        items.value = response.data.map((item, index) => {
          const keywordDistribution = Array.isArray(item.keyword_scaled_importance)
            ? item.keyword_scaled_importance.reduce((acc, [keyword, weight]) => {
                acc[keyword] = weight * 100;
                return acc;
              }, {})
            : {};
          return {
            id: item.id || index, // Ensure each item has a unique ID
            title: item.title,
            keywordDistribution,
            word_frequency_dict: item.word_frequency_dict
          };
        });
        if (currentPage.value > totalPages.value) {
          currentPage.value = totalPages.value;
        }
      } catch (error) {
        console.error('Error fetching ranked papers:', error);
      } finally {
        isLoading.value = false;
      }
    };

    const fetchKeywords = async () => {
      try {
        const response = await axios.get('http://localhost:5000/keywords');
        allKeywords.value = response.data;
      } catch (error) {
        console.error('Error fetching keywords:', error);
      }
    };

    const toggleIncludeTag = (tag) => {
      if (excludeTags.value.some(t => t.keyword === tag)) {
        alert('This keyword is already excluded.');
        return;
      }
      const existingTag = includeTags.value.find(t => t.keyword === tag);
      if (existingTag) {
        includeTags.value = includeTags.value.filter(t => t.keyword !== tag);
      } else if (includeTags.value.length < 5) {
        const usedColors = includeTags.value.map(t => t.color);
        const availableColor = availableColors.find(color => !usedColors.includes(color));
        includeTags.value.push({ keyword: tag, priority: 5 - includeTags.value.length, color: availableColor });
      } else {
        alert('You can only include up to 5 keyword tags.');
      }
      updatePriorities();
      fetchRankedPapers();
      resetWordClouds();
    };

    const toggleExcludeTag = (tag) => {
      if (includeTags.value.some(t => t.keyword === tag)) {
        alert('This keyword is already included.');
        return;
      }
      if (excludeTags.value.length >= 15) {
        alert('You can only exclude up to 15 keyword tags.');
        return;
      }
      const existingTag = excludeTags.value.find(t => t.keyword === tag);
      if (existingTag) {
        excludeTags.value = excludeTags.value.filter(t => t.keyword !== tag);
      } else {
        excludeTags.value.push({ keyword: tag });
      }
      fetchRankedPapers();
      resetWordClouds();
    };


    const removeIncludeTag = (tag) => {
      includeTags.value = includeTags.value.filter(t => t.keyword !== tag.keyword);
      updatePriorities();
      fetchRankedPapers();
      resetWordClouds();
    };

    const removeExcludeTag = (tag) => {
      excludeTags.value = excludeTags.value.filter(t => t.keyword !== tag.keyword);
      fetchRankedPapers();
      resetWordClouds();
    };


    const updatePriorities = () => {
      includeTags.value.forEach((tag, index) => {
        tag.priority = 5 - index;
      });
      fetchRankedPapers();
      resetWordClouds();
    };

    const prevPage = () => {
      if (currentPage.value > 1) {
        currentPage.value--;
        resetWordClouds();
      }
    };

    const nextPage = () => {
      if (currentPage.value < totalPages.value) {
        currentPage.value++;
        resetWordClouds();
      }
    };

    const prevIncludePage = () => {
      if (includeCurrentPage.value > 1) {
        includeCurrentPage.value--;
      }
    };

    const nextIncludePage = () => {
      if (includeCurrentPage.value < includeTotalPages.value) {
        includeCurrentPage.value++;
      }
    };

    const prevExcludePage = () => {
      if (excludeCurrentPage.value > 1) {
        excludeCurrentPage.value--;
      }
    };

    const nextExcludePage = () => {
      if (excludeCurrentPage.value < excludeTotalPages.value) {
        excludeCurrentPage.value++;
      }
    };

    const resetIncludePage = () => {
      includeCurrentPage.value = 1;
    };

    const resetExcludePage = () => {
      excludeCurrentPage.value = 1;
    };

    const getKeywordClass = (keyword) => {
      const tag = includeTags.value.find(t => t.keyword === keyword);
      return tag ? tag.color : 'gray';
    };

    const fetchWordCloud = async (id) => {
      const wordFrequencyDict = items.value.find(item => item.id === id).word_frequency_dict;
      try {
        const response = await axios.post('http://localhost:5000/generate_word_cloud', { word_frequency_dict: wordFrequencyDict });
        wordClouds[id] = response.data.word_cloud_image;
        wordCloudsState[id] = true;
      } catch (error) {
        console.error('Error fetching word cloud:', error);
      }
    };

    const toggleWordCloud = (id) => {
      if (wordCloudsState[id]) {
        delete wordClouds[id];
        wordCloudsState[id] = false;
      } else {
        fetchWordCloud(id);
      }
    };

    const resetWordClouds = () => {
      Object.keys(wordClouds).forEach(key => {
        delete wordClouds[key];
        wordCloudsState[key] = false;
      });
    };

    // Watch for changes in currentPage and reset wordClouds
    watch(currentPage, resetWordClouds);

    fetchRankedPapers();
    fetchKeywords();

    return {
      items,
      allKeywords,
      includeTags,
      excludeTags,
      currentPage,
      itemsPerPage,
      includeSearchQuery,
      excludeSearchQuery,
      includeCurrentPage,
      includeItemsPerPage,
      excludeCurrentPage,
      excludeItemsPerPage,
      isLoading,
      availableColors,
      wordClouds,
      wordCloudsState,
      totalPages,
      paginatedItems,
      paginatedIncludeTags,
      paginatedExcludeTags,
      filteredIncludeTags,
      filteredExcludeTags,
      includeTotalPages,
      excludeTotalPages,
      sortedKeywordDistributions,
      fetchRankedPapers,
      fetchKeywords,
      toggleIncludeTag,
      toggleExcludeTag,
      removeIncludeTag,
      removeExcludeTag,
      updatePriorities,
      prevPage,
      nextPage,
      prevIncludePage,
      nextIncludePage,
      prevExcludePage,
      nextExcludePage,
      resetIncludePage,
      resetExcludePage,
      getKeywordClass,
      fetchWordCloud,
      toggleWordCloud,
      resetWordClouds
    };
  }
};
</script>

<style scoped>
.container {
  width: 100%;
  height: 100vh;
  margin: 0;
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
  flex-wrap: wrap; /* Allow wrapping to the next line if there are too many tags */
  gap: 10px;
  margin-top: 10px; /* Add margin to separate from h2 */
}

.drag-area {
  display: flex;
  flex-wrap: wrap; /* Allow wrapping to the next line if there are too many tags */
  gap: 10px;
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

.priority-scale {
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin-top: 10px;
  font-size: 0.9em;
  color: #666;
  align-items: center; /* Center align items vertically */
}

.double-arrow {
  flex-grow: 1;
  height: 2px;
  background: linear-gradient(to right, transparent, black, transparent);
  position: relative;
}

.double-arrow::before,
.double-arrow::after {
  content: '';
  position: absolute;
  top: -5px;
  width: 0;
  height: 0;
  border-style: solid;
}

.double-arrow::before {
  left: 10px;
  border-width: 5px 10px 5px 0;
  border-color: transparent black transparent transparent;
}

.double-arrow::after {
  right: 10px;
  border-width: 5px 0 5px 10px;
  border-color: transparent transparent transparent black;
}

.exclude-tags {
  margin-top: 20px; /* Add margin to separate from the previous section */
}

.content {
  display: flex;
  gap: 20px;
  flex: 1;
}

.priority-table-container {
  flex: 3;
  display: flex;
  flex-direction: column;
  gap: 20px;
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
  padding: 10px;
  text-align: left;
}

.rank {
  width: 10%; /* Adjust width to be smaller */
  font-weight: bold;
}

.title {
  width: 40%; /* Adjust width to take appropriate space */
  cursor: pointer;
}

.distributions {
  width: 50%; /* Adjust width to take appropriate space */
  display: flex;
  align-items: center;
}

.keyword-bar {
  height: 20px;
  margin-right: 5px;
  border-radius: 3px;
}

.keyword-bar.lightpink {
  background-color: lightpink;
}

.keyword-bar.lightskyblue {
  background-color: lightskyblue;
}

.keyword-bar.plum {
  background-color: plum;
}

.keyword-bar.moccasin {
  background-color: moccasin;
}

.keyword-bar.lightgreen {
  background-color: lightgreen;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 10px;
  margin-top: 10px;
}

.pagination button {
  padding: 5px 10px;
  border: none;
  background-color: #007bff;
  color: white;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.pagination button:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.pagination button:hover:not(:disabled) {
  background-color: #0056b3;
}

.keyword-tags {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyword-search {
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
}

.keyword-search input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 5px;
}

.keyword-tag-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.keyword-tag-row {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.keyword-tag {
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.keyword-tag.include {
  background-color: #e0f7fa;
}

.keyword-tag.exclude {
  background-color: #ffebee;
}

.keyword-tag.selected {
  background-color: #ffccbc;
}

.keyword-tag:hover {
  background-color: #d0d0d0;
}

.word-cloud {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 10px;
  background-color: #f9f9f9;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-top: 10px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1); 
  border-top-color: #09f; 
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

.keyword-tag-section.include .pagination {
  margin-bottom: 20px; 
}
</style>



