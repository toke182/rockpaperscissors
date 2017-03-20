import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import {scoringTable} from '../constants/scoringTable';
import {keymaps} from '../constants/keymaps';
import {decrementSecondsRemaining} from '../actions/game';

import * as GameActions from '../actions/game';
import * as PlayerActions from '../actions/players';
import * as prevLocationActions from '../actions/prevLocation';

class Countdown extends Component {
  constructor(props) {
    super(props);
    const {players} = this.props;

    this.cpuPlayers = this.getCpuPlayers(players);
    this.humanPlayers = this.getHumanPlayers(players);

    this.tick = this.tick.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
  }

  /**
   * Event Handler for Human Players keyboard inputs
   * 1. Updates store with Human input handshapes
   * @param {Object} event callback
   * @return {undefined}
   */
  handleKeyDown(e) {
    let character = String.fromCharCode(e.which).toLowerCase();
    const {gameModality, gameType} = this.props.game;

    this.addShapesToHumanPlayers(character, gameType, gameModality);
  }

  /**
   * Returns Keymap to be used depending on game type
   * @param {Object} gameType: the type of game, e.g: ('classic'|'extended')
   * @param {Array} keymaps: List of keymap configurations
   * @return {Object} the keymap
   */
  getGameKeymap(gameType, keymaps) {
    const keymap = keymaps.filter(keymap => keymap.gameType === gameType);

    if (keymap[0]) {
      return keymap[0];
    } else {
      throw('No keymap for this gameType');
    }
  }

  /**
   * Given a char and a keymap returns the Handshape associated to it
   * @param {String} character: Keyboard character representation
   * @param {Object} keymap: list of key configs
   * @return {String} the handshape
   */
  mapKeyToHandShape(character, keymap) {
    const k = keymap.filter(keys => keys.character === character);
    if (k[0] && k[0].handShape) {
      return k[0].handShape;
    }
    return null;
  }

  /**
   * Updates store with the shape associated to a human player
   * @param {String} character: Keyboard character representation
   * @param {Object} gameType: the type of the game, e.g: ('classic'|'extended')
   * @param {Object} gameModality: Modality of game e.g: ('mvsm'|'hvsh'|'mvsh')
   * @return {undefined}
   */
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

  /**
   * Updates store with the shape associated to a cpu player
   * @return {undefined}
   */
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

  /**
   * Returns list of players that are CPUs.
   * @param {Array} players: List of players
   * @return {Array} list of CPU players
   */
  getCpuPlayers(players) {
    return players.filter(player => player.type === 'cpu');
  }

  /**
   * Returns list of players that are Humans.
   * @param {Array} players: List of players
   * @return {Array} list of Human players
   */
  getHumanPlayers(players) {
    return players.filter(player => player.type === 'human');
  }

  /**
   * Returns random shape from provided list.
   * @param {Array} shapes: List of shapes
   * @return {Array} list of Human players
   */
  generateRandomShape(shapes) {
    return shapes[Math.floor(Math.random() * shapes.length)];
  }

  /**
   * Returns player with Randomly created handShape
   * @param {Object} player: player
   * @param {Object} availableShapes: list of available shapes
   * @return {Object} Player object with random handshape included
   */
  addRandomShapeToPlayer(player, availableShapes) {
    const randomHandShape = this.generateRandomShape(availableShapes);

    return Object.assign({}, player, {handShape: randomHandShape});
  }

  /**
   * Updates player in store with a random shape
   * @param {Object} player: player
   * @param {Object} availableShapes: list of available shapes
   * @return {Object} Player object with random handshape included
   */
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

  /**
   * Handles the countdown interval
   * 1. Allows human user to input keys or generates random shapes for cpu users
   * during the last tick
   * 2. Updates store with winner players
   * 3. Navigates to next component
   * @return {undefined}
   */
  tick() {
    const {game, gameActions, players} = this.props;

    if (game.secondsRemaining === 1) {
      if (this.humanPlayers.length > 0) {
        document.addEventListener("keydown", this.handleKeyDown);
      }
      if (this.cpuPlayers.length > 0) {
        this.addShapesToCpuPlayers();
      }

    } else if (game.secondsRemaining === 0) {
      this.addWinner(players, scoringTable[game.gameType]);

      document.removeEventListener("keydown", this.handleKeyDown);
      clearInterval(this.countdownInterval);

      this.navigateTo('/results');
    }

    gameActions.decrementSecondsRemaining();
  }

  /**
   * Navigates to supplied path
   * @param {Object} path: The path where to navigate
   * @return {undefined}
   */
  navigateTo(path) {
    this.props.history.push(path);
  }

  /**
   * LifeCycle
   * 1. Navigates to instructions in case user didn't input game rules
   * @return {undefined}
   */
  componentWillMount() {
    if (!this.props.prevLocation || this.props.prevLocation.pathname !== '/') {
      this.navigateTo('/');
    }
  }

  /**
   * LifeCycle
   * 1. Clears countdown
   * @return {undefined}
   */
  componentDidMount() {
    this.countdownInterval = setInterval(this.tick, 3000);
  }

  /**
   * LifeCycle
   * 1. Updates store with current location to help with navigation
   * 2. Removes event listeners
   * 3. Clears countdown interval
   * @return {undefined}
   */
  componentWillUnmount() {
    this.props.prevLocationActions.addPrevLocation(this.props.location);
    document.removeEventListener("keydown", this.handleKeyDown);
    clearInterval(this.countdownInterval);
  }

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
  prevLocationActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
  game: PropTypes.object.isRequired
};

function mapStateToProps(state) {
  return {
    players: state.players,
    game: state.game,
    prevLocation: state.prevLocation
  };
}

function mapDispatchToProps(dispatch) {
  return {
    gameActions: bindActionCreators(GameActions, dispatch),
    playerActions: bindActionCreators(PlayerActions, dispatch),
    prevLocationActions: bindActionCreators(prevLocationActions, dispatch)
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Countdown);