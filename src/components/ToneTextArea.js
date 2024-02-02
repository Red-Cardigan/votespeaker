import React from 'react';

class ToneTextArea extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tone: '',
    };

    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({tone: event.target.value});
    this.props.onToneChange(event.target.value);
  }

  render() {
    return (
      <div className="tone-text-area-container">
        <label htmlFor="toneTextArea">Use a tone which is...</label>
        <textarea
          id="toneTextArea"
          name="toneTextArea"
          className="text-area"
          value={this.state.tone}
          onChange={this.handleChange}
          rows="4"
          cols="50"
          placeholder="E.g., Inspirational, Urgent, Friendly, Professional"
        ></textarea>
      </div>
    );
  }
}

export default ToneTextArea;