<template>
  <header class="text-gray-700 py-4">
    <div class="container px-0 mx-auto flex justify-between items-center">
      <h1 class="text-xl font-bold">NaYoo-Exam</h1>
      <nav>
        <ul class="flex space-x-4">
          <li><NuxtLink to="/" class="hover:text-gray-400 transition duration-100">Home</NuxtLink></li>
          <li><NuxtLink to="/loan-calculator" class="hover:text-gray-400 transition duration-100">Loan Calculator</NuxtLink></li>
          <li><NuxtLink to="/loan-comparison" class="hover:text-gray-400 transition duration-100">Loan Comparison</NuxtLink></li>
        </ul>
      </nav>
    </div>
  </header>
</template>
