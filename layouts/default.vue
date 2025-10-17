<template>
  <div id="app" :class="{ 'dark-mode': darkMode }">
    <AppHeader 
      :dark-mode="darkMode" 
      :categories="categories"
      @toggle-dark-mode="toggleDarkMode"
      @search="handleHeaderSearch"
      @category-change="handleHeaderCategoryChange"
    />
    
    <main class="main-content">
      <Nuxt />
    </main>
    
    <AppFooter />
  </div>
</template>

<script>
export default {
  name: 'DefaultLayout',
  
  data() {
    return {
      darkMode: false,
      categories: [],
      headerSearchTerm: '',
      selectedCategory: ''
    }
  },
  
  async mounted() {
    // Check for saved theme preference or respect OS preference
    const savedTheme = localStorage.getItem('darkMode')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    
    if (savedTheme !== null) {
      this.darkMode = JSON.parse(savedTheme)
    } else {
      this.darkMode = prefersDark
    }
    
    // Fetch categories for header
    await this.fetchCategories()
    
    // Handle URL query parameters on page load
    this.handleURLQueryParams()
  },
  
  methods: {
    toggleDarkMode() {
      this.darkMode = !this.darkMode
      localStorage.setItem('darkMode', this.darkMode)
    },
    
    async fetchCategories() {
      try {
        this.categories = await this.$axios.$get('/products/categories')
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    },
    
    handleHeaderSearch(searchTerm) {
      this.headerSearchTerm = searchTerm
      this.$nuxt.$emit('header-search', searchTerm)
    },
    
    handleHeaderCategoryChange(category) {
      this.selectedCategory = category
      this.$nuxt.$emit('header-category-change', category)
    },
    
    handleURLQueryParams() {
      // Only handle query params on home page
      if (this.$route.path === '/') {
        const { search, category } = this.$route.query
        
        if (search) {
          this.headerSearchTerm = search
          this.$nuxt.$emit('header-search', search)
        }
        
        if (category) {
          this.selectedCategory = category
          this.$nuxt.$emit('header-category-change', category)
        }
      }
    }
  },
  
  watch: {
    '$route.query': {
      handler(newQuery) {
        this.handleURLQueryParams()
      },
      deep: true
    }
  }
}
</script>

<style scoped>
.main-content {
  min-height: calc(100vh - 140px);
}

@media (max-width: 768px) {
  .main-content {
    padding: 0;
  }
}
</style>