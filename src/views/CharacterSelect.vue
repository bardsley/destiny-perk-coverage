<template>
  <div class="character-select">
    <h1>Select a character</h1>
    <div v-for="(char, name) in characters" v-bind:key="name"
      :style="'background-color: rgb(' + char.emblemColor.red + ',' + char.emblemColor.green + ',' + char.emblemColor.blue + ',0.2);'">
      <div class="character" :style="'background-image: url(\'//bungie.net' + char.emblemBackgroundPath + '\');'"
        @click="toggleCharacterEquipment(char)">
        <div class="contents">
          <h2>{{ char.light }}</h2>
          <p>Last Played: {{ $dateStr(Date.parse(char.dateLastPlayed)) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { tokenExpired } from '@/api/refreshToken';
import { getCharacters, getMembership, getCharacterItems, } from "@/api/getCharacters";
import { getItemDefinition, setUpCategories, getItemInstance } from "@/api/manifest";

export default {
  props: ['characterId'],
  data() {
    return {
      membership: {},
      membershipId: null,
      membershipType: null,
      characters: {},
      categories:{},
      selectedChar: {}
    };
  },
  async created() {
    if(tokenExpired()) { 
      console.log("Token expired")
      this.$router.push({ name: 'BungieAuth' })
    } else { 
      setUpCategories().then((cats)=>{this.categories = cats })
      this.membership = await getMembership();
      this.membershipId = this.membership.destinyMemberships[0].membershipId;
      this.membershipType = this.membership.destinyMemberships[0].membershipType;
      this.$emit('setMembership',{ id: this.membershipId, type: this.membershipType })
      this.characters = await getCharacters(this.membershipType,this.membershipId)
    }
  },
  computed: {
    inventorySize() {
      if( typeof(this.selectedChar.inventory) == "undefined" ) { return 'not loaded' }
      else if( typeof(this.selectedChar.inventory) == 'string') { return this.selectedChar.inventory }
      else if( typeof(this.selectedChar.inventory) == 'object') {  return this.selectedChar.inventory.length }
      else { return '' }
    }
  },
  methods: {
    toggleCharacterEquipment(char) {
      if( char.characterId == this.selectedChar.characterId && char.inventory && char.showInventory ) {
        char.showInventory = false 
      } else {
        this.$router.push({name: 'Character', params: { characterId: char.characterId }})
        this.characterEquipment(char.characterId)
      }
    },
    async characterEquipment(characterId) {
      this.$set(this.characters[characterId],'showInventory',true)
      this.selectedChar = this.characters[characterId]
      let characterItems = await getCharacterItems(this.membershipType,this.membershipId,characterId)
      let tempEquipped = characterItems.equipment.data.items
      let tempOnCharacter = characterItems.inventory.data.items
      let tempEquipment = Object.assign(tempEquipped,tempOnCharacter)
      let downloadedEquipment = await Promise.all(
        tempEquipment.map(async (item) => {
          let itemDef = await getItemDefinition(item.itemHash)
          return Object.assign(itemDef,item)
        })
      )
      this.$set(this.characters[characterId],'inventory',downloadedEquipment)
    },
    async inspectItem(itemInstanceId) {
      let itemInfo = getItemInstance(this.membershipType,this.membershipId,itemInstanceId).then((itemInfo) => {
        console.log(itemInfo)
      })
      return itemInfo
    }
  },
};

</script>

<style lang="scss" scoped>

.character-select {
  display: flex; flex-wrap: wrap;
  h1 { width: 100%; }
  >div { min-width: 340px; min-height: 68px;}

  .character {
    width: 100%;
    padding-top: 20%;
    background-size: 100%;
    // height: 0;
    overflow: hidden;
    background-color: white;
    background-position-y: 5px;
    position: relative;

    .contents {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 30%;
      max-width: 50%;
      height: 100%;
      color: #fff;
      background: rgba(0,0,0,0.5);
      padding: 0.5em 1em 0.5em 1em ;
      text-align: right;
      h2 {
        font-size: 1.2em;
        padding:0;
        margin:0;
        text-align: right;
      }
      p { margin:0; font-size: 0.8em;}
    }

  }

  .inventory {
    display:flex;
    flex-wrap: wrap;

    > h2 {
      width: 100%; font-size: 2em; margin:0; padding: 0.25em 0 0.25em 0.5em; color: #fff; background: #333;
      border-bottom: solid var(--item-border-width) #fff;
    }

    .item { 
      width: 50%; display: flex; 
      border-bottom: solid var(--item-border-width) #fff; border-right: solid var(--item-border-width) #fff;

      img { flex-grow: 2; max-width:48px; max-height: 48px;}
      .details { 
        flex-grow: 2; margin-left: 1em;
        h2 { margin: 0 ; }
      }

    }
  }
}
</style>