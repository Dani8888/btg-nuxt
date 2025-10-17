<template>
  <div class="product-detail-page">
    <div class="container">
      <div v-if="loading" class="loading-container">
        <LoadingSpinner />
      </div>
      
      <div v-else-if="error" class="error-container">
        <div class="error-content">
          <h2>Oops! Product Not Found</h2>
          <p>We couldn't find the product you're looking for.</p>
          <button @click="fetchProduct" class="retry-button">
            Try Again
          </button>
          <NuxtLink to="/" class="back-link">
            ← Back to Home
          </NuxtLink>
        </div>
      </div>
      
      <div v-else-if="product" class="product-detail-content">
        <nav class="breadcrumb">
		  <NuxtLink to="/" class="breadcrumb-link primary-color">Home</NuxtLink>
		  <span class="breadcrumb-separator text-muted">/</span>
		  <NuxtLink 
			:to="`/category/${product.category}`"
			class="breadcrumb-link primary-color"
		  >
			{{ formatCategory(product.category) }}
		  </NuxtLink>
		  <span class="breadcrumb-separator text-muted">/</span>
		  <span class="breadcrumb-current dark-mode-text">{{ product.title }}</span>
		</nav>

        <div class="product-layout">
          <div class="product-image-section">
            <div class="image-container">
              <img 
                :src="product.image" 
                :alt="product.title"
                loading="lazy"
                @load="imageLoaded = true"
                :class="{ loaded: imageLoaded }"
                class="product-image"
              />
              <div v-if="!imageLoaded" class="image-loading">
                <LoadingSpinner />
              </div>
            </div>
          </div>

          <div class="product-info-section">
            <div class="product-header">
              <h1 class="product-title">{{ product.title }}</h1>
              <div class="product-category-badge">
                {{ formatCategory(product.category) }}
              </div>
            </div>
            
            <div class="product-rating">
              <div class="rating-stars">
                <span class="stars">⭐</span>
                <span class="rating-value dark-mode-text">{{ product.rating.rate }}</span>
				<span class="rating-count text-muted">({{ product.rating.count }} reviews)</span>
              </div>
            </div>

            <div class="product-price-section">
              <div class="product-price">${{ product.price }}</div>
              <div class="price-note">Inclusive of all taxes</div>
            </div>

            <div class="product-description">
              <h3>Description</h3>
              <p>{{ product.description }}</p>
            </div>

            <div class="product-actions">
              <button class="book-now-button" @click="handleBookNow">
                🏨 Book Now
              </button>
            </div>

            <div class="product-features">
              <div class="feature-item">
                <span class="feature-icon">🚀</span>
                <span class="feature-text dark-mode-text">Instant Confirmation</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">🛡️</span>
                <span class="feature-text">Best Price Guarantee</span>
              </div>
              <div class="feature-item">
                <span class="feature-icon">📧</span>
                <span class="feature-text">24/7 Support</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductDetailPage',
  
  data() {
    return {
      product: null,
      loading: false,
      error: null,
      imageLoaded: false
    }
  },
  
  async mounted() {
    await this.fetchProduct()
  },
  
  methods: {
    async fetchProduct() {
      this.loading = true
      this.error = null
      try {
        this.product = await this.$axios.$get(`/products/${this.$route.params.id}`)
      } catch (error) {
        this.error = 'Failed to load product'
        console.error('Error fetching product:', error)
      } finally {
        this.loading = false
      }
    },
    
    formatCategory(category) {
      return category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())
    },
    
    handleBookNow() {
      alert(`Booking ${this.product.title} for $${this.product.price}`)
    }
  }
}
</script>

<style scoped>
.product-detail-page {
  min-height: 100vh;
  padding: 2rem 0;
}

.loading-container,
.error-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 50vh;
}

.error-content {
  text-align: center;
  max-width: 400px;
}

.error-content h2 {
  color: var(--text-color);
  margin-bottom: 1rem;
}

.error-content p {
  color: var(--text-muted);
  margin-bottom: 2rem;
}

.retry-button {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.retry-button:hover {
  background-color: var(--primary-hover);
}

.back-link {
  display: inline-block;
  margin-top: 1rem;
  color: var(--primary-color);
  text-decoration: none;
  font-weight: 500;
}

.back-link:hover {
  text-decoration: underline;
}

/* Breadcrumb */
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

/* Product Layout */
.product-layout {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 4rem;
  align-items: start;
}

.product-image-section {
  position: sticky;
  top: 2rem;
}

.image-container {
  position: relative;
  background: white;
  border-radius: 12px;
  padding: 2rem;
  box-shadow: var(--shadow);
}

.dark-mode .image-container {
  background: var(--secondary-color);
}

.product-image {
  width: 100%;
  height: auto;
  max-height: 500px;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
  border-radius: 8px;
}

.product-image.loaded {
  opacity: 1;
}

.image-loading {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--bg-color);
  border-radius: 12px;
}

/* Product Info */
.product-header {
  margin-bottom: 1.5rem;
}

.product-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  color: var(--text-color);
}

.product-category-badge {
  display: inline-block;
  background: var(--primary-color);
  color: white;
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  font-size: 0.875rem;
  font-weight: 500;
}

.product-rating {
  margin-bottom: 1.5rem;
}

.rating-stars {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.stars {
  font-size: 1.25rem;
}

.rating-value {
  font-weight: 600;
  color: var(--text-color);
}

.rating-count {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.product-price-section {
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--secondary-color);
  border-radius: 12px;
  border: 1px solid var(--border-color);
}

.product-price {
  font-size: 2.5rem;
  font-weight: 800;
  color: var(--primary-color);
  margin-bottom: 0.5rem;
}

.price-note {
  color: var(--text-muted);
  font-size: 0.875rem;
}

.product-description {
  margin-bottom: 2rem;
}

.product-description h3 {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  color: var(--text-color);
}

.product-description p {
  line-height: 1.7;
  color: var(--text-muted);
}

.product-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.book-now-button {
  flex: 1;
  background: var(--primary-color);
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 12px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 200px;
}

.book-now-button:hover {
  background: var(--primary-hover);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.product-features {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.feature-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  background: var(--secondary-color);
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.feature-icon {
  font-size: 1.25rem;
}

.feature-text {
  font-weight: 500;
  color: var(--text-color);
}

@media (max-width: 968px) {
  .product-layout {
    grid-template-columns: 1fr;
    gap: 2rem;
  }
  
  .product-image-section {
    position: static;
  }
  
  .image-container {
    padding: 1.5rem;
  }
}

@media (max-width: 768px) {
  .product-detail-page {
    padding: 1rem 0;
  }
  
  .product-title {
    font-size: 1.5rem;
  }
  
  .product-price {
    font-size: 2rem;
  }
  
  .product-actions {
    flex-direction: column;
  }
  
  .book-now-button {
    min-width: auto;
    width: 100%;
  }
  
  .breadcrumb {
    font-size: 0.8rem;
  }
}

@media (max-width: 480px) {
  .product-features {
    gap: 0.5rem;
  }
  
  .feature-item {
    padding: 0.5rem;
  }
}
</style>