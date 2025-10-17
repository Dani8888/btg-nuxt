<template>
  <div class="product-card" @click="goToProductDetail">
    <div class="product-image">
      <img 
        :src="product.image" 
        :alt="product.title"
        loading="lazy"
        @load="onImageLoad"
        :class="{ loaded: imageLoaded }"
      />
      <div v-if="!imageLoaded" class="image-loading">
        <div class="loading-spinner-small"></div>
      </div>
    </div>
    
    <div class="product-info">
      <h3 class="product-title">{{ product.title }}</h3>
      <p class="product-category">{{ formatCategory(product.category) }}</p>
      <div class="product-price">${{ product.price }}</div>
      <div class="product-rating">
        ⭐ {{ product.rating.rate }} ({{ product.rating.count }} reviews)
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ProductCard',
  
  props: {
    product: {
      type: Object,
      required: true
    }
  },
  
  data() {
    return {
      imageLoaded: false
    }
  },
  
  methods: {
    goToProductDetail() {
      this.$router.push(`/product/${this.product.id}`)
    },
    
    onImageLoad() {
      this.imageLoaded = true
    },
    
    formatCategory(category) {
      return category.replace(/'/g, '').replace(/\b\w/g, l => l.toUpperCase())
    }
  }
}
</script>

<style scoped>
.product-card {
  background: var(--secondary-color);
  border: 1px solid var(--border-color);
  border-radius: 12px;
  padding: 1.25rem;
  cursor: pointer;
  transition: all 0.3s ease;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.product-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-lg);
  border-color: var(--primary-color);
}

.product-image {
  width: 100%;
  height: 200px;
  margin-bottom: 1rem;
  overflow: hidden;
  border-radius: 8px;
  position: relative;
  background-color: var(--bg-color);
}

.product-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.product-image img.loaded {
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
  background-color: var(--bg-color);
}

.loading-spinner-small {
  width: 30px;
  height: 30px;
  border: 3px solid var(--border-color);
  border-top: 3px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.product-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.product-title {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  line-height: 1.4;
  color: var(--text-color);
}

.product-category {
  color: var(--primary-color);
  font-size: 0.875rem;
  margin-bottom: 0.5rem;
  text-transform: capitalize;
  font-weight: 500;
}

.product-price {
  font-size: 1.25rem;
  font-weight: bold;
  color: var(--text-color);
  margin-bottom: 0.5rem;
}

.product-rating {
  font-size: 0.875rem;
  color: var(--text-muted);
  margin-top: auto;
}

@media (max-width: 768px) {
  .product-card {
    padding: 1rem;
  }
  
  .product-image {
    height: 180px;
  }
}
</style>