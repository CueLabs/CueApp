import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { connect } from 'react-redux'
import axios from 'axios'
import SpotifyWebApi from 'spotify-web-api-node'
import { initAuth, tempLogin } from '../actions'
import spotifyKeys from '../keys'
import SpotifyAuth from '../components/SpotifyAuth'
import CreateEvent from '../pages/CreateEvent'
import Button from '../components/Button'

class Home extends Component {
  constructor () {
    super()
    this.state = {
      tempUsername: '',
      create: false
    }
    this.handleNameChange = this.handleNameChange.bind(this)
    this.login = this.login.bind(this)
    this.createEvent = this.createEvent.bind(this)
  }

  handleNameChange (e) {
    const { value } = e.target
    this.setState({
      tempUsername: value
    })
  }

  login () {
    const { dispatch } = this.props
    if (this.value != '') {
      dispatch(tempLogin(this.state.tempUsername))
    }
  }

  createEvent () {
    this.setState({
      create: true,
    })
  }

  render () {
    const { userId } = this.props
    const { create } = this.state

    let content
    if (userId > 0) {
      if (create) {
        content = <CreateEvent />
      } else {
        content = (
          <div className='page home'>
            <Button home>
              Join An Event
            </Button>
            <Button home
              handler={this.createEvent}>
              Create Event
            </Button>
          </div>
        )
      }
    } else {
      content = (
        <div className='page'>
          <input type='text'
            onChange={this.handleNameChange} />
          <button type='button'
            style={{padding: '12px'}}
            onClick={this.login}>Login</button>
        </div>
      )
    }

   return content
  }
}

const mapStateToProps = state => state

export default connect(mapStateToProps)(Home)