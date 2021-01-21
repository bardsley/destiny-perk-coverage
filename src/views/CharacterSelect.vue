<template>
  <div class="character-select">
    <h1>Select a character</h1>
    <div v-for="(char, name) in characters" v-bind:key="name"
      :style="'background-color: rgb(' + char.emblemColor.red + ',' + char.emblemColor.green + ',' + char.emblemColor.blue + ',0.2);'">
      <div class="character" :style="'background-image: url(\'//bungie.net' + char.emblemBackgroundPath + '\');'"
        @click="char.inventory && char.showInventory ? char.showInventory = false : characterEquipment(char.characterId)">
        <div class="contents">
          <h2>{{ char.light }}</h2>
          <p>Last Played: {{ $dateStr(Date.parse(char.dateLastPlayed)) }}</p>
        </div>
      </div>
      <div v-if="char.showInventory" class="inventory">
        <div v-if="!char.inventory">
          Loading
        </div>
        <template v-else>
          <h2>Equipped</h2>
          <div class="item" v-for="(item,key) in char.inventory" v-bind:key="key"
            @click="inspectItem(item.itemInstanceId)" >
            <img v-if="item.displayProperties.hasIcon" :src="'//bungie.net'+item.displayProperties.icon"/><br/>
            <div class="details">
              <h2>{{ item.displayProperties.name }}</h2>
              <span v-for="(hashId) in item.itemCategoryHashes" :key="hashId">
                {{categories[hashId].displayProperties.name || "n/a"}},
              </span>
              
            </div>
          </div>
        </template>
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
import { getItemDefinition,setUpCategories,getItemInstance } from "@/api/manifest";

export default {
  data() {
    return {
      membership: {},
      membershipId: null,
      membershipType: null,
      characters: {},
      categories:{},
    };
  },
  async created() {
    setUpCategories().then((cats)=>{this.categories = cats });
    // let vm = this
    this.membership = await getMembership();
    this.membershipId = this.membership.destinyMemberships[0].membershipId;
    this.membershipType = this.membership.destinyMemberships[0].membershipType;
    this.characters = await getCharacters(this.membershipType,this.membershipId)
  },
  methods: {
    async characterEquipment(characterId) {
      this.$set(this.characters[characterId],'showInventory',true)
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

  .character {
    width: 100%;
    padding-top: 20%;
    background-size: 100%;
    height: 0;
    overflow: hidden;
    background-color: white;
    position: relative;

    .contents {
      position: absolute;
      top: 0;
      right: 0;
      min-width: 30%;
      height: 100%;
      color: #fff;
      background: rgba(0,0,0,0.5);
      padding: 1em 1.5em 1em 2em ;
      text-align: right;

      h2 {
        font-size: 3em;
        padding:0;
        margin:0;
        text-align: right;
      }
      p { margin:0;}
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