<template>
  <v-container>
    <v-layout>
      <v-flex md12>
        <v-row>
          <v-data-table
            :headers="headers"
            :items="items"
            :items-per-page="itemsPerPage"
            class="elevation-1"
          >
            <template v-slot:item.id="{ item }">
              <router-link :to="'/lease/' + item.id">
                <v-btn text small>Manage</v-btn>
              </router-link>
            </template>
          </v-data-table>
        </v-row>
      </v-flex>
      <v-flex md12>
        <v-row>
          <form>
            <v-text-field
              v-model='unitNumber'
              :rules='unitNumberRules'
              label='Unit Number'
              required
              type='text'
            ></v-text-field>
            <v-btn class='mr-4' @click='submit'>submit</v-btn>
            <v-btn @click='clear'>clear</v-btn>
          </form>
        </v-row>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      token: null,
      path: '/leases',
      itemsPerPage: 15,
      items: [],
        headers: [
          { text: 'Unit Number', value: 'unit_number' },
          { text: 'Bluemoon ID', value: 'bluemoon_id' },
          { text: '', value: 'id' },
        ],
      unitNumber: '',
      unitNumberRules: [v => !!v || 'Unit Number is required'],
    };
  },
  methods: {
    submit: function () {
      if (!this.unitNumber) {
        return;
      }
      this.$http
        .post(this.path, {unit_number: this.unitNumber}, {headers: {Authorization: 'Bearer ' + this.token}})
        .then(response => {
          this.items = response.data.items;
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    clear: function () {
      this.unitNumber = '';
    }
  },
  mounted () {
    this.token = localStorage.getItem('jwt');
    this.$http
      .get(this.path, {headers: {Authorization: 'Bearer ' + this.token}})
      .then(response => {
        this.items = response.data.items;
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.error(error);
      });
  }
};
</script>
