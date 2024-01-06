<script setup>
import { ref } from 'vue'
import { supabase } from './lib/supabaseClient'
import SearchInput from 'vue-search-input'
import 'vue-search-input/dist/styles.css'
import { debounce } from 'lodash';

const searchVal = ref('');
const searchResults = ref([]);
const loading = ref(false);
var suggestions = document.getElementById('suggestions');

function suggestionQuery(suggestion) {
  const mainInput = document.getElementById('main-input');
  mainInput.value = suggestion;

  // Manually trigger the input event
  const inputEvent = new Event('input', { bubbles: true });
  mainInput.dispatchEvent(inputEvent);

  // Call handleSearch directly if needed
  handleSearch();
}

const handleSuggestionClick = (suggestion) => {
  suggestionQuery(suggestion);
}

async function getAcronyms(query) {
  const { data } = await supabase.from('acronyms').select().ilike('acronym', `%${query}%`)
  searchResults.value = data || [];
}

const handleSearch = debounce(() => {
  const trimmedQuery = searchVal.value.trim();

  if (trimmedQuery === '' || !/^[a-zA-Z0-9 ]+$/.test(trimmedQuery) || trimmedQuery.length == 1) {
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
      <h1>WoW Abbreviations Lookup</h1>
    </section>

    <section class="search">
      <div class="input-wrapper">
        <SearchInput id="main-input" @input="handleSearch" v-model="searchVal" :type="'search'" :modelValue="''"
          :wrapperClass="'search-input-wrapper'" :searchIcon="false" :shortcutIcon="true" :clearIcon="true"
          :hideShortcutIconOnBlur="false" :clearOnEsc="false" :blurOnEsc="true" :selectOnFocus="false"
          :shortcutListenerEnabled="true" :shortcutKey="'/'" />
      </div>
      <div id="suggestions" class="link-list">
        <h3>Most searched:</h3>
        <a class="suggestion" @click="() => handleSuggestionClick('AQ40')" href="#">AQ40</a>
        <a class="suggestion" @click="() => handleSuggestionClick('RDF')" href="#">RDF</a>
        <a class="suggestion" @click="() => handleSuggestionClick('OOM')" href="#">OOM</a>
        <a class="suggestion" @click="() => handleSuggestionClick('AoE')" href="#">AoE</a>
        <a class="suggestion" @click="() => handleSuggestionClick('BoP')" href="#">BoP</a>
        <a class="suggestion" @click="() => handleSuggestionClick('PUG')" href="#">PUG</a>
      </div>
    </section>

    <section class="results">
      <transition name="fade" mode="out-in">
        <p v-if="loading">Searching...</p>

        <ul class="result-list" v-else-if="searchVal !== '' && searchResults.length > 0">
          <li class="result-item" v-for="result in searchResults" :key="result.id">
            <span class="acronym">{{ result.acronym }}</span><span> &nbsp;👉&nbsp; </span>{{ result.meaning }}
          </li>
        </ul>

        <p v-else-if="searchVal !== ''">No results found.</p>
        <p v-else>Enter a search query.</p>
      </transition>
    </section>

  </div>
  <footer>
    <p class="footer-text">Made by <a href="https://adamdurrant.co.uk/">Adam Durrant</a></p>
  </footer>
</template>


<script>

export default {
  components: {
    SearchInput,
  }
}
</script>

<style scoped></style>