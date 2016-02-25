import React from 'react';
import { connect } from 'react-redux';
import { loadConfig } from '../actions/config';
import { loginUser } from '../actions/auth';
import { currentBackend } from '../backends/backend';

class App extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(loadConfig());
  }

  componentWillReceiveProps(nextProps) {
    //this.props.dispatch(loadBackend());
  }

  configError(config) {
    return <div>
      <h1>Error loading the CMS configuration</h1>

      <div>
        <p>The "config.yml" file could not be loaded or failed to parse properly.</p>
        <p><strong>Error message:</strong> {config.get('error')}</p>
      </div>
    </div>;
  }

  configLoading() {
    return <div>
      <h1>Loading configuration...</h1>
    </div>;
  }

  handleLogin(credentials) {
    this.props.dispatch(loginUser(credentials));
  }

  authenticating() {
    const { auth } = this.props;
    const backend = currentBackend(this.props.config);

    if (backend == null) {
      return <div><h1>Waiting for backend...</h1></div>;
    }

    return <div>
      {React.createElement(backend.authComponent(), {
        onLogin: this.handleLogin.bind(this),
        error: auth && auth.get('error'),
        isFetching: auth && auth.get('isFetching')
      })}
    </div>;
  }

  render() {
    const { user, config, children } = this.props;

    if (config === null) {
      return null;
    }

    if (config.get('error')) {
      return this.configError(config);
    }

    if (config.get('isFetching')) {
      return this.configLoading();
    }

    if (user == null) {
      return this.authenticating();
    }

    return (
      <div>{children}</div>
    );
  }
}

function mapStateToProps(state) {
  const { auth } = state;

  return {
    auth: auth,
    user: auth && auth.get('user'),
    config: state.config
  };
}

export default connect(mapStateToProps)(App);
