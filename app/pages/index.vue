<template>
  <div class="page-home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-content">
        <h1 class="hero-title">{{ $t('home.welcome') }}</h1>
        <p class="hero-description">{{ $t('home.description') }}</p>
      </div>
    </section>

    <!-- Main Menu Cards -->
    <section class="menu-section">
      <div class="menu-grid">
        <!-- Start Game Card -->
        <NuxtLink to="/game-setup" class="menu-card menu-card--primary">
          <div class="card-icon">🎮</div>
          <h2>{{ $t('home.startGame') }}</h2>
          <p>{{ $t('gameSetup.selectPlayers') }}</p>
        </NuxtLink>

        <!-- Manage Roles Card -->
        <NuxtLink to="/roles" class="menu-card menu-card--secondary">
          <div class="card-icon">🃏</div>
          <h2>{{ $t('home.manageRoles') }}</h2>
          <p>{{ $t('roles.selectRoles') }}</p>
        </NuxtLink>

        <!-- Manage Players Card -->
        <NuxtLink to="/players" class="menu-card menu-card--secondary">
          <div class="card-icon">👥</div>
          <h2>{{ $t('home.managePlayers') }}</h2>
          <p>{{ $t('players.title') }}</p>
        </NuxtLink>

        <!-- Settings Card -->
        <NuxtLink to="#" class="menu-card menu-card--secondary menu-card--disabled">
          <div class="card-icon">⚙️</div>
          <h2>{{ $t('home.viewStats') }}</h2>
          <p>Coming soon...</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Footer Info -->
    <section class="info-section">
      <h2>{{ $t('app.subtitle') }}</h2>
      <p>
        A game management web app for "Ultimate Werewolf" designed to help moderators 
        manage the game flow, including role management, player selection, game progression 
        through day/night phases, and providing text-to-speech narration support.
      </p>
    </section>
  </div>
</template>

<script setup lang="ts">
// Home page - no logic needed for Phase 1
</script>

<style scoped lang="scss">
.page-home {
  display: flex;
  flex-direction: column;
  gap: 3rem;
}

/* Hero Section */
.hero {
  text-align: center;
  padding: 3rem 1rem;
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
  color: white;
  border-radius: var(--border-radius);
  margin-bottom: 1rem;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  letter-spacing: 0.5px;

  @media (max-width: 640px) {
    font-size: 1.8rem;
  }
}

.hero-description {
  font-size: 1.1rem;
  opacity: 0.95;
  line-height: 1.6;
}

/* Menu Section */
.menu-section {
  width: 100%;
}

.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

.menu-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 2rem 1.5rem;
  border-radius: var(--border-radius);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-speed);
  border: 2px solid transparent;
  min-height: 280px;
  justify-content: center;

  h2 {
    font-size: 1.3rem;
    margin: 1rem 0 0.5rem;
    text-align: center;
  }

  p {
    font-size: 0.95rem;
    text-align: center;
    color: #666;
  }

  &:hover:not(.menu-card--disabled) {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }

  &--primary {
    background: linear-gradient(135deg, var(--color-primary-light) 0%, var(--color-primary) 100%);
    color: white;
    border-color: var(--color-primary);

    p {
      color: rgba(255, 255, 255, 0.9);
    }

    &:hover {
      background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary-dark) 100%);
    }
  }

  &--secondary {
    background: white;
    border: 2px solid #e0e0e0;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);

    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 4px 16px rgba(0, 0, 0, 0.1);
    }
  }

  &--disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
}

.card-icon {
  font-size: 3rem;
  margin-bottom: 0.5rem;
}

/* Info Section */
.info-section {
  background-color: #f5f5f5;
  padding: 2rem;
  border-radius: var(--border-radius);
  text-align: center;

  h2 {
    font-size: 1.5rem;
    margin-bottom: 1rem;
    color: var(--color-primary);
  }

  p {
    font-size: 0.95rem;
    line-height: 1.6;
    color: #666;
    max-width: 600px;
    margin: 0 auto;
  }

  @media (max-width: 640px) {
    padding: 1.5rem;

    h2 {
      font-size: 1.2rem;
    }
  }
}
</style>
