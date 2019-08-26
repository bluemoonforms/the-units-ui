<template>
  <v-data-table
    :headers="headers"
    :items="items"
    :items-per-page="itemsPerPage"
    class="elevation-1"
  >
    <template v-slot:item.id="{ item }">
      <v-btn text small>
        <router-link :to="'/lease/' + item.id">Manage</router-link>
      </v-btn>
    </template>
  </v-data-table>
</template>

<script>
export default {
  data() {
    return {
      itemsPerPage: 15,
      items: [],
        headers: [
          { text: 'Unit Number', value: 'unit_number' },
          { text: 'Bluemoon ID', value: 'bluemoon_id' },
          { text: 'ID', value: 'id' },
        ],
      rawData: null,
    };
  },
  mounted () {
    const token = localStorage.getItem('jwt');
    const path = '/leases';
    this.$http.get(
      path,
      {headers: {Authorization: 'Bearer ' + token}}
    ).then(response => {
      this.items = response.data.items;
      this.rawData = response.data;
    }).catch(function(error) {
      console.error(error.response);
    });
  }
};
</script>
