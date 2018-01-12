import React, { Component } from 'react';

class Counter extends Component {
    render() {
        return (
            <div>

            <ReactCountdownClock
            seconds={60}
            paused={this.props.pauseQuestion}
            color="#000"
            alpha={0.9}
            size={300}
            onComplete={this.props.handleCounterEnd.bind(this)} /> 
            </div>
        );
    }
}

export default Counter;