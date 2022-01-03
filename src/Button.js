import React from 'react';

class Button extends React.Component {
  render() {
    return (
      <button
        id={this.props.id}
        className={this.props.className}
        onClick={this.props.onClick}
        style={this.props.style}
      >
        {this.props.title}
      </button>
    );
  }
}

export default Button;
