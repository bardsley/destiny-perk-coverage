<template>
  <div class="about">
    <h1>This is an about page</h1>
    <button @click="getCharacterHit">Get Character</button>
    <button @click="clickRefreshToken">Refresh Access</button>
    <pre>
      {{ membership }}
    </pre>

    <pre>
      {{ characters }}
    </pre>
  </div>
</template>

<script>
// import { getMembership } from '@/api/getCharacters';
import { getCharacters, getMembership } from '@/api/getCharacters';
import { refreshToken } from '@/api/refreshToken';

export default {
  data() {
    return {
      membership: {},
      membershipId: null,
      membershipType: null,
      characters: {}
    }
  },
  methods: {
    clickRefreshToken() {
      refreshToken()
    },
    getCharacterHit() {
      console.log("Make request")
      getMembership().then((membership) => {
        console.log("It came back",membership)
        this.membership = membership
        this.membershipId = this.membership.destinyMemberships[0].membershipId
        this.membershipType = this.membership.destinyMemberships[0].membershipType
      // });
      }).then(() => {
        getCharacters(this.membershipType,this.membershipId).then((characters) => {
          console.log("It came back",characters)
          this.characters = characters
        })
      })
    }
  },
}
</script>
<style scoped lang="scss">
pre {
  text-align: left; 
}
</style>