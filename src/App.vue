<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link>
      <router-link to="/experiment/1/2/3">Experiment</router-link>
      <router-link :to="{ name: 'CharacterSelect' }">Change Character</router-link>
      <router-link v-if="membershipId" :to="{ name: 'Vault', params: { membershipType: membershipType, membershipId: membershipId }}">Vault</router-link>
      <router-link v-if="membershipId" :to="{ name: 'PerkGraph', params: { membershipType: membershipType, membershipId: membershipId }}">Perk Graph</router-link>
      <!-- <router-link to="/about">About</router-link> -->
      <!-- <router-link :to="{name: 'BungieAuth'}">Auth</router-link> -->
      <!-- <router-link :to="{name: 'Onboard'}">Onboard</router-link> -->
      <!-- <router-link :to="{name: 'PerkSelect'}">Perks</router-link> -->
      <!-- <router-link v-if="true" :to="{ name: 'Experiment', params: navInfo }">Vault</router-link> -->
    </div>

    <router-view @setMembership="setMembership"/>

    <Footer></Footer>
    
  </div>
</template>

<script>
// import {getCategories} from '@/api/manifest'
import Footer from '@/components/Footer.vue'

export default {
  data() {
    return {
      categories: {},
      navInfo: {},
      membershipId: null,
      membershipType: null,
    }
  },
  created() {
    if(window.location.host == "destiny-perk-coverage.web.app") { 
      localStorage.setItem('x-api-key','1c57e1390a134c1492de01238975680e')
    } else {
      localStorage.setItem('x-api-key','742c14f071164cef9bb681b545c3e7be')
    }
  },
  methods: {
    setMembership(membership) {
      this.membershipId = membership.id
      this.membershipType = membership.type
    }
  },
  components: {
    Footer
  },
}
</script>

<style lang="scss">
:root {
  // Widths
  --item-border-width: 3px;
  // Colours
  --nav: rgba(0,0,0,255); // #1a1a1a;
  --footer: #1a1a1a;
  --footer-text: #efeeee;
  --gentle-edge: rgba(255,255,255,0.1);
  --gentle-backing: rgba(255,255,255,0.4);
  --background: rgba(222, 212, 212, 1);
  --links: rgb(191, 50, 50);
  --active: rgb(212, 30, 30);
  --dark-background: rgba(0,0,0,0.8);
  --locked-background: rgba(55, 126, 64, 0.8);
  --locked-empty: rgba(55, 126, 64, 0.1);
  --unlocked-background:  rgba(241, 145, 0, 0.3);
  --unlocked-total: rgba(161, 56, 56, 0.8);
  --unlocked-empty: rgba(161, 56, 56, 0.1);
}
body { background: var(--background); padding: 3rem 0 0rem 0;}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;

  color: #2c3e50;
  box-sizing: border-box; * { box-sizing: border-box; }

  a { color: var(--links); text-decoration: none; }

  #nav {
    background: var(--nav);
    width: 100%;
    position:fixed; top:0; left:0;
    display:flex;
    z-index: 1000;
    a {
      font-weight: bold;
      color: var(--links);
      
      padding: 15px 30px;

      &.router-link-exact-active {
        color: var(--active);
        background: var(--gentle-edge);
      }
    }
  }

}


</style>
