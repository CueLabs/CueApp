import React, { Component } from 'react'
import { connect } from 'react-redux'
import { loadUser } from './actions'
import Nav from './components/Nav'
import Main from './components/Main'
import Loader from './components/Loader'
import UserView from './components/UserView'

class App extends Component {
  componentDidMount () {
    const { dispatch } = this.props
    const token = window.localStorage.getItem('cue-access-token')
    if (token !== null) {
      dispatch(loadUser(token))
    } else {
      dispatch({
        type: 'STOP_LOADING'
      })
    }
  }

  render () {
    const {
      isActive,
      beginning,
      dispatch,
      suid,
      spotifyResults,
      flip
    } = this.props

    console.log(spotifyResults)

    return (
      <Main>
        {
          !beginning &&
            <Nav showSearch={isActive}
              dispatch={dispatch}
              suid={suid}
              results={spotifyResults}
              flip={flip} />
        }
        {
          !beginning
            ? <UserView {...this.props} />
            : <Loader first />
        }
      </Main>
    )
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(App)
