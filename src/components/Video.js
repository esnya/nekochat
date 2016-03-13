import React, { Component, PropTypes } from 'react';
import { findDOMNode } from 'react-dom';

export class Video extends Component {
    static get propTypes() {
        return {
            stream: PropTypes.any.isRequired,
        };
    }

    componentDidMount() {
        this.setSource();
    }
    componentDidUpdate() {
        this.setSource();
    }

    setSource() {
        const {
            stream,
        } = this.props;
        const video = findDOMNode(this.video);

        video.autoplay = true;
        video.src = window.URL.createObjectURL(stream);
    }

    render() {
        const Style = {
            border: '2px solid black',
            height: 180,
        };

        return <video ref={(c) => (this.video = c)} style={Style} />;
    }
}
