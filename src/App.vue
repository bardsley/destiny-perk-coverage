<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link> |
      <router-link :to="{name: 'BungieAuth'}">Auth</router-link> | 
            <router-link :to="{name: 'CharacterSelect'}">Character Select</router-link>

    </div>

    <router-view/>
  </div>
</template>

<script>
// import {getCategories} from '@/api/manifest'

export default {
  data() {
    return {
      categories: {}
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
    
  }
}
</script>

<style lang="scss">
:root {
  // Widths
  --item-border-width: 3px;
}

#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;

  box-sizing: border-box;
  * {
    box-sizing: border-box;
  }
}

#nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
