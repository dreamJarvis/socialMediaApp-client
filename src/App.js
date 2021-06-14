import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { Container } from 'semantic-ui-react';

import 'semantic-ui-css/semantic.min.css';
import './App.css';

import { AuthProvider } from './context/auth';
import AuthRoute from './util/AuthRoute';

import MenuBar from './components/MenuBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import SinglePost from './pages/SinglePost';

function App() {
  return (
    <AuthProvider>
      <div>
        <Router>
          <Container>
          <MenuBar />
            <Switch>
              <Route exact path="/" component={Home}/>
              <AuthRoute path="/login" component={Login}/>
              <AuthRoute path="/register" component={Register}/>
              <Route exact path='/posts/:postId' component={SinglePost}/>
            </Switch>
          </Container>
        </Router>
      </div>
    </AuthProvider>
  );
}

export default App;
