import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Dashboard } from './pages';
import { Container } from './components';
import configureStore from './redux/store/configureStore';
import { Provider } from 'react-redux';
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// Import and Initialize react-dates at the top of the app for use anywhere within
import 'react-dates/initialize';
// Import Language files 
import en from '../language/en';
import fr from '../language/fr';
//Root sass file for webpack to compile
import './sass/main.scss';
import 'react-dates/lib/css/_datepicker.css';
import './utils/css/toolkit-light.scss';

// Initialize language locale
i18n
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources: { en, fr },
    lng: dashboard_options.current_locale || "en",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
    }
  });


//Initial Default settings 
const store = configureStore();

class App extends Component {

  componentDidMount() {

    // For the first time get the size of the visual summary mount point width
    // and store it in a global variable used across the dashboard.
    //125px to offset the 30px margin on both sides and vertical scroll bar width
    window.dynamicDashboard = window.dynamicDashboard || {};
    window.dynamicDashboard.mountWidth = document.getElementById('visual-summary-content-mount').getBoundingClientRect().width - 125;
    // Block Livepipe JS event handling error - React synthetic events block event firing
    //  which needs to snubbed when the dashboard is active
    document.stopObserving('mouseover');
    document.stopObserving('mouseout');
    document.stopObserving('mousewheel');
    document.stopObserving('DOMMouseScroll');
  }


  render() {
    return (
      <Provider store={store}>
        <Container>
          <Dashboard />
        </Container>
      </Provider>)
  }
}

ReactDOM.render(<App />, document.getElementById('visual-summary-content-mount'));
