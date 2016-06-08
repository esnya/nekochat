/* eslint react/no-multi-comp: 0 */

import React, { Component, PropTypes } from 'react';
import PureRenderMixin from 'react-addons-pure-render-mixin';

const wrapperName = (ComposedComponent, name) => {
    const originalName =
        ComposedComponent.displayName || ComposedComponent.name;

    return `${name}@${originalName}`;
};

/**
 * Pure render enhancer
 * @param{Component} ComposedComponent - Component to compose
 * @returns{Component} Wrapped comopnent
 */
export function pureRender(ComposedComponent) {
    const displayName = wrapperName(ComposedComponent, 'PureRenferWrapper');

    return class PureRenferWrapper extends Component {
        static get displayName() {
            return displayName;
        }

        static get propTypes() {
            return ComposedComponent.propTypes;
        }

        shouldComponentUpdate(...args) {
            return PureRenderMixin.shouldComponentUpdate.call(this, ...args);
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    };
}

/**
 * Static render enhancer
 * @param{Component} ComposedComponent - Component to compose
 * @returns{Component} Wrapped comopnent
 */
export function staticRender(ComposedComponent) {
    const displayName = wrapperName(ComposedComponent, 'StaticRenferWrapper');

    return class PureRenferWrapper extends Component {
        static get displayName() {
            return displayName;
        }

        static get propTypes() {
            return ComposedComponent.propTypes;
        }

        shouldComponentUpdate() {
            return false;
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    };
}

/**
 * Enhancer to utilize componentWillMount
 * @param{Component} ComposedComponent - Component to compose
 * @param{function} callback - Callback function
 * @returns{Component} Wrapped component
 */
export function willMount(ComposedComponent, callback) {
    const displayName = wrapperName(ComposedComponent, 'WillMountWrapper');

    return class WillMountWrapper extends Component {
        static get displayName() {
            return displayName;
        }

        static get propTypes() {
            return ComposedComponent.propTypes;
        }

        componentWillMount() {
            return callback(this.props);
        }

        render() {
            return <ComposedComponent {...this.props} />;
        }
    };
}

/**
 * Single state enhancer
 * @param{Component} ComposedComponent - Component to compose
 * @param{string} key - State key
 * @param{any} options.initialValue - Initial state value
 * @param{object} options - Options
 * @param{boolean} options.watchProps - Watch props and updates state if changed
 * @param{boolean} options.propRequired - Set false to disable PropType checking
 * @returns{Component} Wrapped comopnent
 */
export function singleState(
    ComposedComponent,
    key,
    options = { initialValue: null, watchProps: false, propRequired: true }
) {
    const {
        initialValue,
        watchProps,
        propRequired,
    } = options;

    const displayName =
        wrapperName(ComposedComponent, 'SingleStateWrapper');

    const propTypesWithoutHandler = {
        ...ComposedComponent.propTypes,
        [key]: PropTypes.any,
        onChange: PropTypes.any,
    };
    const propTypes = watchProps && propRequired ? {
            ...propTypesWithoutHandler,
            [key]: PropTypes.any.isRequired,
        } : propTypesWithoutHandler;

    return class SingleStateWrapper extends Component {
        static get displayName() {
            return displayName;
        }

        static get propTypes() {
            return propTypes;
        }

        constructor(props)  {
            super(props);

            this.state = {
                [key]: watchProps ? props[key] : initialValue,
            };
        }

        componentWillReceiveProps(nextProps) {
            if (watchProps && nextProps[key] !== this.props[key]) {
                this.setState({
                    [key]: nextProps[key],
                });
            }
        }

        render() {
            const onChange = (e, value) => {
                this.setState({
                    [key]: value,
                });
            };

            const props = {
                ...this.props,
                [key]: this.state[key],
                onChange,
            };

            return <ComposedComponent {...props} />;
        }
    };
}
