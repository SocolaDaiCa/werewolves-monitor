<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>{{ $t('roles.title') }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content class="ion-padding">
      <RoleManagement />
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import RoleManagement from '~/components/RoleManagement.vue'
</script>

