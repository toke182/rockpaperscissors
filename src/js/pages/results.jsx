import React, {Component, PropTypes} from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {render} from 'react-dom';
import {Link} from 'react-router-dom';

import * as GameActions from '../actions/game';
import * as PlayerActions from '../actions/players';
import * as prevLocationActions from '../actions/prevLocation';

class Results extends Component {
  constructor(props){
    super(props);
  }

  /**
   * LifeCycle
   * 1. Navigates to instructions in case user didn't input game rules
   * @return {undefined}
   */
  componentWillMount() {
    if (!this.props.prevLocation || this.props.prevLocation.pathname !== '/countdown') {
      this.navigateTo('/');
    }
  }

  /**
   * LifeCycle
   * 1. Updates store with current location to help with navigation
   * @return {undefined}
   */
  componentWillUnmount() {
    this.props.prevLocationActions.addPrevLocation(this.props.location);
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
   * Shows text about the winner of the match
   * @return {String} Text to print in view
   */
  showWinnerText() {
    const winner = this.props.players
      .filter(player => player.winner === true)[0];

    return winner ? `${winner.gameSide} side player wins` : 'Players tied';
  }

  render() {
    const {players} = this.props;
    const playerLeft = players.filter(player => player.gameSide === 'left')[0];
    const playerRight = players.filter(player => player.gameSide === 'right')[0];

    return (
      <div id="game">
        <div className="players-container centered-text">
          <div id="player-1" className="span6">
            <div className="player-name bold">{playerLeft.type.toUpperCase()}</div>
            <div className="shape-name">{playerLeft.handShape.toUpperCase()}</div>
            <div className={`shape shape-left ${playerLeft.handShape}`}></div>
          </div>
          <div id="player-2" className="span6">
            <div className="player-name bold">{playerRight.type.toUpperCase()}</div>
            <div className="shape-name">{playerRight.handShape.toUpperCase()}</div>
            <div className={`shape shape-right ${playerRight.handShape}`}></div>
          </div>
        </div>
        <div className="info-container centered-text">
          <div className="winner-banner bold">{this.showWinnerText()}</div>
          <Link to="/">
            <button id="retry" className="arcade">retry</button>
          </Link>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    players: state.players,
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

Results.propTypes = {
  playerActions: PropTypes.object,
  gameActions: PropTypes.object,
  prevLocationActions: PropTypes.object.isRequired,
  players: PropTypes.array.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(Results);