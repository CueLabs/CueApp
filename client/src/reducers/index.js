const initialState = {
  query: '',
  events: [],
  guests: [],
  selectedEventId: -1,
  selectedEventName: '',
  searchLoading: false,
  userId: -1,
  displayName: '',
  isHost: false,
  hostId: -1,
  hostView: 0,
  isActive: false,
  eventId: null,
  eventName: '',
  userAuthorized: false,
  awaitingAuth: false,
  authPage: null,
  joinRequestPending: false,
  eventLoading: false,
  acceptedGuest: -1,
  beginning: true,
  counter: 0,
  done: false
}

const cueReducer = (state = initialState, action) => {
  const { guests } = state
  switch (action.type) {
    case 'STOP_LOADING':
      return {
        ...state,
        beginning: false
      }
    case 'CHANGE_HOST_VIEW':
      return {
        ...state,
        hostView: action.num
      }
    case 'TEMP_LOGIN_REQUEST':
      return {
        ...state
      }
    case 'TEMP_LOGIN_SUCCESS':
      return {
        ...state,
        userId: action.id,
        displayName: action.username
      }
    case 'JOIN_REQUEST': {
      return {
        ...state,
        joinRequestPending: true
      }
    }
    case 'HOST_NEW_REQUEST': {
      return {
        ...state,
        done: true,
        guests: [
          ...guests,
          {
            UserID: action.userId,
            DisplayName: action.username,
            IsActive: action.isActive,
            EventID: action.eventId
          }
        ],
        counter: action.updateCounter ? state.counter + 1 : 0
      }
    }
    case 'LOAD_USER_REQUEST':
      return {
        ...state
      }
    case 'LOAD_USER_SUCCESS':
      return {
        ...state,
        userId: action.id,
        displayName: action.username,
        isActive: action.isActive,
        eventId: action.eventId,
        eventName: action.eventName,
        beginning: false,
        counter: 0
      }
    case 'DONE': 
      return {
        ...state,
        done: true
      }
    case 'RESUME_PENDING':
      return {
        ...state,
        joinRequestPending: true,
        selectedEventId: action.eventId,
        selectedEventName: action.eventName
      }
    case 'LOADING_REQUESTS':
      return {
        ...state,
        counter: 0
      }
    case 'HOST_JUST_ACCEPTED': {
      return {
        ...state,
        counter: 0,
        done: true,
        guests: guests
          .map(g => {
            if (g.UserID === action.id) {
              return {
                ...g,
                IsActive: true
              }
            } else {
              return g
            }
          })
      }
    }
    case 'HOST_JUST_REJECTED': {
      return {
        ...state,
        counter: 0,
        done: true,
        guests: guests
          .filter(g => {
            if (g.UserID === action.id) {
              return false
            } else {
              return true
            }
          })
      }
    }
    case 'GUEST_ACCEPTANCE':
      return {
        ...state,
        done: false,
        joinRequestPending: false,
        eventId: state.selectedEventId,
        eventName: state.selectedEventName,
        isActive: true
      }
    case 'GUEST_REJECTION':
      return {
        ...state,
        done: true,
        joinRequestPending: false,
        selectedEventName: '',
        selectedEventId: -1,
        query: ''
      }
    // for event host
    case 'GUEST_LEFT_EVENT':
      return {
        ...state,
        guests: guests
          .filter(g => {
            if (g.UserID === action.id) {
              return false
            } else {
              return true
            }
          })
      }
    // for event guest
    case 'GUEST_EXIT':
      return {
        ...state,
        isActive: false,
        eventId: -1,
        eventName: '',
        selectedEventId: -1,
        hostId: -1
      }
    case 'USER_REMOVED_FROM_EVENT':
      return {
        ...state,
        done: false,
        isActive: false,
        hostId: -1,
        eventName: '',
        eventId: null,
        selectedEventName: '',
        selectedEventId: -1,
        beginning: false,
        counter: 0
      }
    case 'HOST_END_EVENT':
      return {
        ...state,
        done: true,
        isActive: false,
        isHost: false,
        hostId: -1,
        eventName: '',
        eventId: null,
        selectedEventName: '',
        selectedEventId: -1,
        beginning: false,
        counter: 0
      }
    case 'LOAD_REQUESTS_SUCCESS':
      return {
        ...state,
        guests: action.data,
        counter: 0
      }
    case 'NEW_EVENT_SUCCESS':
      return {
        ...state,
        eventName: action.evName,
        eventId: action.evId,
        isActive: true
      }
    case 'LOAD_EVENT_REQUEST':
      return {
        ...state,
        eventLoading: true
      }
    case 'LOAD_EVENT_SUCCESS':
      return {
        ...state,
        hostId: action.hostId,
        eventName: action.name,
        eventLoading: false,
        eventId: action.eventId,
        done: false
      }
    case 'SEARCH_EVENTS_REQUEST':
      return {
        ...state,
        query: action.value,
        searchLoading: true
      }
    case 'SEARCH_EVENTS_SUCCESS':
      return {
        ...state,
        query: action.value,
        events: action.results,
        searchLoading: false
      }
    case 'SEARCH_EVENTS_FAILURE':
      return {
        ...state,
        query: action.value,
        events: [],
        searchLoading: false
      }
    case 'EVENT_SELECT':
      return {
        ...state,
        selectedEventId: action.eventId,
        selectedEventName: action.eventName
      }
    case 'EVENT_ENDING': {
      return {
        ...state,
        beginning: true
      }
    }
    case 'EVENT_END_SUCCESS': {
      return {
        ...state,
        done: true,
        beginning: false
      }
    }
    case 'MODAL_CLOSE':
      return {
        ...state,
        selectedEventName: '',
        selectedEventId: -1
      }
    default:
      return state
  }
}

export default cueReducer