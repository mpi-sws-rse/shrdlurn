import Constants from "constants/actions"
import { STATUS } from "constants/strings"

const initialMap = [
  // Border
  {x:-5,y:-5, type: "wall", color:null},
  {x:-4,y:-5, type: "wall", color:null},
  {x:-3,y:-5, type: "wall", color:null},
  {x:-2,y:-5, type: "wall", color:null},
  {x:-1,y:-5, type: "wall", color:null},
  {x:0,y:-5, type: "wall", color:null},
  {x:1,y:-5, type: "wall", color:null},
  {x:2,y:-5, type: "wall", color:null},
  {x:3,y:-5, type: "wall", color:null},
  {x:4,y:-5, type: "wall", color:null},
  {x:5,y:-5, type: "wall", color:null},
  {x:5,y:-4, type: "wall", color:null},
  {x:5,y:-3, type: "wall", color:null},
  {x:5,y:-2, type: "wall", color:null},
  {x:5,y:-1, type: "wall", color:null},
  {x:5,y:0, type: "wall", color:null},
  {x:5,y:1, type: "wall", color:null},
  {x:5,y:2, type: "wall", color:null},
  {x:5,y:3, type: "wall", color:null},
  {x:5,y:4, type: "wall", color:null},
  {x:5,y:5, type: "wall", color:null},
  {x:4,y:5, type: "wall", color:null},
  {x:3,y:5, type: "wall", color:null},
  {x:2,y:5, type: "wall", color:null},
  {x:1,y:5, type: "wall", color:null},
  {x:0,y:5, type: "wall", color:null},
  {x:-1,y:5, type: "wall", color:null},
  {x:-2,y:5, type: "wall", color:null},
  {x:-3,y:5, type: "wall", color:null},
  {x:-4,y:5, type: "wall", color:null},
  {x:-5,y:5, type: "wall", color:null},
  {x:-5,y:4, type: "wall", color:null},
  {x:-5,y:3, type: "wall", color:null},
  {x:-5,y:2, type: "wall", color:null},
  {x:-5,y:1, type: "wall", color:null},
  {x:-5,y:0, type: "wall", color:null},
  {x:-5,y:-1, type: "wall", color:null},
  {x:-5,y:-2, type: "wall", color:null},
  {x:-5,y:-3, type: "wall", color:null},
  {x:-5,y:-4, type: "wall", color:null},
  {x:-5,y:-5, type: "wall", color:null},

  {x:-4,y:0, type: "wall", color:null},
  {x:-3,y:0, type: "wall", color:null},
  {x:-2,y:0, type: "wall", color:null},
  {x:-1,y:0, type: "wall", color:null},
  {x:2,y:0, type: "wall", color:null},
  {x:3,y:0, type: "wall", color:null},
  {x:4,y:0, type: "wall", color:null},

  {x:4,y:3,  type: "item", color:"blue"},
  {x:4,y:-4, type: "item", color:"red"},
  {x:0,y:-2, type: "item", color:"red"},
  {x:0,y:-2, type: "item", color:"green"},
  {x:-3,y:3, type: "item", color:"green"}
]

const initialState = {
  history: [{
    text: "initial",
    worldMap: initialMap,
    robot: {
      x:-3, y:-2,
      type: "robot",
      items: []
    },
    path: [],
    formula: "(initial)" }],
  responses: [],
  current_history_idx: -1,
  status: STATUS.PATH,
  query: "",
  defining: false,
  exampleQuery: "add red 3 times",
  defineN: null
}

export default function reducer(state = initialState, action = {}) {
  switch (action.type) {
    case Constants.SET_QUERY:
      return { ...state, query: action.query }
    case Constants.REVERT:
      if (state.defining) {
        return state
      }
      return { ...state, current_history_idx: action.idx, responses: initialState.responses, status: initialState.status, query: initialState.query }

    case Constants.FIND_PATH:
      let myHistory = state.history;
      if (state.current_history_idx >= 0) {
        myHistory = myHistory.slice(0, state.current_history_idx + 1)
      }
      return { ...state,responses: action.responses, history: myHistory, current_history_idx: -1, status: STATUS.ACCEPT }
    case Constants.TRY_QUERY:
      let history = state.history
      if (state.current_history_idx >= 0) {
        history = history.slice(0, state.current_history_idx + 1)
      }
      return { ...state, responses: action.responses, history: history, current_history_idx: -1, status: STATUS.ACCEPT }
    case Constants.ACCEPT:
      const newHistory = [...state.history, action.el]
      return { ...state, history: newHistory, responses: [], status: STATUS.PATH/*TRY*/, query: "" }
    case Constants.DEFINE:
      // TODO The "value" here will have to be changed
      let collapsedHistory = [...state.history.slice(0, action.idx), { text: action.text, value: state.history[state.history.length - 1].value, formula: action.formula }]
      if (collapsedHistory.length === 0) collapsedHistory = initialState.history
      else if (collapsedHistory.length === 1) collapsedHistory = [...initialState.history, ...collapsedHistory]
      return { ...state, history: collapsedHistory, defining: false, defineN: null, query: "", status: STATUS.PATH/*TRY*/ }
    case Constants.SET_STATUS:
      return { ...state, status: action.status }
    case Constants.RESET_RESPONSES:
      return { ...state, status: STATUS.PATH/*TRY*/, query: "", responses: [] }
    case Constants.OPEN_DEFINE:
      return { ...state, defining: true, defineN: action.defineN }
    case Constants.CLOSE_DEFINE:
      const cleanHistory = state.history.filter(h => h.formula !== "false") /* we have to clean up any inejcted pins */
      return { ...state, defining: false, defineN: null, query: "", status: STATUS.TRY, history: cleanHistory }
    case Constants.SET_DEFINE_N:
      return { ...state, defineN: action.defineN }
    case Constants.SET_PIN:
      // TODO Change "value"
      let newHistoryWithPin = [...state.history, { text: state.query, type: "pin", value: state.history[state.history.length - 1].value, formula: "()" }]
      return { ...state, history: newHistoryWithPin, query: initialState.query, responses: initialState.responses, status: initialState.status, defining: initialState.defining, defineN: initialState.defineN }
    case Constants.REMOVE_PIN:
      let newHistoryWithoutPin = state.history.slice()
      newHistoryWithoutPin.splice(action.idx, 1)
      return { ...state, history: newHistoryWithoutPin, current_history_idx: initialState.current_history_idx }
    case Constants.MARK_PIN:
      const markedHistory = state.history.slice()
      const index = action.idx ? action.idx : markedHistory.length - 1
      markedHistory[index] = { ...markedHistory[index], type: "pin" }
      return { ...state, history: markedHistory }
    case Constants.INJECT_PIN:
      let injectedHistory = state.history.slice(0)
      // TODO Change "value"
      injectedHistory.splice(action.idx, 0, { text: "", type: "pin", value: [], formula: "false" })
      return { ...state, history: injectedHistory }
    case Constants.REMOVE_LAST:
      let trimmedHistory = state.history.slice(0, state.history.length - 1)
      return { ...state, history: trimmedHistory, query: initialState.query, status: initialState.status, responses: initialState.responses }
    case Constants.CLEAR:
      return initialState
    default:
      return state
  }
}