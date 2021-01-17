<template>
  <div class="character-select">
    <h1>Select a character</h1>
    <div v-for="(char, name) in characters" v-bind:key="name"
      :style="'background-color: rgb(' + char.emblemColor.red + ',' + char.emblemColor.green + ',' + char.emblemColor.blue + ',0.2);'">
      <div class="character" :style="'background-image: url(\'//bungie.net' + char.emblemBackgroundPath + '\');'">
        <div class="contents">
          {{ char.light }}
        </div>
      </div>
      <div class="inventory">
        <div class="item" v-for="(item,key) in char.inventory" v-bind:key="key">
          <img v-if="item.displayProperties.hasIcon" :src="'//bungie.net'+item.displayProperties.icon"/><br/>
          <div class="details">
            <h2>{{ item.displayProperties.name }}</h2>
            <pre>{{ item.itemCategoryHashes }}</pre>
          </div>
        </div>
      </div>
      
      <!-- <pre>{{ char }} </pre> -->
    </div>

    <!-- <ul>
      <li v-for="item in equipment" :key="item.itemHash">
        <pre>{{ item }}</pre>
      </li>
    </ul> -->
  </div>
</template>

<script>
// import { getMembership } from '@/api/getCharacters';
import {
  getCharacters,
  getMembership,
  getCharacterItems,
} from "@/api/getCharacters";
import { getItemDefinition } from "@/api/manifest";

export default {
  data() {
    return {
      membership: {},
      membershipId: null,
      membershipType: null,
      characters: {},
    };
  },
  async created() {
    let vm = this
    this.membership = await getMembership();
    this.membershipId = this.membership.destinyMemberships[0].membershipId;
    this.membershipType = this.membership.destinyMemberships[0].membershipType;
    this.characters = await getCharacters(this.membershipType,this.membershipId)
    Object.keys(this.characters).forEach( async (characterId) => { 
      let inventory = await this.characterEquipment(characterId)
      vm.$set(this.characters[characterId],'inventory',inventory)
    })
  },
  methods: {
    async characterEquipment(characterId) {
      let characterItems = await getCharacterItems(this.membershipType,this.membershipId,characterId)
      let tempEquipment = characterItems.equipment.data.items
      let downloadedEquipment = await Promise.all(
        tempEquipment.map(async (item) => {
          let itemDef = await getItemDefinition(item.itemHash)
          return itemDef
        })
      )
      console.log(downloadedEquipment)
      return downloadedEquipment
    },
    async loadCategories() {
      
    }
  },
};

</script>

<style lang="scss" scoped>
.character-select .inventory {
  display:flex;
  flex-wrap: wrap;
}
.character-select .inventory .item { width: 50%; display: flex;}
.character-select .inventory .item img { flex-grow: 2; max-width:100px; max-height: 100px;}
.character-select .inventory .item .details { flex-grow: 2; margin-left: 1em;}
.character-select .character {
  width: 100%;
  padding-top: 20%;
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
  color: #fff;
  padding: 1em;
}
</style>