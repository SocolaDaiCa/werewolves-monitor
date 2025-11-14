<template>
  <div class="p-3 bg-black text-white">
    <div v-for="doc in docs">
      <component v-if="doc.title" :is="`h${doc.deep}`" class="text-center text-black bg-d0cfcd font-bold uppercase p-1">{{doc.title}}</component>
      <p v-for="description in doc.descriptions" class="mt-3 mb-3 text-justify">{{description}}</p>
      <!-- <p class="pt-2 pb-2 text-justify">{{doc.description}}</p> -->
    </div>
  </div>
</template>
<script>
import Doc from '@/app/Doc';
import docs from '@/app/docs';
export default {

  name: 'docs',

  data() {
    return {
      docs: docs
    }
  }
}

</script>
<style lang="css" scoped>
</style>
