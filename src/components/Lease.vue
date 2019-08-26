<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md12>
        <h1 class="display-1">Lease: {{lease.unit_number}} : {{ lease.bluemoon_id }}</h1>
        <v-divider></v-divider>
        <v-btn v-if="lease.bluemoon_id === null" @click="launchEditor">Launch Lease Editor</v-btn>
        <span v-if="lease.bluemoon_id !== null">
          <v-btn @click="generatePDF">Generate PDF</v-btn>
          <v-btn v-if="lease.esignatures.length === 0"  @click="requestEsignature">Request Esignature</v-btn>
        </span>
        <pre v-if="lease.esignatures.length">{{lease.esignatures}}</pre>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      lease: {
        unit_number: null,
        bluemoon_id: null,
        id: null,
        esignatures: [],
      }
    };
  },
  watch: {
    '$route' (to, from) {
        console.log(to, from);
    }
  },
  methods: {
    launchEditor: function () {
      console.log('what do i do?');
    },
    generatePDF: function () {
      console.log('fetch some forms in a modal or something');
    },
    requestEsignature: function () {
      console.log('same forms, maybe just do that?');
    }
  },
  mounted() {
    const token = localStorage.getItem('jwt');
    const path = '/lease/' + this.$route.params.id;
    this.$http
      .get(path, { headers: { Authorization: 'Bearer ' + token } })
      .then(response => {
        this.lease = response.data;
      })
      .catch(function(error) {
        console.error(error.response);
      });
  }
};
</script>
