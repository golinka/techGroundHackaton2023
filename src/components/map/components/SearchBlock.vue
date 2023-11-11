<template>
  <div class="search-block">
    <div class="search-block__search d-flex">
      <div class="search-block__search-field">
        <img :src="searchIcon" alt="Search icon" />
        <input
          type="text"
          class="form-control form-control-lg"
          placeholder="Пошук"
          :value="query"
          aria-label="Поле пошуку"
          @input="onChanged"
        />
      </div>
      <div
        class="search-block__search-filters d-flex"
        aria-label="Кнопка фільтрів"
      >
        <img :src="filtersIcon" alt="Filters icon" />
      </div>
    </div>
    <div v-if="places.length" class="search-block__options mt-2">
      <ul class="list-group">
        <li
          v-for="(item, index) in places"
          :key="index"
          class="list-group-item list-group-item-action"
          :aria-label="item.place_name"
          @click="onChoose(item)"
        >
          {{ item.place_name }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import searchIcon from '../../../assets/svg/search.svg'
import filtersIcon from '../../../assets/svg/filters.svg'
import { getLocationBySearch } from '../../../api/map'

const emit = defineEmits(['choose'])

const query = ref('')
const places = ref([])
const token = import.meta.env.VITE_MAPBOX_PUBLIC_TOKEN

const onChanged = async (event) => {
  try {
    query.value = event.target.value
    const results = await getLocationBySearch({
      query: encodeURIComponent(event.target.value),
      params: { access_token: token },
    })
    places.value = results.features
  } catch (err) {
    console.error('SearchBlock: onChanged - ', err)
  }
}

const onChoose = (feature) => {
  places.value = []
  emit('choose', feature)
}
</script>

<style lang="sass">
.search-block
    width: 100%

    &__search
        &-field
            position: relative
            flex: 1 0 calc(100% - 48px - 10px)

            img
                position: absolute
                top: 50%
                transform: translateY(-50%)
                left: 10px
                width: 24px
                height: 24px

            input
                padding-left: 40px

        &-filters
            justify-content: center
            align-items: center
            width: 48px
            height: 48px
            border-radius: 5px
            background-color: $white
            margin-left: 10px
            border: 1px solid $grey

            img
                width: 24px
                height: 24px

    &__options
        //

    @media screen and (max-width: 767px)
        width: 100%
</style>
