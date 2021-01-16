<template>
  <div class="character-select">
    <h1>Select a character</h1>
    <!-- <pre>
            {{ characters }}emblemColor": {
    "red": 0,
    "green": 107,
    "blue": 255,
    "alpha": 255
  }
        </pre> -->
    <div
      v-for="(char, name) in characters"
      v-bind:key="name"
      :style="
        'background-color: rgb(' +
        char.emblemColor.red +
        ',' +
        char.emblemColor.green +
        ',' +
        char.emblemColor.blue +
        ',0.2);'
      "
    >
      <div
        class="character"
        :style="
          'background-image: url(\'//bungie.net' +
          char.emblemBackgroundPath +
          '\');'
        "
      >
        <div class="contents">
          {{ char.light }}
        </div>
      </div>

      <pre>
                {{ char }}
            </pre
      >
    </div>

    <ul>
      <li v-for="item in equipment" :key="item.itemHash">
        {{ item }}
      </li>
    </ul>
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
      equipment: [],
    };
  },
  async created() {
    this.membership = await getMembership();
    this.membershipId = this.membership.destinyMemberships[0].membershipId;
    this.membershipType = this.membership.destinyMemberships[0].membershipType;
    this.characters = await getCharacters(this.membershipType,this.membershipId)
    let characterId = Object.keys(this.characters)[0]
    let characterItems = await getCharacterItems(this.membershipType,this.membershipId,characterId)
    console.debug(characterItems)
    let tempEquipment = characterItems.equipment.data.items
    console.log(tempEquipment)
    let downloadedEquipment = await Promise.all(
        tempEquipment.map(async (item) => {
            console.log(item.itemHash)
            let itemDef = await getItemDefinition(item.itemHash)
            return itemDef
        })
    )
    console.log(downloadedEquipment)
    this.equipment = downloadedEquipment
    // getMembership().then((membership) => {
    //     this.membership = membership
    //     this.membershipId = this.membership.destinyMemberships[0].membershipId
    //     this.membershipType = this.membership.destinyMemberships[0].membershipType
    // }).then(() => {
    //     getCharacters(this.membershipType,this.membershipId).then((characters) => {
    //         this.characters = characters.data
    //     }).then(() => {
    //         let characterId = Object.keys(this.characters)[0]
    //         getCharacterItems(this.membershipType,this.membershipId,characterId).then(async (response) =>{
    //             let tempEquipment = response.equipment.data.items
    //             console.log(tempEquipment)
    //             this.equipment = await Promise.all(
    //                 tempEquipment.map(async (item) => {
    //                    await getItemDefinition(item.itemhash)
    //                 })
    //             )
    //         })

    //     })
    // })
  },
  methods: {},
};

// let characterResponse = await fetch('http://swapi.co/api/people/2/')
// let characterResponseJson = await characterResponse.json()
// let films = await Promise.all(
//   characterResponseJson.films.map(async filmUrl => {
//     let filmResponse = await fetch(filmUrl)
//     return filmResponse.json()
//   })
// )
// console.log(films)
</script>

<style lang="scss" scoped>
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