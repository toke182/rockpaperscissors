import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import GameRulesForm from '../components/gamesRulesForm';
import {addTypeToPlayer} from '../actions/players';
import {addNewGameRules} from '../actions/game';

import * as GameActions from '../actions/game';
import * as PlayerActions from '../actions/players';

class Instructions extends Component {
  constructor(props) {
    super(props);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(e) {
    e.preventDefault();

    const {gameModality, gameType} = e.target.elements;
    const rules = {
      gameModality: gameModality.value,
      gameType: gameType.value
    };

    this.storeAddNewGameRules(rules);
    this.storeAddTypeToPlayer(rules.gameModality);
    this.navigateTo('/countdown');
  }

  navigateTo(path) {
    this.props.history.push(path);
  }

  storeAddTypeToPlayer(gameModality) {
      const {players, playerActions} = this.props;

      switch (gameModality) {
        case 'mvsm':
          // set all players as cpu
          players
            .map(player => playerActions.addTypeToPlayer({id: player.id, type: 'cpu'}));
          break;
        case 'hvsm':
          // set player left as human
          players
            .filter(player => player.gameSide === 'left')
            .map(player => playerActions.addTypeToPlayer({id: player.id, type: 'human'}));

          // set player right as cpu
          players
            .filter(player => player.gameSide === 'right')
            .map(player => playerActions.addTypeToPlayer({id: player.id, type: 'cpu'}));
          break;
        case 'hvsh':
          // set all players as human
          players
            .map(player => playerActions.addTypeToPlayer({id: player.id, type: 'human'}));
          break;
        default:
          throw ('Unrecognized game modality');
      }
  }

  storeAddNewGameRules(rules) {
    const {gameActions} = this.props;
    gameActions.addNewGameRules(rules);
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

function mapStateToProps(state) {
  return {
    players: state.players
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(GameActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch)
  };
}

Instructions.propTypes = {
  playerActions: PropTypes.object.isRequired,
  gameActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired
};

export default connect(mapStateToProps, mapDispatchToProps)(Instructions);