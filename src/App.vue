<script setup>
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient'
import SearchInput from 'vue-search-input'
import 'vue-search-input/dist/styles.css'
import { debounce } from 'lodash';

const searchVal = ref('');
const searchResults = ref([]);
const loading = ref(false);
let searchTimeout;

async function getAcronyms(query) {
  const { data } = await supabase.from('acronyms').select().ilike('acronym', `%${query}%`)
  searchResults.value = data || [];
}

const handleSearch = debounce(() => {
  const trimmedQuery = searchVal.value.trim();

  if (trimmedQuery === '' || !/^[a-zA-Z0-9 ]+$/.test(trimmedQuery)) {
    searchResults.value = [];
    return;
  }

  loading.value = true;

  getAcronyms(trimmedQuery).then(() => {
    loading.value = false;
  });
}, 500);

</script>

<template>

  <div class="main-wrapper">

  <section class="intro">
    <h1>WoW Abbreviations & Acronyms Lookup</h1>
  </section>

  <section class="search">
    <div class="input-wrapper">
      <SearchInput @input="handleSearch" v-model="searchVal" />
    </div>
  </section>

  <section class="results">
    <p v-if="loading">Searching...</p>
    <ul v-else-if="searchVal !== '' && searchResults.length > 0">
      <li v-for="result in searchResults" :key="result.id">
        {{ result.acronym }} - {{ result.meaning }}
      </li>
    </ul>
    <p v-else-if="searchVal !== ''">No results found.</p>
    <p v-else>Enter a search query.</p>
  </section>

</div>

</template>


<script>
export default {
  components: {
    SearchInput
  }
}
</script>

<style scoped>




</style>