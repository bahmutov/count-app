const { h, app } = window.hyperapp
const { div, span, button } = window.html

const state = {
  a: 0,
  b: 0,
  op: '+'
}

const actions = {}

const view = (state, actions) => {
  return div([
    div({class: 'problem'}, [
      span({}, state.a),
      span({}, state.op),
      span({}, state.b),
    ])
  ])
}

app(state, actions, view, document.getElementById('app'))
