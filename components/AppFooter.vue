<template>
  <footer class="app-footer">
    <div class="container">
      <p>&copy; 2024 BookingToGo. All rights reserved.</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'AppFooter'
}
</script>

<style scoped>
.app-footer {
  background-color: var(--secondary-color);
  border-top: 1px solid var(--border-color);
  padding: 1.5rem 0;
  text-align: center;
}

.app-footer p {
  color: var(--text-color);
  opacity: 0.8;
}
</style>