<template>
  <div>
    <div v-if="error">{{ error }}</div>
    <div v-if="isLoading">Loading...</div>
    <div v-else>
      <div class="container add-new-container mt-2">
        <form class="d-flex" @submit.prevent="onSubmit">
          <div class="m-5">
            <div class="form-group mt-1">
              <label for="latitude">Latitude</label>
              <input type="text" v-model="form.latitude" class="form-control" id="latitude">
            </div>
            <div class="form-group mt-1">
              <label for="longitude">Longitude</label>
              <input type="text" v-model="form.longitude" class="form-control" id="longitude">
            </div>
            <div class="form-group mt-1">
              <label for="title">Title</label>
              <input type="text" v-model="form.title" class="form-control" id="title">
            </div>
            <div class="form-group mt-1">
              <label for="type">Type</label>
              <select class="form-control" v-model="form.type" id="type">
                <option v-for="typeValue of entityTypes" :value="typeValue">{{ typeValue }}</option>
              </select>
            </div>

            <div class="form-group mt-1">
              <label for="city">City</label>
              <input type="text" v-model="form.city" class="form-control" id="city">
            </div>
            <div class="form-group mt-1">
              <label for="street_name">Street Name</label>
              <input type="text" v-model="form.street_name" class="form-control" id="street_name">
            </div>
          </div>
          <div class="m-5">
            <div class="form-group mt-1">
              <label for="type">Street Type</label>
              <select class="form-control" v-model="form.street_type" id="type">
                <option v-for="street_type of streetTypes" :value="street_type">{{ street_type }}</option>
              </select>
            </div>
            <div class="form-group mt-1">
              <label for="building">Building</label>
              <input type="text" v-model="form.building" class="form-control" id="building">
            </div>
            <div class="form-group mt-1">
              <label for="campus">Campus</label>
              <input type="text" v-model="form.campus" class="form-control" id="campus">
            </div>

            <div class="form-group mt-1">
              <label for="phone">Phone</label>
              <input type="text" v-model="form.phone" class="form-control" id="phone">
            </div>
            <div class="form-group mt-1">
              <label for="website">Website</label>
              <input type="text" v-model="form.website" class="form-control" id="website">
            </div>
            <div class="form-group mt-1">
              <label for="attributes">Attributes</label>
              <select class="form-control" v-model="form.attributes" id="attributes">
                <option v-for="attribute of attributeValues" :value="attribute">{{ attribute.type }}</option>
              </select>
              <div v-if="selectedAttributes.length" class="select-attr-container">
                <span v-for="attr in selectedAttributes">{{ attr.type }}</span>
              </div>
            </div>
            <button class="btn btn-primary mt-3" @click="updateItem()">Update</button>
          </div>
          <div>
            <button class="btn btn-danger" @click="deleteItem(form)"> Delete</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axiosClient from "../services/axios.js";

export default {
  data() {
    return {
      form: {
        latitude: '',
        longitude: '',
        title: '',
        type: '',
        city: '',
        street_name: '',
        street_type: '',
        building: '',
        campus: '',
        phone: '',
        website: '',
        attributes: 3
      },
      message: "",
      error: "",
      entityTypes: ["school", "hospital", "store", "cinema", "municipal_institution",
        "pharmacy", "supermarket", "shopping_mall", "shop", "maintenance_institution",
        "kindergarten", "college", "university", "theater", "restaurant", "station",
        "apartment_building", "park", "gas_station", "playground", "sports_area",
        "bank", "social_institution", "post_office", "metro"
      ],
      streetTypes: ["street", "prospect", "highway", "boulevard"],
      attributeValues: [],
      selectedAttributes: [],
      isLoading: true
    };
  },

  methods: {
    deleteItem() {
      axiosClient.delete(`/map-object/${this.$route.params.id}`).then(
          function (response) {
            this.message = response.data.message;
            this.form = {
              latitude: '',
              longitude: '',
              title: '',
              type: '',
              city: '',
              street_name: '',
              street_type: '',
              building: '',
              campus: '',
              phone: '',
              website: '',
              attributes: ''
            };
          }
      )
    },
    updateItem() {
      console.log(this.form);
      //todo work around
      this.form.attributes = [{id: 1}];
      axiosClient.put(`/map-object/${this.$route.params.id}`, this.form).then(
          function (response) {
            console.log(response);
            this.message = "Object was updated";
            this.form = {
              latitude: '',
              longitude: '',
              title: '',
              type: '',
              city: '',
              street_name: '',
              street_type: '',
              building: '',
              campus: '',
              phone: '',
              website: '',
              attributes: ''
            };
          }).catch(function (error) {
        this.error = 'error.response.data';
        console.log(error);
      });
    }
  },

  mounted() {
    // console.log(this.$route.params.id);
    // const params = {id: this.$route.params.id}
    axiosClient.get(`/map-object/${this.$route.params.id}`)
        .then(res => {
          const resForm = res.data.data;
          this.form = {
            latitude: resForm.latitude,
            longitude: resForm.longitude,
            title: resForm.title,
            type: resForm.type,
            city: resForm.city,
            street_name: resForm.street_name,
            street_type: resForm.street_type,
            building: resForm.building,
            campus: resForm.campus,
            phone: resForm.phone,
            website: resForm.website,
            attributes: resForm.attributes
          };
          this.selectedAttributes = resForm.attributes | [];
          console.log(this.form);
        })
        .catch(error => {
          console.log('Error: ', error);
          this.isLoading = false;
        })

    axiosClient.get('/object-attribute')
        .then(res => {
          this.attributeValues = res.data.data;
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
.add-new-container {
  max-width: fit-content;
}

.select-attr-container {
  margin: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  justify-items: center;
  width: fit-content;
}

.select-attr-container span {
  display: inline-block;
  width: fit-content;
  font-size: 0.8rem;
  padding: 2px;
  margin: 2px;
  border: 1px solid #5076FE;
  border-radius: 10px;

}

@media (max-width: 430px) {
  .add-new-container form {
    flex-direction: column;
  }
}

</style>