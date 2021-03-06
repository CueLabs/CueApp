import React, { Component } from 'react'
import { loadEventInfo } from '../actions'
import Socket from '../utils/Socket'

class EventGuest extends Component {
  constructor (props) {
    super(props)

    this.leaveEvent = this.leaveEvent.bind(this)
  }

  componentDidMount () {
    const { dispatch, eventId, userId } = this.props
    const ws = new Socket(eventId)
    guestSockets[eventId.toString()] = ws
    guestSockets[eventId.toString()].assignMessageReader(msg => {
      if (msg.user_id === userId) {
        switch (msg.message_type) {
          case 'GUEST_LEAVE_EVENT':
            dispatch({
              type: 'GUEST_EXIT'
            })
        }
      } else if (msg.message_type === 'END_EVENT') {
        dispatch({
          type: 'HOST_END_EVENT'
        })
      }
    })
    dispatch(loadEventInfo(eventId))
  }

  leaveEvent () {
    const { eventId, userId } = this.props
    if (guestSockets.hasOwnProperty(eventId.toString())) {
      guestSockets[eventId.toString()].sendMessage({
        event_id: eventId,
        host_id: -1,
        user_id: userId,
        display_name: '',
        message_type: 'GUEST_LEAVE_EVENT'
      })
    }
  }

  componentWillUnmount () {
    const { eventId } = this.props
    if (guestSockets.hasOwnProperty(eventId.toString())) {
      guestSockets[eventId.toString()].destroy()
    }
  }

  render () {
    const { eventName } = this.props
    return (
      <div className='page event-guest'>
        <h2 className='guest-view-event-title'>
          {eventName}
        </h2>
        <small onClick={this.leaveEvent}>LEAVE EVENT</small>
      </div>
    )
  }
}

const guestSockets = {}

export default EventGuest
