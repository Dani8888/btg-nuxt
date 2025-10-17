<template>
  <div class="home-page">
    <!-- Hero Banner Section - Hide when filters are active -->
    <section class="hero-banner" v-if="!hasActiveFilters">
      <div class="banner-overlay">
        <div class="container">
          <div class="banner-content">
            <h1 class="banner-title">🏨 BookingToGo</h1>
            <p class="banner-subtitle">Discover Amazing Travel Experiences</p>
            <p class="banner-description">Find the best deals on hotels, flights, and vacation packages</p>
            <div class="banner-cta">
              <button class="cta-button" @click="scrollToProducts">
                Explore Now
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Products Section -->
    <div class="container">
      <section class="products-section" :class="{ 'with-filters': hasActiveFilters }" ref="productsSection">
        <div class="results-info" v-if="hasActiveFilters">
          <p>
            Showing {{ filteredProducts.length }} products
            <span v-if="searchTerm">matching "{{ searchTerm }}"</span>
            <span v-if="selectedCategory">in {{ formatCategory(selectedCategory) }}</span>
          </p>
          <button @click="clearAllFilters" class="clear-filters-btn">
            Clear All Filters
          </button>
        </div>
        
        <ProductList
          :products="filteredProducts"
          :loading="loading"
          :error="error"
          @retry="fetchData"
        />
      </section>
    </div>
  </div>
</template>

<script>
export default {
  name: 'HomePage',
  
  asyncData({ store }) {
    return store.dispatch('fetchProducts')
  },
  
  data() {
    return {
      searchTerm: '',
      selectedCategory: ''
    }
  },
  
  computed: {
    products() {
      return this.$store.state.products
    },
    loading() {
      return this.$store.state.loading
    },
    error() {
      return this.$store.state.error
    },
    hasActiveFilters() {
      return this.searchTerm || this.selectedCategory
    },
    filteredProducts() {
      let filtered = this.products
      
      // Filter by category
      if (this.selectedCategory) {
        filtered = filtered.filter(product => 
          product.category === this.selectedCategory
        )
      }
      
      // Filter by search term
      if (this.searchTerm) {
        const searchLower = this.searchTerm.toLowerCase()
        filtered = filtered.filter(product =>
          product.title.toLowerCase().includes(searchLower) ||
          product.description.toLowerCase().includes(searchLower)
        )
      }
      
      return filtered
    }
  },
  
  mounted() {
    // Listen for search events from header
    this.$nuxt.$on('header-search', this.handleHeaderSearch)
    this.$nuxt.$on('header-category-change', this.handleHeaderCategoryChange)
    
    // Handle URL query parameters
    this.handleURLQueryParams()
  },
  
  beforeDestroy() {
    this.$nuxt.$off('header-search', this.handleHeaderSearch)
    this.$nuxt.$off('header-category-change', this.handleHeaderCategoryChange)
  },
  
  methods: {
    async fetchData() {
      await this.$store.dispatch('fetchProducts')
    },
    
    scrollToProducts() {
      this.$refs.productsSection.scrollIntoView({ behavior: 'smooth' })
    },
    
    handleHeaderSearch(searchTerm) {
      this.searchTerm = searchTerm
      this.updateURL()
    },
    
    handleHeaderCategoryChange(category) {
      this.selectedCategory = category
      this.updateURL()
    },
    
    handleURLQueryParams() {
      const { search, category } = this.$route.query
        
      if (search) {
        this.searchTerm = search
      }
      
      if (category) {
        this.selectedCategory = category
      }
    },
    
    updateURL() {
      const query = {}
      
      if (this.searchTerm) {
        query.search = this.searchTerm
      }
      
      if (this.selectedCategory) {
        query.category = this.selectedCategory
      }
      
      // Update URL without page reload
      this.$router.replace({ 
        path: this.$route.path, 
        query: Object.keys(query).length ? query : undefined 
      })
    },
    
    clearAllFilters() {
      // Clear local state
      this.searchTerm = ''
      this.selectedCategory = ''
      
      // Emit events to clear header state
      this.$nuxt.$emit('header-search', '')
      this.$nuxt.$emit('header-category-change', '')
      
      // Also emit events specifically for AppHeader component
      this.$root.$emit('clear-header-filters')
      
      // Update URL
      this.updateURL()
    },
    
    formatCategory(category) {
      return category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())
    }
  }
}
</script>

<style scoped>
.home-page {
  min-height: 100vh;
}

/* Hero Banner Styles */
.hero-banner {
  background: linear-gradient(135deg, 
    rgba(79, 70, 229, 0.9) 0%,
    rgba(99, 102, 241, 0.8) 50%,
    rgba(139, 92, 246, 0.7) 100%),
    url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  position: relative;
}

.banner-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  display: flex;
  align-items: center;
}

.banner-content {
  text-align: center;
  color: white;
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
}

.banner-title {
  font-size: 4rem;
  font-weight: 800;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s ease-out;
}

.banner-subtitle {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s ease-out 0.2s both;
}

.banner-description {
  font-size: 1.2rem;
  margin-bottom: 2.5rem;
  opacity: 0.9;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.5);
  animation: fadeInUp 0.8s ease-out 0.4s both;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.banner-cta {
  animation: fadeInUp 0.8s ease-out 0.6s both;
}

.cta-button {
  background: linear-gradient(135deg, #ff6b6b, #ee5a24);
  color: white;
  border: none;
  padding: 1.2rem 3rem;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 8px 25px rgba(255, 107, 107, 0.3);
  text-transform: uppercase;
  letter-spacing: 1px;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 12px 35px rgba(255, 107, 107, 0.4);
  background: linear-gradient(135deg, #ff5252, #e74c3c);
}

.cta-button:active {
  transform: translateY(-1px);
}

/* Products Section */
.products-section {
  margin-top: 4rem;
  padding: 2rem 0;
}

.products-section.with-filters {
  margin-top: 2rem;
  padding-top: 1rem;
}

.results-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding: 1rem 1.5rem;
  background-color: var(--secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  flex-wrap: wrap;
  gap: 1rem;
}

.results-info p {
  color: var(--text-color);
  font-weight: 500;
  margin: 0;
  flex: 1;
}

.clear-filters-btn {
  background: none;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.clear-filters-btn:hover {
  background-color: var(--border-color);
  color: var(--text-color);
  transform: translateY(-1px);
}

/* Animations */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* Responsive Design */
@media (max-width: 768px) {
  .results-info {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
  
  .results-info p {
    flex: none;
  }
  
  .clear-filters-btn {
    align-self: flex-end;
  }
  
  .products-section.with-filters {
    margin-top: 1.5rem;
    padding-top: 0.5rem;
  }
}

@media (max-width: 1024px) {
  .hero-banner {
    height: 60vh;
    min-height: 400px;
  }
  
  .banner-title {
    font-size: 3.5rem;
  }
  
  .banner-subtitle {
    font-size: 1.8rem;
  }
}

@media (max-width: 768px) {
  .hero-banner {
    height: 50vh;
    min-height: 350px;
  }
  
  .banner-title {
    font-size: 2.8rem;
    margin-bottom: 0.8rem;
  }
  
  .banner-subtitle {
    font-size: 1.5rem;
    margin-bottom: 0.8rem;
  }
  
  .banner-description {
    font-size: 1.1rem;
    margin-bottom: 2rem;
  }
  
  .cta-button {
    padding: 1rem 2.5rem;
    font-size: 1.1rem;
  }
  
  .products-section {
    margin-top: 3rem;
    padding: 1.5rem 0;
  }
}

@media (max-width: 480px) {
  .hero-banner {
    height: 45vh;
    min-height: 300px;
  }
  
  .banner-title {
    font-size: 2.2rem;
  }
  
  .banner-subtitle {
    font-size: 1.3rem;
  }
  
  .banner-description {
    font-size: 1rem;
    margin-bottom: 1.5rem;
  }
  
  .cta-button {
    padding: 0.9rem 2rem;
    font-size: 1rem;
  }
  
  .banner-content {
    padding: 0 15px;
  }
}

/* Dark Mode Support */
.dark-mode .hero-banner {
  background: linear-gradient(135deg, 
    rgba(45, 55, 72, 0.9) 0%,
    rgba(74, 85, 104, 0.8) 50%,
    rgba(99, 102, 241, 0.7) 100%),
    url('https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80');
}

.dark-mode .banner-overlay {
  background: rgba(0, 0, 0, 0.5);
}
</style>