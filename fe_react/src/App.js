import React from 'react';
import { Provider, observer } from 'mobx-react';
import { useRouteMatch, useHistory } from 'react-router-dom';
import { createBrowserHistory } from 'history';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from 'react-router-dom';
import { Image, Button } from 'grommet';

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

const Header = ({ onClick }) => { 
  const examinerView = useRouteMatch('/examiner')
  return (
     <StyledHeader
        elevation='xlarge'
        direction='row'
        align='center'
        justify='between'
        pad={{ horizontal: 'medium', vertical: 'small' }}>
        <Image src={logo} height='40' width='200' />
      {examinerView && <Button primary label="Back" color='primary' onClick={onClick}/>}
      </StyledHeader>
  )
}

const ProtectedRoutes = () => {
  const { push } = useHistory()
  const authenticated = sessionStorage.getItem('jwt');
  return authenticated ? (
    <>
      <Header onClick={() => push('/all-submissions')}/>
      <Route path='/all-submissions' component={AllSubmissions} />
      <Route path='/examiner' component={ExaminerView} />
    </>
  ) : (
    <Redirect to='/examiner/login' />
  );
};
const App = () =>  {
  return (
    <div className='App'>
     
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
