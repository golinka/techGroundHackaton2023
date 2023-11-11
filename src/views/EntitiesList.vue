<template>
  <div class="container">
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <table class="table table table-striped font-small">
        <thead>
        <tr>
          <th v-for="item of Object.keys(items[0])" scope="col">{{ item }}</th>
          <th>Edit</th>
        </tr>

        </thead>
        <tbody>
        <tr v-for="item of items">
          <th scope="row" v-for="value of item"> {{ value }}</th>
          <th @click="editItem(item)"><img :src="editIcon"/></th>
        </tr>
        </tbody>
      </table>
      <nav aria-label="Page navigation example">
        <ul class="pagination">
          <li class="page-item">
            <a class="page-link" @click="changePage(currentPage - 1)">
              Previous
            </a>
          </li>
          <li class="page-item" v-for="page in pages">
            <a class="page-link" :key="page"
               @click="changePage(page)"
               :class="{ active: page === currentPage }">
              {{ page }}
            </a>
          </li>
          <li class="page-item"><a class="page-link" @click="changePage(currentPage + 1)">Next</a></li>
        </ul>
      </nav>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import editIcon from "../assets/icons/pencil-square.svg"
import axiosClient from "../services/axios.js";

export default {
  data() {
    return {
      items: [],
      isLoading: true,
      editIcon: editIcon,
      currentPage: 1,
      count: 0,
      limit: 10
    };
  },
  computed: {
    totalPages() {
      return Math.ceil(this.count / this.limit);
    },
    pages() {
      const pagesArray = [];
      for (let i = 1; i <= this.totalPages; i++) {
        pagesArray.push(i);
      }
      return pagesArray;
    }
  },

  methods: {
    editItem(item) {
      this.$router.push(`/admin/edit-entity/${item.id}`);
      console.log("Edit");
      console.log(item);
    },
    changePage(page) {
      if (page >= 1) {
        this.currentPage = page;
        const params = {
          page: this.currentPage,
          limit: this.limit
        }
        axiosClient.get('/map-object', {params})
            .then(res => {
              this.count = res.data.count;
              this.items = res.data.data;
              this.items.forEach(item => item.attributes = item.attributes.reduce(
                  (accumulator, currentValue) => accumulator + currentValue.type + ' ',
                  ''));
              this.isLoading = false;
              console.log(res.data);
            })
            .catch(error => {
              console.log('Error: ', error);
              this.isLoading = false;
            })
      }
    }
  },

  mounted() {
    const params = {
      page: this.currentPage,
      limit: this.limit,
    }
    axios.get('http://16.171.65.177/api/v1/map-object', {params})
        .then(res => {
          this.count = res.data.count;
          this.items = res.data.data;
          this.totalPages = Math.round(res.data.count / this.limit);
          this.items.forEach(item => item.attributes = item.attributes.reduce(
              (accumulator, currentValue) => accumulator + currentValue.type + ' ',
              ''));
          this.isLoading = false;
          console.log(res.data);
        })
        .catch(error => {
          console.log('Error: ', error);
          this.isLoading = false;
        })
  }
}

</script>

<style>
.font-small {
  font-size: 0.7rem;
}
</style>