<script setup>
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient'
import SearchInput from 'vue-search-input'
import 'vue-search-input/dist/styles.css'

const searchVal = ref('')
const searchResults = ref([])

async function getAcronyms(query) {
  const { data } = await supabase.from('acronyms').select().ilike('acronym', `%${query}%`)
  searchResults.value = data || []
}

const handleSearch = async () => {
  const trimmedQuery = searchVal.value.trim();

  // Always update searchResults, even if trimmedQuery is empty
  await getAcronyms(trimmedQuery)

  // Set searchResults to an empty array if trimmedQuery is empty
  if (trimmedQuery === '') {
    searchResults.value = []
  }
}

</script>

<template>
  <h1>Test</h1>

  <div class="input-wrapper">
    <SearchInput @input="handleSearch" v-model="searchVal" />
  </div>

  <ul v-if="searchVal !== '' && searchResults.length > 0">
    <li v-for="result in searchResults" :key="result.id">
      {{ result.acronym }} - {{ result.meaning }}
    </li>
  </ul>
  <p v-else-if="searchVal !== ''">No results found.</p>
  <p v-else>Enter a search query.</p>
</template>

<script>
export default {
  components: {
    SearchInput
  }
}
</script>

<style scoped></style>
