import React from 'react';
import { Provider } from 'mobx-react';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Image } from 'grommet';

import { Grommet } from 'grommet';
import { grommet } from 'grommet/themes';
import { deepMerge } from 'grommet/utils';

// local dependencies
import { Form, Login, Register, AllSubmissions, ExaminerView } from './pages';
import { StyledHeader } from './pages/Form.styled';
import './App.css';
import customTheme from './utils/theme';
import { rootStore } from './stores/RootStore'

// Assets
import logo from './assets/logo.jpg';

const theme = deepMerge(grommet, { ...customTheme });

// Create MobX store with history
const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();
const stores = {
  routing: routingStore,
  rootStore
};

const history = syncHistoryWithStore(browserHistory, routingStore);

const ProtectedRoutes = () => {
  const authenticated = sessionStorage.getItem('jwt');
  return authenticated ? (
    <>
      <Route path='/all-submissions' component={AllSubmissions} />
      <Route path='/examiner' component={ExaminerView} />
    </>
  ) : (
    <Redirect to='/examiner/login' />
  );
};

function App() {
  return (
    <div className='App'>
      <StyledHeader
        elevation='xlarge'
        direction='row'
        align='center'
        justify='between'
        pad={{ horizontal: 'medium', vertical: 'small' }}>
        <Image src={logo} height='40' width='200' />
      </StyledHeader>
      <Grommet full theme={theme}>
        <Provider {...stores}>
          <Router history={history}>
            <Switch>
              <Route exact path='/' component={Form} />
              <Route path='/examiner/login' component={Login} />
              <Route path='/examiner/register' component={Register} />
              <ProtectedRoutes />
            </Switch>
          </Router>
        </Provider>
      </Grommet>
    </div>
  );
}

export default App;
