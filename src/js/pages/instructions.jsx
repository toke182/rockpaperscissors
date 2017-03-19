import React, {Component} from 'react';
import {render} from 'react-dom';
import GameRulesForm from '../components/gamesRulesForm';

class Instructions extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const {gameModality, gameType} = e.target.elements;

    this.setGameRules({
      gameModality: gameModality.value,
      gameType: gameType.value
    });
  }

  setGameRules(rules) {
    //TODO: Action to set Game modality
    console.log('Setting game Modality: ', rules);
  }

  render() {
    return (
      <section className="instructions centered-container">
        <div className="centered-content">
          <h1 className="centered-text"> GUMTREE FRONTEND TEST </h1>
          <p>
            Before you start playing select the modality of the game you want to play,
            and make sure you know the key combinations.
          </p>
          <ul>
            <li><span className="bold">Classic:</span> Rock - Paper - Scissors</li>
            <li><span className="bold">Extended:</span> Rock - Paper - Scissors - Lizzard - Spock</li>
          </ul>
          <div className="key-combinations span6">
            <h4>Key combinations classic modality</h4>
            <ul>
              <li className="bold">Player 1</li>
              <li>q: rock</li>
              <li>w: scissors</li>
              <li>e: paper</li>
            </ul>
            <ul>
              <li className="bold">Player 2</li>
              <li>y: rock</li>
              <li>u: scissors</li>
              <li>i: paper</li>
            </ul>
          </div>
          <div className="key-combinations span6">
            <h4>Key combinations extended modality</h4>
            <ul>
              <li className="bold">Player 1</li>
              <li>q: rock</li>
              <li>w: scissors</li>
              <li>e: paper</li>
              <li>r: lizzard</li>
              <li>t: spock</li>
            </ul>
            <ul>
              <li className="bold">Player 2</li>
              <li>y: rock</li>
              <li>u: scissors</li>
              <li>i: paper</li>
              <li>o: lizzard</li>
              <li>p: spock</li>
            </ul>
          </div>
          <GameRulesForm handleSubmit={this.handleSubmit} />
        </div>
      </section>
    );
  }
}

export default Instructions;