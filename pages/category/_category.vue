<template>
  <div class="category-page">
    <div class="container">
      <nav class="breadcrumb">
        <NuxtLink to="/" class="breadcrumb-link">Home</NuxtLink>
        <span class="breadcrumb-separator">/</span>
        <span class="breadcrumb-current">{{ formattedCategory }}</span>
      </nav>

      <div class="category-header">
		  <h1 class="category-title dark-mode-text">{{ formattedCategory }}</h1>
		  <p class="category-count text-muted">{{ categoryProducts.length }} products found</p>
		</div>

      <ProductList
        :products="categoryProducts"
        :loading="loading"
        :error="error"
        @retry="fetchData"
      />
    </div>
  </div>
</template>

<script>
export default {
  name: 'CategoryPage',
  
   asyncData({ store, params, redirect }) {
    redirect(301, { path: '/', query: { category: params.category } })
  },
  
  data() {
    return {
      category: this.$route.params.category
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
    categoryProducts() {
      if (!this.category) return []
      return this.products.filter(product => 
        product.category === this.category
      )
    },
    formattedCategory() {
      if (!this.category) return ''
      return this.category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())
    }
  },
  
  methods: {
    async fetchData() {
      await this.$store.dispatch('fetchProducts')
    }
  },
  
  watch: {
    '$route.params.category': {
      handler(newCategory) {
        this.category = newCategory
      },
      immediate: true
    }
  }
}
</script>

<style scoped>
.category-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  font-size: 0.875rem;
}

.breadcrumb-link {
  color: var(--primary-color);
  text-decoration: none;
  transition: color 0.3s ease;
  font-weight: 500;
}

.breadcrumb-link:hover {
  text-decoration: underline;
}

.breadcrumb-separator {
  color: var(--text-muted);
}

.breadcrumb-current {
  color: var(--text-color);
  font-weight: 500;
}

.category-header {
  text-align: center;
  margin-bottom: 3rem;
  padding: 2rem 0;
}

.category-title {
  font-size: 2.5rem;
  font-weight: 800;
  margin-bottom: 0.5rem;
  color: var(--text-color);
}

.category-count {
  font-size: 1.1rem;
  color: var(--text-muted);
  font-weight: 500;
}

@media (max-width: 768px) {
  .category-page {
    padding: 1rem 0;
  }
  
  .category-header {
    margin-bottom: 2rem;
    padding: 1rem 0;
  }
  
  .category-title {
    font-size: 2rem;
  }
  
  .category-count {
    font-size: 1rem;
  }
}
</style>