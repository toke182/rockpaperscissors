import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import {scoringTable} from '../constants/scoringTable';
import {keymaps} from '../constants/keymaps';
import {decrementSecondsRemaining} from '../actions/game';

import * as GameActions from '../actions/game';
import * as PlayerActions from '../actions/players';

class Countdown extends Component {
  constructor(props) {
    super(props);
    const {players} = this.props;

    this.cpuPlayers = this.getCpuPlayers(players);
    this.humanPlayers = this.getHumanPlayers(players);

    this.tick = this.tick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /*** Event Handlers ***/
  handleKeyDown(e) {
    let character = String.fromCharCode(e.which).toLowerCase();
    const {gameModality, gameType} = this.props.game;

    this.addShapesToHumanPlayers(character, gameType, gameModality);
  }

  getGameKeymap(gameType, keymaps) {
    const keymap = keymaps.filter(keymap => keymap.gameType === gameType);

    if (keymap[0]) {
      return keymap[0];
    } else {
      throw('No keymap for this gameType');
    }
  }

  mapKeyToHandShape(character, keymap) {
    const k = keymap.filter(keys => keys.character === character);
    if (k[0] && k[0].handShape) {
      return k[0].handShape;
    }
    return null;
  }

  addShapesToHumanPlayers(character, gameType, gameModality) {
    const {players, playerActions} = this.props;
    const keymap = this.getGameKeymap(gameType, keymaps);
    const handShape = this.mapKeyToHandShape(character, [...keymap.playerLeft, ...keymap.playerRight]);

    const isPlayerLeftHandShape = keymap.playerLeft
        .filter(k => k.character === character).length > 0;

    if (isPlayerLeftHandShape) {
      players
        .filter(player => player.gameSide === 'left')
        .map(player => {
          playerActions.addHandShapeToPlayer({id: player.id, handShape})
        });
    }

    if (gameModality === 'hvsh') {
      const isPlayerRightHandShape = keymap.playerRight
          .filter(k => k.character === character).length > 0;

      if (isPlayerRightHandShape) {
        players
          .filter(player => player.gameSide === 'right')
          .map(player => {
            playerActions.addHandShapeToPlayer({id: player.id, handShape})
          });
      }
    }
  }

  addShapesToCpuPlayers() {
    const {game, playerActions} = this.props;

    // Get Available shapes for gametype
    const availableShapes = scoringTable[game.gameType]
      .map(gameScore => gameScore.handShape);

    //Adds random shapes and save them in store
    const cpuPlayersWithHandshapes = this.cpuPlayers
      .map(cpuPlayer => this.addRandomShapeToPlayer.call(this, cpuPlayer, availableShapes))
      .map(cpuPlayerWithHandShape => {
        const {id, handShape} = cpuPlayerWithHandShape;
        playerActions.addHandShapeToPlayer({id, handShape})
      });
  }

  navigateTo(path) {
    this.props.history.push(path);
  }

  /*** LifeCycle Methods ***/
  componentWillMount() {
    if (!this.props.game.gameType || this.props.players.length < 2) {
      this.navigateTo('/');
    }
  }

  componentDidMount() {
    this.countdownInterval = setInterval(this.tick, 3000);
  }

  componentWillUnmount() {
    clearInterval(this.countdownInterval);
  }

  getCpuPlayers(players) {
    return players.filter(player => player.type === 'cpu');
  }

  getHumanPlayers(players) {
    return players.filter(player => player.type === 'human');
  }

  generateRandomShape(shapes) {
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  addRandomShapeToPlayer(player, availableShapes) {
    const randomHandShape = this.generateRandomShape(availableShapes);

    return Object.assign({}, player, {handShape: randomHandShape});
  }

  addWinner(players, gameTypeScoringTable) {
    const playerLeft = players.filter(player => player.gameSide === 'left')[0];
    const playerRight = players.filter(player => player.gameSide === 'right')[0];

    // Check if Player Left wins
    gameTypeScoringTable
      .filter(scoreHandshape => scoreHandshape.handShape === playerLeft.handShape)
      .map(scoreHandShape => {
        const isPlayerLeftWinner = scoreHandShape.defeats.includes(playerRight.handShape);
        if (isPlayerLeftWinner) {
          this.props.playerActions.addWinner({id: playerLeft.id});
        }
      });

    // Check if Player Right wins
    gameTypeScoringTable
      .filter(scoreHandshape => scoreHandshape.handShape === playerRight.handShape)
      .map(scoreHandShape => {
        const isPlayerRightWinner = scoreHandShape.defeats.includes(playerLeft.handShape);
        if (isPlayerRightWinner) {
          this.props.playerActions.addWinner({id: playerRight.id});
        }
      });
  }

  tick() {
    const {game, gameActions, players} = this.props;

    if (game.secondsRemaining === 1) {
      if (this.humanPlayers.length > 0) {
        document.addEventListener("keydown", this.handleKeyDown.bind(this));
      }
      if (this.cpuPlayers.length > 0) {
        this.addShapesToCpuPlayers();
      }

    } else if (game.secondsRemaining === 0) {
      this.addWinner(players, scoringTable[game.gameType]);

      clearInterval(this.countdownInterval);
      document.removeEventListener("keydown", true);

      this.navigateTo('/results');
    }

    gameActions.decrementSecondsRemaining();
  }

  /*** Render Method ***/
  render() {
    const {game} = this.props;
    const label = this.humanPlayers.length > 0 ? 'PRESS NOW' : 'GO';
    return (
      <div className="countdown bold centered-container">
        <div className="centered-content">
          <p className="text-placeholder">
            {game.secondsRemaining > 0 ? game.secondsRemaining : label}
          </p>
        </div>
      </div>
    );
  }

}

Countdown.propTypes = {
  playerActions: PropTypes.object.isRequired,
  gameActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  game: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players,
    game: state.game
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(GameActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Countdown);