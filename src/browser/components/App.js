import React from 'react';
import { connect } from 'react-redux';
import { Router } from './Router';

const RouterContainer = connect(state => ({ ...state.route }))(Router);

export const App = (props) => {
    return <RouterContainer />;
};