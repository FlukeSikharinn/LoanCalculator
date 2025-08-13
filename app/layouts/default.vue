<script setup lang="ts">
    import Topbar from '../components/Topbar.vue'
    import Banner from '../components/Banner.vue'
    
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <main class="flex-grow flex mt-4 px-4">
      <div class="hidden lg:block" style="width:18%"></div>
      <div class="w-full lg:w-[64%] flex flex-col">
        <Topbar />
        <Banner />
        <section class="flex-grow">
          <NuxtPage />
        </section>
      </div>
      <div class="hidden lg:block" style="width:18%"></div>
    </main>
  </div>
</template>
