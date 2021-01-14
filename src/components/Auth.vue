<template>
  <h1>Redirecting... {{ authCode }}</h1>
</template>

<script>
import ClientOAuth2 from "client-oauth2";
// import cryptoRandomString from "crypto-random-string"; 

let bungieAuth = new ClientOAuth2({
  clientId: "35202",
  clientSecret: "rxIuYYnX3ZKJFUmtNXn5vE7dn0sZIfKLeo2yvo3yn7o",
  accessTokenUri: "https://www.bungie.net/platform/app/oauth/token/",
  authorizationUri: "https://www.bungie.net/en/oauth/authorize",
  redirectUri: "https://destiny-perk-coverage.web.app/auth/bungie/callback",
  // state:  cryptoRandomString({ length: 10, type: "url-safe" }),
  state: 'STATICSTATETEST'
});

// let returnedUri = 'https://localhost:8080/auth/bungie/callback?code=cd426fd756780f00ec5eec9f148c5637'

// 

export default {
  props: ["authCode"],
  async created() {
    if(this.authCode) {
      console.log("get a Access Token")
      console.log(this.$router.currentRoute.path)
      console.log(window.location.host)
      let thisUri = 'https://destiny-perk-coverage.web.app/auth/bungie/callback?code='+this.authCode
      thisUri = window.location.href
      let token = await bungieAuth.code.getToken(thisUri,{ headers: { 'x-api-key': '1c57e1390a134c1492de01238975680e'} })
      console.log('TOKEN',token)
    } else {
      let requestUri = bungieAuth.code.getUri();
      console.log(requestUri);
      window.location.href = requestUri
      
    }
  },
};
</script>