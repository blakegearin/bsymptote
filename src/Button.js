import React from 'react';

export default class Button extends React.Component {
  render() {
    return (
      <button
        id={this.props.id}
        className={this.props.className}
        onClick={this.props.onClick}
        style={this.props.style}
        dangerouslySetInnerHTML={{ __html: this.props.title }}
      >
      </button>
    );
  }
}
