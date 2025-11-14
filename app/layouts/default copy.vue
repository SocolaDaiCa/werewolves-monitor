<template>
  <div class="app-layout">
    xxxxxxxxxxx
    <!-- Header/Navigation -->
    <header class="app-header">
      <div class="header-container">
        <div class="header-brand">
          <h1 class="app-title">{{ $t('app.title') }}</h1>
        </div>
        
        <nav class="header-nav">
          <NuxtLink to="/" class="nav-link">{{ $t('navigation.home') }}</NuxtLink>
          <NuxtLink to="/roles" class="nav-link">{{ $t('navigation.roles') }}</NuxtLink>
          <NuxtLink to="/players" class="nav-link">{{ $t('navigation.players') }}</NuxtLink>
        </nav>

        <div class="header-actions">
          <!-- Language Switcher -->
          <div class="language-switcher">
            <button 
              v-for="locale in availableLocales" 
              :key="locale.code"
              :class="['lang-btn', { active: currentLocale === locale.code }]"
              @click="setLocale(locale.code)"
              :title="locale.name"
            >
              {{ locale.code.toUpperCase() }}
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="app-main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="app-footer">
      <p>&copy; 2025 Werewolves Monitor. {{ $t('common.loading') }}</p>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale, availableLocales } = useI18n()

const currentLocale = computed(() => locale.value)

const setLocale = (lang: string) => {
  locale.value = lang
}
</script>

<style scoped lang="scss">
.app-layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: var(--color-bg-light);
  color: var(--color-text-light);
}

/* Header Styles */
.app-header {
  background-color: var(--color-primary);
  color: white;
  padding: 1rem 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.header-brand {
  flex-shrink: 0;
}

.app-title {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0;
  letter-spacing: 0.5px;
}

/* Navigation */
.header-nav {
  display: flex;
  gap: 1.5rem;
  flex: 1;

  @media (max-width: 640px) {
    flex-basis: 100%;
    gap: 0.5rem;
    order: 3;
  }
}

.nav-link {
  color: white;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border-radius: var(--border-radius);
  transition: background-color var(--transition-speed);
  font-weight: 500;
  font-size: 0.95rem;

  &:hover,
  &.router-link-active {
    background-color: rgba(255, 255, 255, 0.2);
  }

  @media (max-width: 640px) {
    padding: 0.4rem 0.8rem;
    font-size: 0.85rem;
  }
}

/* Header Actions */
.header-actions {
  flex-shrink: 0;
  display: flex;
  gap: 1rem;
  align-items: center;

  @media (max-width: 640px) {
    justify-content: flex-end;
  }
}

/* Language Switcher */
.language-switcher {
  display: flex;
  gap: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.2);
  padding-left: 1rem;

  @media (max-width: 640px) {
    border-left: none;
    padding-left: 0;
  }
}

.lang-btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: transparent;
  color: white;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--transition-speed);

  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    border-color: white;
  }

  &.active {
    background-color: rgba(255, 255, 255, 0.25);
    border-color: white;
  }
}

/* Main Content */
.app-main {
  flex: 1;
  max-width: 1200px;
  width: 100%;
  margin: 0 auto;
  padding: 2rem 1rem;

  @media (max-width: 640px) {
    padding: 1rem 0.5rem;
  }
}

/* Footer */
.app-footer {
  background-color: var(--color-bg-light);
  border-top: 1px solid #e0e0e0;
  padding: 2rem 1rem;
  text-align: center;
  color: var(--color-text-light);
  margin-top: auto;
  font-size: 0.9rem;
}
</style>
