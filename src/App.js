import React, { Component } from "react";
import Select from "react-select";

class App extends Component {
  constructor(props) {
    super(props);

    this.champions = [{name:"Aatrox",cost:3},{name:"Ahri",cost:2},{name:"Akali",cost:4},{name:"Anivia",cost:5},{name:"Ashe",cost:3},{name:"AurelionSol",cost:4},{name:"Blitzcrank",cost:2},{name:"Brand",cost:4},{name:"Braum",cost:2},{name:"Chogath",cost:4},{name:"Darius",cost:1},{name:"Draven",cost:4},{name:"Elise",cost:1},{name:"Evelynn",cost:3},{name:"Fiora",cost:1},{name:"Gangplank",cost:3},{name:"Garen",cost:1},{name:"Gnar",cost:4},{name:"Graves",cost:1},{name:"Karthus",cost:5},{name:"Kassadin",cost:1},{name:"Katarina",cost:3},{name:"Kayle",cost:5},{name:"Kennen",cost:3},{name:"Khazix",cost:1},{name:"Kindred",cost:4},{name:"Leona",cost:4},{name:"Lissandra",cost:2},{name:"Lucian",cost:2},{name:"Lulu",cost:2},{name:"MissFortune",cost:5},{name:"Mordekaiser",cost:1},{name:"Morgana",cost:3},{name:"Nidalee",cost:1},{name:"Poppy",cost:3},{name:"Pyke",cost:2},{name:"RekSai",cost:2},{name:"Rengar",cost:3},{name:"Sejuani",cost:4},{name:"Shen",cost:2},{name:"Shyvana",cost:3},{name:"Swain",cost:5},{name:"Tristana",cost:1},{name:"TwistedFate",cost:2},{name:"Varus",cost:2},{name:"Vayne",cost:1},{name:"Veigar",cost:3},{name:"Volibear",cost:3},{name:"Warwick",cost:1},{name:"Yasuo",cost:5},{name:"Zed",cost:2}];
    this.championOptions = this.champions.map(champ => { return { value: champ.name, label: champ.name }})

    this.state = {
      level: 6,
      championName: this.championOptions[0].value,
      numberInPlay: 0,
    }
  }

  championCost() {
    var champion = this.champions.find(c => c.name === this.state.championName);
    return champion.cost;
  }

  chanceOfCorrectCost(level, cost) {
    var levels = { 
      1: { 
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      2: { 
        1: 1.0,
        2: 0.0,
        3: 0.0,
        4: 0.0,
        5: 0.0,
      },
      3: { 
        1: 0.65,
        2: 0.30,
        3: 0.05,
        4: 0.0,
        5: 0.0,
      },
      4: { 
        1: 0.50,
        2: 0.35,
        3: 0.15,
        4: 0.0,
        5: 0.0,
      },
      5: { 
        1: 0.37,
        2: 0.35,
        3: 0.25,
        4: 0.03,
        5: 0.0,
      },
      6: { 
        1: 0.245,
        2: 0.35,
        3: 0.30,
        4: 0.10,
        5: 0.005,
      },
      7: { 
        1: 0.20,
        2: 0.30,
        3: 0.33,
        4: 0.15,
        5: 0.02,
      },
      8: { 
        1: 0.15,
        2: 0.25,
        3: 0.35,
        4: 0.20,
        5: 0.05,
      },
      9: { 
        1: 0.10,
        2: 0.15,
        3: 0.35,
        4: 0.30,
        5: 0.10,
      },
    }

    return levels[level][cost];
  }

  chanceOfCorrectChampion(cost) {
    var numberOfChampionsOfCost = {
      1: 12,
      2: 12,
      3: 12,
      4: 9,
      5: 6,
    }

    return 1.0 / numberOfChampionsOfCost[cost];
  }

  percentageOfChampionRemaining(cost, numberInPlay) {
    var copiesOfChampionsPerCost = { 
      1: 39,
      2: 26,
      3: 21,
      4: 13,
      5: 10,
    }

    return (copiesOfChampionsPerCost[cost] - numberInPlay) / copiesOfChampionsPerCost[cost];
  }

  chanceOfFindingChampion(cost, level, numberInPlay) {
    return this.chanceOfCorrectCost(level, cost) * this.chanceOfCorrectChampion(cost) * this.percentageOfChampionRemaining(cost, numberInPlay);
  }

  chanceOfFindingChampionInRoll(cost, level, numberInPlay) {
    var chance1 = this.chanceOfFindingChampion(cost, level, numberInPlay);
    var chance2 = (1 - chance1) * this.chanceOfFindingChampion(cost, level, numberInPlay);
    var chance3 = (1 - chance2) * this.chanceOfFindingChampion(cost, level, numberInPlay);
    var chance4 = (1 - chance3) * this.chanceOfFindingChampion(cost, level, numberInPlay);
    var chance5 = (1 - chance4) * this.chanceOfFindingChampion(cost, level, numberInPlay);

    return chance1 + chance2 + chance3 + chance4 + chance5;
  }

  numberOfRollsToHitConfidence(cost, level, numberInPlay, desiredConfidence) {
    const chanceOfSuccessfulRoll = this.chanceOfFindingChampionInRoll(cost, level, numberInPlay);
    let rollCount = 0;
    let chanceOfSuccess = 0;
    while ((chanceOfSuccess < desiredConfidence) && (rollCount < 100)) {
      rollCount += 1;
      chanceOfSuccess = chanceOfSuccess + ((1 - chanceOfSuccess) * chanceOfSuccessfulRoll);
    }
    return rollCount;
  }

  renderChancesForNextRoll() {
    if (this.state.level < 9) {
      return (
        <div>
          <div>
            {(this.chanceOfFindingChampionInRoll(this.championCost(), this.state.level, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.championName} next roll.
          </div>
          <div>
            {(this.chanceOfFindingChampionInRoll(this.championCost(), this.state.level + 1, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.championName} next roll if you level.
          </div>
        </div>
      )
    } else {
      return (
        <div>
          {(this.chanceOfFindingChampionInRoll(this.championCost(), this.state.level, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.championName} next roll.
        </div>
      )
    }
  }

  renderChancesForMultipleRolls() {
    return (
      <div>50% chance to hit {this.state.championName} if you roll {this.numberOfRollsToHitConfidence(this.championCost(), this.state.level, this.state.numberInPlay, 0.5)} times.</div>
    );
  }


  render() {
    return (
      <div>
        <div>
          <span>Level</span> 
          <input 
            type="number" 
            min="1" 
            max="9" 
            value={this.state.level}
            onChange={e => this.setState({ level: parseInt(e.target.value) })} 
          />
        </div>

        <div>
          <span>Champion</span>
          <Select
            defaultValue={this.championOptions[0]}
            options={this.championOptions}
            onChange={(option) => this.setState({championName: option.value})}
          />
        </div>

        <div>
          <span>How many in play</span>
          <input
            type="number"
            min="0"
            max="39"
            value={this.state.numberInPlay}
            onChange={e => this.setState({ numberInPlay: parseInt(e.target.value) })}
          />
        </div>

        {this.renderChancesForNextRoll()}
        {this.renderChancesForMultipleRolls()}
      </div>
    );
  }
}




export default App;
