import React, { Component } from "react";
import Select from "react-select";
import {Decimal} from "decimal.js";
import MultipleRollCalculator from "./MultipleRollCalculator.js";

class App extends Component {
  constructor(props) {
    super(props);

    this.champions = [{name:"Darius",cost:1},{name:"Elise",cost:1},{name:"Fiora",cost:1},{name:"Garen",cost:1},{name:"Graves",cost:1},{name:"Kassadin",cost:1},{name:"Khazix",cost:1},{name:"Mordekaiser",cost:1},{name:"Nidalee",cost:1},{name:"Tristana",cost:1},{name:"Vayne",cost:1},{name:"Warwick",cost:1},{name:"Ahri",cost:2},{name:"Blitzcrank",cost:2},{name:"Braum",cost:2},{name:"Lissandra",cost:2},{name:"Lucian",cost:2},{name:"Lulu",cost:2},{name:"Pyke",cost:2},{name:"RekSai",cost:2},{name:"Shen",cost:2},{name:"TwistedFate",cost:2},{name:"Varus",cost:2},{name:"Zed",cost:2},{name:"Aatrox",cost:3},{name:"Ashe",cost:3},{name:"Evelynn",cost:3},{name:"Gangplank",cost:3},{name:"Katarina",cost:3},{name:"Kennen",cost:3},{name:"Morgana",cost:3},{name:"Poppy",cost:3},{name:"Rengar",cost:3},{name:"Shyvana",cost:3},{name:"Veigar",cost:3},{name:"Volibear",cost:3},{name:"Akali",cost:4},{name:"AurelionSol",cost:4},{name:"Brand",cost:4},{name:"Chogath",cost:4},{name:"Draven",cost:4},{name:"Gnar",cost:4},{name:"Kindred",cost:4},{name:"Leona",cost:4},{name:"Sejuani",cost:4},{name:"Anivia",cost:5},{name:"Karthus",cost:5},{name:"Kayle",cost:5},{name:"MissFortune",cost:5},{name:"Swain",cost:5},{name:"Yasuo",cost:5}];
    this.championOptions = this.champions.map(champ => { return { value: champ.name, label: champ.name }})

    this.renderChancesForNextRoll = this.renderChancesForNextRoll.bind(this);

    this.state = {
      level: 5,
      champion: this.champions[0],
      numberInPlay: 0,
    }
  }

  // This logic can probably go into another file
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

    return new Decimal(levels[level][cost]);
  }

  chanceOfCorrectChampion(cost) {
    var numberOfChampionsOfCost = {
      1: 12,
      2: 12,
      3: 12,
      4: 9,
      5: 6,
    }

    return new Decimal(1.0 / numberOfChampionsOfCost[cost]);
  }

  percentageOfChampionRemaining(cost, numberInPlay) {
    var copiesOfChampionsPerCost = { 
      1: 39,
      2: 26,
      3: 21,
      4: 13,
      5: 10,
    }

    return new Decimal(new Decimal((copiesOfChampionsPerCost[cost] - numberInPlay)).dividedBy(copiesOfChampionsPerCost[cost]));
  }

  chanceOfFindingChampion(cost, level, numberInPlay) {
    const result = this.chanceOfCorrectCost(level, cost).times(this.chanceOfCorrectChampion(cost)).times(this.percentageOfChampionRemaining(cost, numberInPlay));
    if (result > 0) {
      return result;
    } else {
      return 0;
    }
  }

  chanceOfFindingChampionInRoll(cost, level, numberInPlay) {
    var chance = this.chanceOfFindingChampion(cost, level, numberInPlay);
    var chance1 = chance;
    var chance2 = chance1.minus(1).times(-1).times(chance);
    var chance3 = chance2.minus(1).times(-1).times(chance);
    var chance4 = chance3.minus(1).times(-1).times(chance);
    var chance5 = chance4.minus(1).times(-1).times(chance);
    console.log(chance1.toNumber(), chance2.toNumber(), chance3.toNumber(), chance4.toNumber(), chance5.toNumber())

    return chance1.plus(chance2).plus(chance3).plus(chance4).plus(chance5).toNumber();
  }

  levelIsValid() {
    return this.state.level && this.state.level > 0 && this.state.level < 10;
  }

  renderChancesForNextRoll() {
    if (this.levelIsValid()) {
      if (this.state.level < 9) {
        return (
          <div>
            <div>
              {(this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.champion.name} next roll.
            </div>
            <div>
              {(this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level + 1, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.champion.name} next roll if you level.
            </div>
          </div>
        )
      } else {
        return (
          <div>
            {(this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level, this.state.numberInPlay) * 100).toFixed(2)}% chance of finding {this.state.champion.name} next roll.
          </div>
        )
      }
    }
  }

  renderMultipleRollCalculators() {
    if (this.levelIsValid()) {
      if (this.state.level === 9) {
        return (
          <div>
            <MultipleRollCalculator
              chance={this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level, this.state.numberInPlay)}
              level={false}
              roughConfidence={0.50}
              championName={this.state.champion.name}
            />
          </div>
        )
      } else {
        return (
          <div>
            <MultipleRollCalculator
              chance={this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level, this.state.numberInPlay)}
              level={false}
              roughConfidence={0.50}
              championName={this.state.champion.name}
            />
            <MultipleRollCalculator
              chance={this.chanceOfFindingChampionInRoll(this.state.champion.cost, this.state.level + 1, this.state.numberInPlay)}
              level={true}
              roughConfidence={0.50}
              championName={this.state.champion.name}
            />
          </div>
        )
      }
    }
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
            onChange={e => {
              if (e.target.value && parseInt(e.target.value)) {
                this.setState({ level: parseInt(e.target.value) })
              } else {
                this.setState({ level: null })
              }
            }}
          />
        </div>

        <div>
          <span>Champion</span>
          <Select
            defaultValue={this.championOptions[0]}
            options={this.championOptions}
            onChange={(option) => {
              let championName = option.value;
              let champion = this.champions.find(champ => champ.name === championName);
              this.setState({ champion: champion });
            }}
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
        {this.renderMultipleRollCalculators()}
      </div>
    );
  }
}




export default App;
