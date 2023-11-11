<script>
import EntitiesList from "./EntitiesList.vue";
import AddNewEntity from "./AddNewEntity.vue";
import HeaderMenu from "./HeaderMenu.vue";

export default {
  components: {
    HeaderMenu,
    AddNewEntity,
    EntitiesList
  },
  data() {
    return {
      showAddNew: false
    }
  },
  methods: {}
}
</script>

<template>
  <div class="admin-page">
    <HeaderMenu/>
    <router-view></router-view>
  </div>

</template>

<style>
header {
  height: 5vh;
  background-color: #5076FE;
}

header a {
  color: #fff;
}
</style>