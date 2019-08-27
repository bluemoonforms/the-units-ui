<template>
  <v-container>
    <v-dialog v-model="pdfDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Your document is ready.</v-card-title>
        <v-card-text text-align="center"><a :href="downloadUrl" _target="blank">Download</a></v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="pdfDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="esignDialog" persistent max-width="290">
      <v-card>
        <v-card-title class="headline">Esignature Requested</v-card-title>
        <v-card-text text-align="center">
          <p v-if="esignatureSuccess === false">Unable to request esignature, please try again.</p>
          <p v-if="esignatureSuccess">Esignatures are pending, thanks!.</p>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="esignDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout v-if="ready" text-center wrap>
      <v-flex md12>
        <v-row>
          <v-col md4 align="left" justify="center">
            <h1 class="display-1">
              Request Esignature or PDF
            </h1>
          </v-col>
          <v-col align="left" justify="center">
            <v-btn @click="requestPDF">PDF</v-btn>
            <v-btn @click="requestEsignature">Esignature</v-btn>
          </v-col>
        </v-row>
      </v-flex>
      <v-flex md12>
        <v-row>
          <v-data-table
            v-model="selected"
            :headers="headers"
            :items="items"
            :items-per-page="-1"
            :single-select="singleSelect"
            :disable-filtering="disabledOptions"
            :disable-sort="disabledOptions"
            :disable-pagination="disabledOptions"
            :hide-default-footer="disabledOptions"
            item-key="name"
            show-select
            class="elevation-1"
          >
            <template v-slot:item.contract="{ item }">
              <v-chip color="primary" v-if="item.contract">Contract</v-chip>
            </template>
            <template v-slot:item.esignature="{ item }">
              <v-chip color="green" text-color="white" v-if="item.esignature">Esignature</v-chip>
              <v-chip v-if="item.esignature === false">Print Only</v-chip>
            </template>
          </v-data-table>
        </v-row>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      ready: false,
      pdfDialog: false,
      esignDialog: false,
      esignSuccess: false,
      downloadUrl: null,
      headers: [
        { text: 'Label', value: 'label' },
        { text: 'Name', value: 'name' },
        { text: '', value: 'contract' },
        { text: '', value: 'esignature' },
      ],
      singleSelect: false,
      disabledOptions: true,
      selected: [],
      items: [],
    };
  },
  methods: {
    requestPDF: function () {
      // Do some validation
      const path = '/lease/print/' +  this.$route.params.id;
      this.postFormsRequest(path)
        .then(response => {
          if (response.data.success) {
            this.pdfDialog = true;
            this.downloadUrl = response.data.url;
          }
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    requestEsignature: function () {
      // Do some validation, maybe request other data
      const path = '/lease/request/esign/' + this.$route.params.id;
      this.postFormsRequest(path)
        .then(response => {
          this.esignDialog = true;
          this.esignSuccess = (response.data.status) ? true : false;
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    postFormsRequest: function(path) {
      const token = localStorage.getItem('jwt');
      const forms = [];
      this.selected.forEach(function(selectedForm) {
        forms.push(selectedForm.name);
      });
      return this.$http.post(path, { forms: forms }, { headers: { Authorization: 'Bearer ' + token } });
    }
  },
  mounted() {
    const token = localStorage.getItem('jwt');
    const path = '/lease/forms';
    this.$http
      .get(path, { headers: { Authorization: 'Bearer ' + token } })
      .then(response => {
        this.items = response.data.data;
        response.data.data.forEach(element => {
          if (element.status === 'locked') {
            this.selected.push(element);
          }
        });
        this.ready = true;
      })
      .catch(function(error) {
        // eslint-disable-next-line
        console.error(error);
      });
  }
};
</script>
