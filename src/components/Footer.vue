<template>
    <div id="footer">

      <div class="section">
        <h2>Cool Destiny2 Tools</h2>
        <ul>
          <li><a href="https://www.braytech.org/">Braytech</a> <a href="https://beta.braytech.org/">(Beta)</a></li>
          <li><a href="https://www.light.gg/god-roll/roll-appraiser/">Light.gg Roll Appraiser</a></li>
          <li>Destiny Recipes <a href="https://destinyrecipes.com/vault">Vault Cleaner</a> &amp; <a href="https://destinyrecipes.com/loot">Loot companion</a></li>
          <li><a href="https://destinytracker.com/destiny-2/profile/steam/4611686018484097098/overview">Destiny Tracker</a></li>
          <li><a href="https://data.destinysets.com/">Destiny Data Explorer</a></li>
          <li><a href="https://guardian.report/?view=LOADOUT&guardians=4611686018484097098,4611686018430675293,4611686018505197451">Guardian Report</a></li>
          <li>Steam <a href="https://steamdb.info/calculator/76561198008853293/?cc=uk">Database</a> <a href="https://steamidfinder.com/lookup/abards/">ID Finder</a></li>
        </ul>
      </div>

      <div class="section">
        <h2>Destiny2 Build &amp; Guide Articles</h2>
        <ul>
          <li><a href="https://www.thegamer.com/destiny-2-10-builds-you-need-to-try-in-beyond-light/">10 Beyond Light builds</a></li>
          <li><a href="https://screenrant.com/best-pve-titan-builds-destiny-2-beyond-light/">PVE Titan Builds</a></li>
          <li><a href="https://screenrant.com/destiny-2-beyond-light-best-pve-hunter-builds/">PVE Hunter Builds</a></li>
          <li><a href="https://www.thegamer.com/exotics-titans-destiny-2-ranked/">Titan Exotics Ranked</a></li>
          <li><a href="https://www.thegamer.com/destiny-2-beyond-light-aspects-guide-find/">Stasis Aspect Guide</a></li>
          <li><a href="https://www.pcgamer.com/uk/get-infinite-grenades-with-this-absurd-destiny-2-shadebinder-build/">Shadebinder Warlock</a></li>
        </ul>
      </div>

      <div class="section">
        <h2>Perk Coverage v0.1.1</h2>
        <p>This app is an experiment by <a href="https://adambardsley.co.uk">Adam</a> in using the destiny API to provide useful info to Destiny players</p>
      </div>

    </div>
</template>

<style lang="scss">
  #footer {
    width: calc(100% + 1.5em); 
    display: flex; justify-content: space-around;
    // position: absolute; bottom:0; left:0;
    margin: 1em -1em -0.5em -1em;
    background: var(--footer); color: var(--footer-text);

    a { text-decoration: none; color: var(--footer-text); }
    .section:last-child { border-right:none; }
    .section {
      // border-right: solid 1px var(--gentle-edge); 
      max-width: 33%; padding: 1em; margin:0;

      h2 { font-size: 1.2em; margin:1em 1em 0.5em 0; border-bottom: solid 1px var(--gentle-edge); padding-bottom: 0.6em; }
      ul { list-style: none; margin:0 0 1em 0; padding:0;}
      li { margin-bottom: 0.3em; }
      li:after { content: ' \279E'; color: var(--gentle-edge) }
    }
  }
</style>