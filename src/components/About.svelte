<script>
</script>

<div class="overflow">
<h1>About</h1>
  <center>
      <h2>
          Playing College Football Risk
      </h2><br>
  </center>
  <h3> What is College Football Risk? </h3>
  <p id="what">
      College Football Risk is a multiplayer game where teams can work together to control a map of North America. The objective is for a team to have the largest number of territories of any team at the end of the season.
  </p>
  <h3> How does the game work? </h3>
  <p id="gameplay">
      Every day at 21:30 U.S. Central Standard Time, the map is redrawn. For each territory on the map, the total <a href="#starpower">starpower</a> is calculated for each team that made moves in that territory. A random number is drawn and
      the team who's player that number corresponds to is labeled
      <a href="#mvp">MVP</a> and wins the territory for that team.
  </p>
  <h3> How is this different from older versions of College Football Risk? </h3>
  <p>
      This game is quite similar to older versions of CFR. However, this version of the game is predominately open-source. Anyone can go look at its <a rel="noreferrer" href="https://github.com/mautamu/Risk">code</a>, and submit pull requests
      to change the game.
      <br> This version of the game is written in the programming language <a rel="noreferrer" href="https://www.rust-lang.org/" style="background-color:#B9420F;">Rust</a>. A list of ways it deviates from CFR can be found on the <u><a rel="noreferrer" href="https://github.com/mautamu/Risk/blob/stable/documentation/DEVIATIONS.md">GitHub</a></u>.
  </p>
  <p>
      For each turn, if a team controls only one territory each player is granted the ability to triple or nothing their power. This means that teams which are on the verge of being eliminated may be able to recuperate some of their ability to strike back and
      to allow for time to strategize or recruit.
  </p>
  <p>
      Finally, because this game does not have a chaos team, all players on a dead team are prompted to join a new team.
  </p>
  <h3> How do I get stars / move up in rank? </h3>
  <p id="points"> Your total/overall starcount is the <i>median</i> of your stars for each of the following categories:
      </p><ul>
          <li>MVPS (when you are the MVP of a territory):<br>
              <ul style="text-indent:25px;list-style:circle;">
                  <li>0 MVPS: 1 Star</li>
                  <li>1-4 MVPS: 2 Stars</li>
                  <li>5-9 MVPS: 3 Stars</li>
                  <li>10-24 MVPS: 4 Stars</li>
                  <li>25+ MVPS: 5 Stars</li>
              </ul>
          </li><br><br>
          <li>Turns (how many turns you've had in all College Football Risk games):<br>
              <ul style="text-indent:25px;list-style:circle;">
                  <li>0-9 Turns: 1 Star</li>
                  <li>10-24 Turns: 2 Stars</li>
                  <li>25-49 Turns: 3 Stars</li>
                  <li>50-99 Turns: 4 Stars</li>
                  <li>100+ Turns: 5 Stars</li>
              </ul>
          </li><br><br>
          <li>Game Turns (all the turns you've made in this game):<br>
              <ul style="text-indent:25px;list-style:circle;">
                  <li>0-4 Turns: 1 Star</li>
                  <li>5-9 Turns: 2 Stars</li>
                  <li>10-24 Turns: 3 Stars</li>
                  <li>25-39 Turns: 4 Stars</li>
                  <li>40+ Turns: 5 Stars</li>
              </ul>
          </li><br><br>
          <li>Bonus (automatically applied five stars):<br>
              <!--<ul style="text-indent:25px;list-style:circle;">
                  <li>0 Stars: 1 Star</li>
                  <li>1 Star: 2 Stars</li>
                  <li>2 Stars: 3 Stars</li>
                  <li>3 Stars: 4 Stars</li>
                  <li>4 Stars/5 Stars: 5 Stars</li>
              </ul>-->
          </li><br><br>
          <li>Streak (how many consecutive turns you've made):<br>
              <ul style="text-indent:25px;list-style:circle;">
                  <li>0-2 Turns: 1 Star</li>
                  <li>3-4 Turns: 2 Stars</li>
                  <li>5-9 Turns: 3 Stars</li>
                  <li>10-24 Turns: 4 Stars</li>
                  <li>25+ Turns: 5 Stars</li>
              </ul>
          </li>
</ul>
</div>

<style>
  h1 {
    font-size: 2rem;
    text-align: center;
  }

  :global(.table) {
    color: var( --main-foreground-color);
    background: var(--main-background);
  }

  .overflow{
        height: 100%;
        overflow: auto;
        width: 90%;
        margin-left: auto;
        margin-right: auto;
    }
</style>