<template>
  <v-container>
    <v-layout text-center wrap>
      <v-flex md12>
        <form>
          <v-text-field v-model='username' :rules='usernameRules' label='Username' required></v-text-field>
          <v-text-field
            v-model='password'
            :rules='passwordRules'
            label='Password'
            required
            type='password'
          ></v-text-field>
          <v-btn class='mr-4' @click='submit'>submit</v-btn>
          <v-btn @click='clear'>clear</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  data() {
    return {
      username: '',
      password: '',
      usernameRules: [v => !!v || 'Username is required'],
      passwordRules: [v => !!v || 'Password is required']
    };
  },
  methods: {
    clear() {
      this.username = '';
      this.password = '';
    },
    submit() {
      if (this.password.length > 0) {
        this.$http.post('/login', {
          username: this.username,
          password: this.password
        }).then(response => {
          if (response.data.username) {
            localStorage.setItem('user', response.data.username);
            localStorage.setItem('jwt', response.data.access_token);

            if (localStorage.getItem('jwt') != null) {
              this.$emit('loggedIn');
              if (this.$route.params.nextUrl != null) {
                this.$router.push(this.$route.params.nextUrl);
              } else {
                this.$router.push('/');
              }
            }
          }
        }).catch(function(error) {
          // eslint-disable-next-line
          console.error(error);
        });
      }
    }
  }
};
</script>
