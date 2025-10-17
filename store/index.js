export const state = () => ({
  products: [],
  categories: [],
  loading: false,
  error: null
})

export const mutations = {
  SET_PRODUCTS(state, products) {
    state.products = products
  },
  SET_CATEGORIES(state, categories) {
    state.categories = categories
  },
  SET_LOADING(state, loading) {
    state.loading = loading
  },
  SET_ERROR(state, error) {
    state.error = error
  }
}

export const actions = {
  async fetchProducts({ commit }) {
    commit('SET_LOADING', true)
    commit('SET_ERROR', null)
    try {
      const products = await this.$axios.$get('/products')
      commit('SET_PRODUCTS', products)
    } catch (error) {
      commit('SET_ERROR', 'Failed to load products')
    } finally {
      commit('SET_LOADING', false)
    }
  },
  
  async fetchCategories({ commit }) {
    try {
      const categories = await this.$axios.$get('/products/categories')
      commit('SET_CATEGORIES', categories)
    } catch (error) {
      console.error('Error fetching categories:', error)
    }
  }
}