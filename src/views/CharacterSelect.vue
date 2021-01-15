<template>
    <div class="character-select">
        <h1>Select a character</h1>
        <!-- <pre>
            {{ characters }}
        </pre> -->
        <div v-for="(char,name) in characters" v-bind:key="name"
            class="character" :style="'background-image: url(\'//bungie.net'+char.emblemBackgroundPath+'\');'" >
            <div class="contents">
                {{char.light}}
            </div>
        
        </div>
        
    </div>
</template>

<script>
// import { getMembership } from '@/api/getCharacters';
import { getCharacters, getMembership } from '@/api/getCharacters';

export default {
  data() {
    return {
      membership: {},
      membershipId: null,
      membershipType: null,
      characters: {}
    }
  },
  created() {
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
        this.characters = characters.data
    })
    })
    
},
  methods: {
    
  },
}
</script>

<style lang="scss" scoped>
    .character-select .character {
        width: 100%;
        padding-top:20%;
        background-size: 100%;
        height: 0;
        overflow: hidden;
        background-color: white;
        position: relative;
    }
    .character-select .character .contents {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }

</style>