import React, {PropTypes, Component} from 'react';
import {render} from 'react-dom';

class GameRulesForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form onSubmit={this.props.handleSubmit} role="form" className="centered-text">
        <fieldset>
          <h3>Select Players</h3>
          <select name="gameModality" className="select-modality centered-text" defaultValue="mvsm">
            <option value="mvsm">Machine VS Machine</option>
            <option value="hvsm">Human VS Machine</option>
            <option value="hvsh">Human VS Human</option>
          </select>
        </fieldset>
        <fieldset>
          <h3>Select Game type</h3>
          <label>
            <input name="gameType" type="radio" value="classic" defaultChecked/>
            &nbsp; Classic
          </label>
          <label>
            <input name="gameType" type="radio" value="extended" />
            &nbsp; Extended
          </label>
        </fieldset>
        <button type="submit" className="arcade">Play</button>
      </form>
    );
  }
}

GameRulesForm.propTypes = {
  handleSubmit: PropTypes.func.isRequired
};

export default GameRulesForm;