import React, { Component } from "react";

class RollCalculator extends Component {
  constructor(props) {
    super(props);

    let timesRolled = 0;
    let confidence = 0;
    if (this.props.chance === 0) {
      this.state = {
        confidence: 0,
        rollCount: 1,
      };
    } else {
      while (confidence < this.props.roughConfidence) {
        timesRolled += 1;
        confidence += ((1 - this.props.chance) * this.props.chance);
      }

      this.state = {
        confidence: confidence,
        rollCount: timesRolled,
      };
    }
  }

  confidenceFromRolls(rollCount) {
    let timesRolled = 0;
    let confidence = 0;
    while (timesRolled < rollCount) {
      timesRolled += 1;
      confidence += ((1 - this.props.chance) * this.props.chance);
    }
    return confidence;
  }

  rollsFromConfidence(desiredConfidence) {
    if (this.props.chance <= 0) {
      return 0;
    } else {
      let timesRolled = 0;
      let confidence = 0;
      while (confidence < desiredConfidence) {
        timesRolled += 1;
        confidence += ((1 - this.props.chance) * this.props.chance);
      }
      return timesRolled;
    }
  }

  render() {
    return (
      <div>
        <input
          type="number"
          value={this.state.confidence * 100}
          min="0"
          max="99"
          onChange={(e) => {
            let confidence = e.target.value / 100;
            let rollCount = this.rollsFromConfidence(confidence);
            this.setState({ confidence, rollCount })
          }}
        />
        <span>% chance to hit {this.props.championName} if you {this.props.level ? "level and " : ""}roll </span>
        <input
          type="number"
          value={this.state.rollCount}
          min="0"
          onChange={(e) => {
            let rollCount = e.target.value;
            let confidence = this.confidenceFromRolls(rollCount);
            this.setState({ confidence, rollCount })
          }}
        />
        <span> {this.state.rollCount > 1 ? "times" : "time"}</span>
      </div>
    );
  }

}

export default RollCalculator;
