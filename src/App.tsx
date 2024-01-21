import React from 'react';
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch,
  Redirect,
} from 'react-router-dom';
import { QueryClient, QueryClientProvider } from 'react-query';

import Search from './components/Search';
import Favorites from './components/Favourites';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="App">
          <nav className="bg-blue-500 p-4">
            <Link to="/">Home</Link>
            <span className="mx-2">|</span>
            <Link to="/favorites">Favorites</Link>
          </nav>

          <Switch>
            <Route path="/" exact>
              <Search />
            </Route>
            <Route path="/favorites">
              <Favorites />
            </Route>
            <Redirect to="/" />
          </Switch>
        </div>
      </Router>
    </QueryClientProvider>
  );
}

export default App;