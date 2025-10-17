<template>
  <header class="app-header">
    <div class="container">
      <div class="header-content">
        <!-- Logo -->
        <NuxtLink to="/" class="logo" @click.native="clearFilters">
          <h1>🏨 BookingToGo</h1>
        </NuxtLink>

        <!-- Categories Navigation - Minimal Design -->
        <nav class="categories-nav" v-if="categories.length > 0">
          <span 
            class="category-item"
            :class="{ active: selectedCategory === '' }"
            @click="selectCategory('')"
          >
            All
          </span>
          <span 
            v-for="category in categories" 
            :key="category"
            class="category-item"
            :class="{ active: selectedCategory === category }"
            @click="selectCategory(category)"
          >
            {{ formatCategory(category) }}
          </span>
        </nav>

        <!-- Search Box -->
        <div class="search-box">
          <input
            type="text"
            v-model="searchQuery"
            @input="handleSearch"
            placeholder="Search products..."
            class="search-input"
            @keyup.enter="applySearch"
            ref="searchInput"
          />
        </div>

        <!-- Dark Mode Toggle -->
        <button @click="$emit('toggle-dark-mode')" class="theme-toggle">
          {{ darkMode ? '☀️' : '🌙' }}
        </button>
      </div>

      <!-- Active Filters Display -->
      <div class="active-filters" v-if="hasActiveFilters && $route.path === '/'">
        <span class="filters-label">Active filters:</span>
        <span class="filter-tag" v-if="selectedCategory">
          Category: {{ formatCategory(selectedCategory) }}
          <button @click="selectCategory('')" class="remove-filter">×</button>
        </span>
        <span class="filter-tag" v-if="searchQuery">
          Search: "{{ searchQuery }}"
          <button @click="clearSearch" class="remove-filter">×</button>
        </span>
        <button @click="clearAllFilters" class="clear-all">
          Clear All
        </button>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'AppHeader',
  
  props: {
    darkMode: {
      type: Boolean,
      default: false
    },
    categories: {
      type: Array,
      default: () => []
    }
  },
  
  data() {
    return {
      searchQuery: '',
      selectedCategory: '',
      searchTimeout: null
    }
  },
  
  computed: {
    hasActiveFilters() {
      return this.selectedCategory || this.searchQuery
    },
    isHomePage() {
      return this.$route.path === '/'
    }
  },
  
  mounted() {
    // Listen for clear filters event from home page
    this.$root.$on('clear-header-filters', this.clearAllFilters)
  },
  
  beforeDestroy() {
    this.$root.$off('clear-header-filters', this.clearAllFilters)
  },
  
  watch: {
    '$route.path'(newPath) {
      // Clear filters when navigating away from home page
      if (newPath !== '/') {
        this.clearFilters()
      }
    }
  },
  
  methods: {
    handleSearch() {
      clearTimeout(this.searchTimeout)
      this.searchTimeout = setTimeout(() => {
        this.applySearch()
      }, 300)
    },
    
    applySearch() {
      if (this.$route.path !== '/') {
        // Redirect to home page with search query
        this.redirectToHomeWithFilters()
      } else {
        // Emit search event for home page
        this.$emit('search', this.searchQuery)
      }
    },
    
    selectCategory(category) {
      this.selectedCategory = category
      
      if (this.$route.path !== '/') {
        // Redirect to home page with category filter
        this.redirectToHomeWithFilters()
      } else {
        // Emit category change for home page
        this.$emit('category-change', category)
      }
    },
    
    redirectToHomeWithFilters() {
      const query = {}
      
      if (this.searchQuery) {
        query.search = this.searchQuery
      }
      
      if (this.selectedCategory) {
        query.category = this.selectedCategory
      }
      
      // Navigate to home page with query parameters
      this.$router.push({ path: '/', query })
    },
    
    clearSearch() {
      this.searchQuery = ''
      if (this.isHomePage) {
        this.$emit('search', '')
      }
    },
    
    clearAllFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
      if (this.isHomePage) {
        this.$emit('search', '')
        this.$emit('category-change', '')
      }
    },
    
    clearFilters() {
      this.searchQuery = ''
      this.selectedCategory = ''
    },
    
    formatCategory(category) {
      return category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())
    }
  }
}
</script>

<style scoped>
.app-header {
  background-color: var(--secondary-color);
  border-bottom: 1px solid var(--border-color);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
}

.header-content {
  display: flex;
  align-items: center;
  gap: 2rem;
}

/* Logo */
.logo {
  text-decoration: none;
  color: var(--text-color);
  flex-shrink: 0;
}

.logo h1 {
  font-size: 1.5rem;
  font-weight: 700;
  white-space: nowrap;
}

/* Categories Navigation - Minimal Design */
.categories-nav {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  flex: 1;
  justify-content: center;
  font-size: 0.9rem;
}

.category-item {
  color: var(--text-color);
  cursor: pointer;
  transition: all 0.2s ease;
  font-weight: 500;
  white-space: nowrap;
  position: relative;
  padding: 0.2rem 0;
}

.category-item:hover {
  color: var(--primary-color);
}

.category-item.active {
  color: var(--primary-color);
  font-weight: 600;
}

.category-item.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: var(--primary-color);
  border-radius: 1px;
}

/* Search Box */
.search-box {
  flex: 0 1 300px;
  min-width: 200px;
}

.search-input {
  width: 100%;
  padding: 0.6rem 1rem;
  border: 1px solid var(--border-color);
  border-radius: 25px;
  background-color: var(--bg-color);
  color: var(--text-color);
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: var(--primary-color);
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.1);
}

.search-input::placeholder {
  color: var(--text-muted);
}

/* Theme Toggle */
.theme-toggle {
  background: none;
  border: 1px solid var(--border-color);
  padding: 0.5rem;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.1rem;
  transition: all 0.3s ease;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.theme-toggle:hover {
  background-color: var(--border-color);
  transform: scale(1.05);
}

/* Active Filters */
.active-filters {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-color);
  flex-wrap: wrap;
}

.filters-label {
  font-size: 0.85rem;
  color: var(--text-muted);
  font-weight: 500;
}

.filter-tag {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background-color: var(--primary-color);
  color: white;
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  font-weight: 500;
}

.remove-filter {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  font-weight: bold;
  padding: 0;
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.remove-filter:hover {
  background-color: rgba(255, 255, 255, 0.2);
}

.clear-all {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.3rem 0.7rem;
  border-radius: 15px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.clear-all:hover {
  background-color: var(--border-color);
  color: var(--text-color);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .header-content {
    gap: 1.5rem;
  }
  
  .categories-nav {
    gap: 1.2rem;
  }
  
  .search-box {
    flex: 0 1 250px;
  }
}

@media (max-width: 768px) {
  .app-header {
    padding: 0.8rem 0;
  }
  
  .header-content {
    flex-wrap: wrap;
    gap: 1rem;
  }
  
  .logo h1 {
    font-size: 1.3rem;
  }
  
  .categories-nav {
    order: 3;
    flex: 1 1 100%;
    justify-content: flex-start;
    gap: 1rem;
    margin-top: 0.5rem;
    font-size: 0.85rem;
  }
  
  .category-item {
    font-size: 0.85rem;
  }
  
  .search-box {
    flex: 1;
    min-width: auto;
    order: 2;
  }
  
  .theme-toggle {
    order: 1;
    width: 36px;
    height: 36px;
    font-size: 1rem;
  }
  
  .active-filters {
    gap: 0.5rem;
  }
  
  .filter-tag,
  .clear-all {
    font-size: 0.75rem;
    padding: 0.25rem 0.6rem;
  }
}

@media (max-width: 640px) {
  .categories-nav {
    gap: 0.8rem;
    font-size: 0.8rem;
  }
  
  .category-item {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .header-content {
    gap: 0.75rem;
  }
  
  .logo h1 {
    font-size: 1.2rem;
  }
  
  .categories-nav {
    gap: 0.6rem;
    font-size: 0.75rem;
  }
  
  .category-item {
    font-size: 0.75rem;
  }
  
  .search-input {
    padding: 0.5rem 0.8rem;
    font-size: 0.85rem;
  }
  
  .search-input::placeholder {
    font-size: 0.8rem;
  }
  
  .active-filters {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }
  
  .filters-label {
    font-size: 0.8rem;
  }
}

/* Very small screens */
@media (max-width: 360px) {
  .categories-nav {
    gap: 0.4rem;
    font-size: 0.7rem;
  }
  
  .category-item {
    font-size: 0.7rem;
  }
}

/* Dark Mode Improvements */
.dark-mode .category-item:hover {
  color: var(--primary-color);
}

.dark-mode .category-item.active {
  color: var(--primary-color);
}
</style>