<template>
  <v-container>
    <v-dialog v-model="pdfDialog" persistent max-width="300px">
      <v-card>
        <v-card-title class="headline">Your document is ready.</v-card-title>
        <v-card-text text-align="center">
          <a :href="downloadUrl" _target="blank">Download</a>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="green darken-1" text @click="pdfDialog = false">Close</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-dialog v-model="executeDialog" persistent max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">User Profile</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="executeData.name" label="Name" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="executeData.initials" label="Initials*" required></v-text-field>
              </v-col>
              <v-col cols="12">
                <v-text-field v-model="executeData.title" label="Title*" required></v-text-field>
              </v-col>
            </v-row>
          </v-container>
          <small>*indicates required field</small>
        </v-card-text>
        <v-card-actions>
          <div class="flex-grow-1"></div>
          <v-btn color="blue darken-1" text @click="executeDialog = false">Close</v-btn>
          <v-btn color="blue darken-1" text @click="execute">Submit</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
    <v-layout wrap>
      <v-flex md12>
        <v-row>
          <v-col md4 align="left" justify="center">
            <h1 class="display-1">
              Lease: {{lease.unit_number}}
              <span v-if="lease.bluemoon_id !== null" class="subtitle-1"> Bluemoon Lease: {{ lease.bluemoon_id }}</span>
            </h1>
          </v-col>
          <v-col align="right" justify="center">
            <span v-if="lease.bluemoon_id === null">
             <v-btn v-if="showEditor === false" @click="launchEditor">Launch Lease Editor</v-btn>
              <v-btn v-if="showEditor === true" @click="closeEditor">Close Lease Editor</v-btn>
            </span>
            <span v-if="lease.bluemoon_id !== null">
              <router-link :to="'/document/' + lease.id">
                <v-btn>Generate Lease Document</v-btn>
              </router-link>
            </span>
          </v-col>
        </v-row>
      </v-flex>
      <v-divider></v-divider>
      <v-flex md12 v-if="showEditor">
        <div id="blueMoon"></div>
      </v-flex>
      <v-flex md12 v-if="lease.esignatures.length">
        <v-card class="mx-auto" v-for="item in lease.esignatures" :key="item.id">
          <v-card-title>
            Esignature Request
            <v-chip :color="statusColor(item.status)" :text-color="statusText(item.status)" class="ma-2 text-uppercase">{{item.status}}</v-chip>
          </v-card-title>
          <v-card-text>
            <p v-if="item.status === 'pending'">Waiting for Bluemoon Esignature request.</p>
            <p v-if="item.status === 'executed'">All actions are complete.</p>
            <span v-if="item.status === 'processing'"><p>Waiting for signers.</p></span>
            <span v-if="item.status === 'signed'">
              <p>Ready to counter-sign document.</p>
              <v-btn @click="executeDocument(item)">Counter-Sign Document</v-btn>
            </span>
            <span v-if="item.data && item.data.esign && item.data.esign.data && item.data.esign.data.signers">
              <v-simple-table fixed-header height="300px">
                <thead>
                  <tr>
                    <th class="text-left">Name</th>
                    <th class="text-left">Email</th>
                    <th class="text-left">Phone</th>
                    <th class="text-left">Completed</th>
                    <th class="text-left">Link</th>
                    <th class="text-left">Date Signed</th>
                    <th class="text-left">Identifier</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="signer in item.data.esign.data.signers.data" :key="signer.id">
                    <td class="text-left">{{ signer.name }}</td>
                    <td class="text-left">{{ signer.email }}</td>
                    <td class="text-left">{{ signer.phone }}</td>
                    <td class="text-left">{{ signer.completed }}</td>
                    <td class="text-left"><a :href="signer.signature_url" target="_blank">{{ signer.signature_url }}</a></td>
                    <td class="text-left">{{ signer.date_signed | formatDate}}</td>
                    <td class="text-left text-capitalize">{{ signer.identifier.replace(/_/g, ' ') }}</td>
                  </tr>
                </tbody>
              </v-simple-table>
            </span>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="getSignaturePdf(item)">View PDF</v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      pdfDialog: false,
      downloadUrl: null,
      executeDialog: false,
      executeData: {
        name: '',
        initials: '',
        title: '',
      },
      leaseEsignatureId: null,
      token: null,
      showEditor: false,
      editorLibraries: [
        ''
      ],
      forms: [],
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
      this.$log.debug(to, from);
    }
  },
  methods: {
    statusColor: function (status) {
      switch (status) {
        case 'executed':
          return 'green';
        case 'processing':
          return 'secondary';
        case 'signed':
          return 'primary';
        case 'pending':
          return 'red';
        default:
          break;
      }
    },
    statusText: function (status) {
      switch (status) {
        case 'executed':
        case 'pending':
          return 'white'
        default:
          break;
      }
    },
    getSignaturePdf: function (leaseEsignature) {
      const path = '/lease/esignature/pdf/' + leaseEsignature.id;
      const token = localStorage.getItem('jwt');
      this.$http
        .get(path, { headers: { Authorization: 'Bearer ' + token } })
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
    launchEditor: function () {
      const path = '/configuration/' + this.$route.params.id;
      this.showEditor = true;
      this.$http
        .get(path, { headers: { Authorization: 'Bearer ' + this.token } })
        .then(response => {
          window.BLUEMOON_CONFIG = response.data;
          const bmContainer = document.getElementById('blueMoon');
          const appRoot = document.createElement('app-root');
          bmContainer.appendChild(appRoot);
          const scriptTag = document.createElement('script');        
          scriptTag.setAttribute('src', '//cdn.bluemoonforms.com/editor/main.bundle.js');
          bmContainer.appendChild(scriptTag);
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    closeEditor: function () {
      window.BLUEMOON_CONFIG = null;
      window.CALLBACK_ID = null;
      const bmContainer = document.getElementById('blueMoon');
      while (bmContainer.firstChild) {
        bmContainer.removeChild(bmContainer.firstChild);
      }
      this.showEditor = false;
    },
    fetchLease: function () {
      const path = '/lease/' + this.$route.params.id;
      this.$http
        .get(path, { headers: { Authorization: 'Bearer ' + this.token } })
        .then(response => {
          this.lease = response.data;
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    },
    executeDocument: function (leaseEsignature) {
      this.leaseEsignatureId = leaseEsignature.id;
      this.executeDialog = true;
      this.$log.debug('execute document');
    },
    execute: function() {
      const path = '/lease/execute/' + this.leaseEsignatureId;
      this.$http
        .post(path, this.executeData, { headers: { Authorization: 'Bearer ' + this.token } })
        .then(response => {
          this.executeDialog = false;
          if (response.data.success) {
            this.fetchLease();
          } else {
            this.$log.error(response.data);
          }
        })
        .catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
    }
  },
  mounted() {
    this.token = localStorage.getItem('jwt');
    this.fetchLease();
  }
};
</script>
