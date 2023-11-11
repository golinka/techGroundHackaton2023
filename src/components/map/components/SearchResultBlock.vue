<template>
  <div class="search-result-block">
    <div class="search-result-block__name h5 mb-3">
      {{ props.name || 'Софиевская Борщаговка, Киевская область, Украина' }}
    </div>
    <div class="search-result-block__location mb-3">{{ props.location }}</div>
    <div class="search-result-block__buttons col-xs-12">
      <AppButton
        @click="$emit('direction', props.coordinates)"
        aria-label="Прокласти маршрут"
        class="d-flex"
      >
        Прокласти маршрут
        <img :src="walkingManIcon" alt="" />
      </AppButton>
    </div>
  </div>
</template>

<script setup>
import walkingManIcon from '../../../assets/svg/walking-man.svg'
import AppButton from '../../base/AppButton.vue'

const props = defineProps(['name', 'location', 'coordinates'])
const emit = defineEmits(['direction'])
</script>

<style lang="sass">
.search-result-block
    width: 300px
    max-width: 100%
    padding: 15px 10px
    border-radius: 5px
    background-color: $white

    &__buttons
        .app-button
            width: 100%
            align-items: center
            justify-content: center

            img
                transform: rotateY(180deg)
                width: 15px
                height: 15px
                margin-left: 10px
                fill: white
                color: white
</style>
