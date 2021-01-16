<template>

  <div class="info">
    <h1>Redirecting...</h1> 
  </div>
  
</template>

<script>
let bungieAuthConfig = {
  accessTokenUri: "https://www.bungie.net/platform/app/oauth/token/",
  authorizationUri: "https://www.bungie.net/en/oauth/authorize",
  state: 'STATICSTATETEST'
}
let api_key = ''
import ClientOAuth2 from "client-oauth2";
import { storeToken,retrieveToken,tokenExpired,refreshToken } from '@/api/refreshToken'
// import cryptoRandomString from "crypto-random-string"; 

if(window.location.host == 'destiny-perk-coverage.web.app') {
  console.debug("Using live config")
  bungieAuthConfig.clientId = "35202",
  bungieAuthConfig.clientSecret = "rxIuYYnX3ZKJFUmtNXn5vE7dn0sZIfKLeo2yvo3yn7o",
  api_key = "1c57e1390a134c1492de01238975680e"
} else {
  console.debug("Using local config")
  bungieAuthConfig.clientId = "35259",
  bungieAuthConfig.clientSecret = "6tgrKtTvbN0rSmAhSOFBDAbBOdfj0cFdWMTzmwGVJwU",
  api_key = "742c14f071164cef9bb681b545c3e7be"
}
let bungieAuth = new ClientOAuth2(bungieAuthConfig);

export default {
  props: ["authCode"],
  async created() {
    if(!retrieveToken()) {
      console.debug('No token')
      if(this.authCode) {
        console.log("Get a Access Token using authCode", this.authCode)
        let thisUri = window.location.href
        bungieAuth.code.getToken(thisUri,{ headers: { 'x-api-key': api_key } }).then((token) => {
          storeToken(token.data)
          window.location.pathname = '/'
        })
      } else {
        let requestUri = bungieAuth.code.getUri();
        console.debug('Getting an Auth code from ', requestUri )
        window.location.href = requestUri
      }
    } else {
      const tokenExpiry = parseInt(localStorage.getItem('token_expires'))

      console.debug("We have a token, Expires: ",new Date(tokenExpiry).toString()
      )
      if(tokenExpired()) { refreshToken() }
      window.location.pathname = '/'
    }
    
  },
  methods: {
   
  }
};
</script>