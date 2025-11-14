<template>
  <div class="page-roles">
    <h1>{{ $t('roles.title') }}</h1>
    <p>{{ $t('roles.selectRoles') }}</p>
    <!-- Role management component will be implemented in Phase 2 -->
    <div class="placeholder">
      <p>✏️ {{ $t('common.loading') }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
// Phase 2: Role Management will implement RoleCard component, balance calculation, quantity controls, etc.
</script>

<style scoped lang="scss">
.page-roles {
  padding: 2rem;

  h1 {
    font-size: 1.8rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  p {
    font-size: 1rem;
    color: #666;
    margin-bottom: 2rem;
  }
}

.placeholder {
  background-color: #f5f5f5;
  border: 2px dashed #ccc;
  padding: 3rem 2rem;
  border-radius: var(--border-radius);
  text-align: center;
  color: #999;
}
</style>
