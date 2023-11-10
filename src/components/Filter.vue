<script setup>
import {ref} from 'vue'
import saveFilter from '../assets/icons/save-filter.svg'
import clearFilter from '../assets/icons/clear-filter.svg'

const filters = ref(['Пандуси', 'Ліфти', 'Підйомні засоби', 'Укритття', 'Cупровід']);
const savedFilters = ref(['1, Збережені фільри', '2, Збережені фільтри', '3, Збережені фільри'])
</script>

<template>
  <div class="filter-container">
    <div class="filter-inner">
      <div class="filter-header">
        <h3>Фільтри</h3>
        <button><img :src="clearFilter"/></button>
        <button><img :src="saveFilter"/></button>
      </div>

      <div class="items-container">
        <button class="items" v-for="item in filters">
          {{ item }}
        </button>
      </div>

      <div class="saved-filters">
        <h3>Збережені фільтри</h3>
        <div>
          <p v-for="savedFilter in savedFilters">
            {{ savedFilter }}
          </p>
        </div>

      </div>
    </div>

  </div>
  <div></div>


</template>

<style>


</style>
