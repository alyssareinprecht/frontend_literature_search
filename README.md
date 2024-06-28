## Vue.js Frontend README

### Prerequisites

Before running the application, ensure you have the following software installed:
* Node.js (version 12.x or later)
* npm (version 6.x or later) or yarn

### Installation

1. **Use the provided folder OR clone the repository:**
    ```bash
    git clone https://github.com/alyssareinprecht/frontend_literature_search
    cd frontend_literature_search
    ```

2. **Install dependencies:**
   ```bash
    npm install axios vuedraggable vue
    ```
    ### Dependencies

    - `axios` for making HTTP requests.
    - `vuedraggable` for drag-and-drop functionality.
    - `vue` for the core framework.

### Running the Project

1. **Start the development server:**
    ```bash
    npm run dev
    ```
2. **Access the application:**
  Open your browser and navigate to http://localhost:5173 or click directly on the link provided in the terminal after running the aforementioned command. 

### API Endpoints

Ensure the backend server is running and accessible at `http://localhost:5000`. The application interacts with the following API endpoints:

* `GET /all_papers` - Fetches all papers when no tags are selected.
* `POST /rank_papers` - Fetches ranked papers based on selected include and exclude tags.
* `GET /keywords` - Fetches all available keywords.
* `POST /generate_word_cloud` - Generates a word cloud based on the provided word frequency dictionary.
