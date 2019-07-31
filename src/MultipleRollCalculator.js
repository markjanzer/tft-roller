import React, { Component } from "react";

class MultipleRollCalculator extends Component {
  constructor(props) {
    super(props);

    let timesRolled = 0;
    let confidence = 0;
    if (this.props.chance === 0) {
      this.state = {
        chance: 0,
        confidence: 0,
        rollCount: 1,
      };
    } else {
      while (confidence < this.props.roughConfidence) {
        timesRolled += 1;
        confidence += ((1 - confidence) * this.props.chance);
      }

      this.state = {
        chance: this.props.chance,
        confidence: confidence,
        rollCount: timesRolled,
      };
    }
  }

  updateRollCountAndConfidence(params) {
    let rollCount = 0;
    let confidence = 0;

    if (params.rollCount) {
      while (rollCount < params.rollCount) {
        rollCount += 1;
        confidence += ((1 - confidence) * this.props.chance);
      }
    } else if (params.confidence) {
      while (confidence < params.confidence) {
        rollCount += 1;
        confidence += ((1 - confidence) * this.props.chance);
      }
    }

    this.setState({ rollCount, confidence });
  }

  // confidenceFromRolls() {
  //   let timesRolled = 0;
  //   let confidence = 0;
  //   while (timesRolled < this.stateRollCount) {
  //     timesRolled += 1;
  //     confidence += ((1 - confidence) * this.props.chance);
  //   }
  //   return confidence;
  // }

  // rollsFromConfidence() {
  //   if (this.props.chance <= 0) {
  //     return 0;
  //   } else {
  //     let timesRolled = 0;
  //     let confidence = 0;
  //     while (confidence < this.state.confidence) {
  //       timesRolled += 1;
  //       confidence += ((1 - confidence) * this.props.chance);
  //     }
  //     return timesRolled;
  //   }
  // }

  render() {
    return (
      <div>
        <input
          type="number"
          name="confidence"
          value={(this.state.confidence * 100).toFixed(2)}
          min="0"
          max="99"
          style={{minWidth: "100px"}}
          onChange={(e) => {
            if (e.target.value && parseFloat(e.target.value)) {
              this.updateRollCountAndConfidence({
                confidence: e.target.value / 100
              });
            }
          }}
        />
        <span>% chance to get {this.props.championName} if you {this.props.level ? "level and " : ""}roll </span>
        <input
          type="number"
          name="rollCount"
          value={this.state.rollCount}
          min="0"
          style={{minWidth: "100px"}}
          onChange={(e) => {
            if (e.target.value && parseInt(e.target.value)) {
              this.updateRollCountAndConfidence({
                rollCount: parseInt(e.target.value)
              })
            }
          }}
        />
        <span> {this.state.rollCount > 1 ? "times" : "time"}</span>
      </div>
    );
  }

}

export default MultipleRollCalculator;
