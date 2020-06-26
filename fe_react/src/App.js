import React from 'react'
import { Provider } from 'mobx-react'
import { createBrowserHistory } from 'history'
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router'
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom'

import { Grommet } from 'grommet'
import { grommet } from 'grommet/themes'
import { deepMerge } from 'grommet/utils'

// local dependencies
import Form from './pages/Form'
import './App.css'
import customTheme from './utils/theme'

const theme = deepMerge(grommet, { ...customTheme })

// Create MobX store with history
const browserHistory = createBrowserHistory()
const routingStore = new RouterStore()
const stores = {
  routing: routingStore,
}

const history = syncHistoryWithStore(browserHistory, routingStore)

function App() {
  return (
    <div className="App">
      <Grommet full theme={theme}>
        <Provider {...stores}>
          <Router history={history}>
            <Switch>
              <Route path="/" component={Form} />
            </Switch>
          </Router>
        </Provider>
      </Grommet>
    </div>
  )
}

export default App
