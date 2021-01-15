<template>

  <div class="info">
    <h1>Redirecting...</h1> 
    <pre>
      {{this.token}}
    </pre> 
  </div>
  
</template>

<script>
let bungieAuthConfig = {
  // clientId: "35202",
  // clientSecret: "rxIuYYnX3ZKJFUmtNXn5vE7dn0sZIfKLeo2yvo3yn7o",
  accessTokenUri: "https://www.bungie.net/platform/app/oauth/token/",
  authorizationUri: "https://www.bungie.net/en/oauth/authorize",
  // redirectUri: "https://destiny-perk-coverage.web.app/auth/bungie/callback",
  // state:  cryptoRandomString({ length: 10, type: "url-safe" }),
  state: 'STATICSTATETEST'
}
let api_key = ''
import ClientOAuth2 from "client-oauth2";
// import cryptoRandomString from "crypto-random-string"; 

if(window.location.host == 'eac32a87cdd5.ngrok.io') {
  console.debug("Using local config")
  // bungieAuthConfig.redirectUri = Not set?
  bungieAuthConfig.clientId = "35259",
  bungieAuthConfig.clientSecret = "6tgrKtTvbN0rSmAhSOFBDAbBOdfj0cFdWMTzmwGVJwU",
  api_key = "742c14f071164cef9bb681b545c3e7be"
} else {
  console.debug("Using live config")
  bungieAuthConfig.redirectUri = "https://destiny-perk-coverage.web.app/auth/bungie/callback"
  bungieAuthConfig.clientId = "35202",
  bungieAuthConfig.clientSecret = "rxIuYYnX3ZKJFUmtNXn5vE7dn0sZIfKLeo2yvo3yn7o",
  api_key = "1c57e1390a134c1492de01238975680e"
}
let bungieAuth = new ClientOAuth2(bungieAuthConfig);

export default {
  props: ["authCode"],
  data() {
    return {
      token: null
    }
  },
  async created() {
    this.retrieveToken()
    if(!this.token) {
      console.log('No token')
      if(this.authCode) {
        console.log("Get a Access Token using authCode", this.authCode)
        let thisUri = window.location.href
        bungieAuth.code.getToken(thisUri,{ headers: { 'x-api-key': api_key } }).then((token) => {
          this.storeToken(token)
        })
      } else {
        let requestUri = bungieAuth.code.getUri();
        console.log('Getting an Auth code from ', requestUri )
        window.location.href = requestUri
      }
    }
    
  },
  methods: {
    storeToken(token) {
      const parsedToken = JSON.stringify(token.data);
      console.log('Storing Token',token.data, parsedToken)
      localStorage.setItem('test',true)

      localStorage.setItem('token',parsedToken)
      window.location.pathname = '/'
    },
    retrieveToken() {
      if (localStorage.getItem('token')) {
        try {
          this.token = JSON.parse(localStorage.getItem('token'));
        } catch(e) {
          console.error("Token Broken",e)
          localStorage.removeItem('token');
        }
      } 
    }
  }
};
</script>