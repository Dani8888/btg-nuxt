<template>
  <div class="product-list">
    <div v-if="loading" class="loading-container">
      <LoadingSpinner />
    </div>
    
    <div v-else-if="error" class="error-container">
      <p class="error-message">{{ error }}</p>
      <button @click="$emit('retry')" class="retry-button">
        Try Again
      </button>
    </div>
    
    <template v-else>
      <div class="products-grid">
        <ProductCard
          v-for="product in displayedProducts"
          :key="product.id"
          :product="product"
        />
      </div>
      
      <div v-if="displayedProducts.length === 0" class="no-products">
        <p>No products found matching your criteria.</p>
      </div>
      
      <div v-if="!isInfiniteScroll && totalPages > 1" class="pagination">
		  <button
			@click="prevPage"
			:disabled="currentPage === 1"
			class="pagination-button"
		  >
			Previous
		  </button>
		  
		  <span class="page-info dark-mode-text">
			Page {{ currentPage }} of {{ totalPages }}
		  </span>
		  
		  <button
			@click="nextPage"
			:disabled="currentPage === totalPages"
			class="pagination-button"
		  >
			Next
		  </button>
		</div>
    </template>
  </div>
</template>

<script>
export default {
  name: 'ProductList',
  
  props: {
    products: {
      type: Array,
      default: () => []
    },
    loading: {
      type: Boolean,
      default: false
    },
    error: {
      type: String,
      default: null
    },
    isInfiniteScroll: {
      type: Boolean,
      default: false
    },
    itemsPerPage: {
      type: Number,
      default: 8
    }
  },
  
  data() {
    return {
      currentPage: 1
    }
  },
  
  computed: {
    totalPages() {
      return Math.ceil(this.products.length / this.itemsPerPage)
    },
    
    displayedProducts() {
      if (this.isInfiniteScroll) {
        return this.products.slice(0, this.currentPage * this.itemsPerPage)
      }
      
      const start = (this.currentPage - 1) * this.itemsPerPage
      const end = start + this.itemsPerPage
      return this.products.slice(start, end)
    }
  },
  
  methods: {
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++
        this.$emit('page-change', this.currentPage)
      }
    },
    
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--
        this.$emit('page-change', this.currentPage)
      }
    }
  },
  
  watch: {
    products() {
      this.currentPage = 1
    }
  }
}
</script>

<style scoped>
.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.loading-container,
.error-container,
.no-products {
  text-align: center;
  padding: 3rem;
}

.error-message {
  color: #fc8181;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background-color: var(--primary-hover);
  transform: translateY(-1px);
}

.no-products p {
  color: var(--text-muted);
  font-size: 1.1rem;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.pagination-button {
  padding: 0.75rem 1.5rem;
  border: 1px solid var(--border-color);
  background-color: var(--secondary-color);
  color: var(--text-color);
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.pagination-button:hover:not(:disabled) {
  background-color: var(--primary-color);
  color: white;
  border-color: var(--primary-color);
  transform: translateY(-1px);
}

.pagination-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
  transform: none;
  color: var(--text-muted);
}

.page-info {
  font-size: 1rem;
  color: var(--text-color);
  font-weight: 600;
}

.page-info {
  font-size: 0.875rem;
  color: var(--text-color);
  font-weight: 500;
}

.dark-mode span.page-info {
    color: #000000;
}

@media (max-width: 768px) {
  .products-grid {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 1rem;
  }
  
  .pagination {
    flex-direction: column;
    gap: 0.75rem;
  }
}

@media (max-width: 480px) {
  .products-grid {
    grid-template-columns: 1fr;
  }
}
</style>