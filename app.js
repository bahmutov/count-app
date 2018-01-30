const { h, app } = window.hyperapp
const { div, span, button, footer } = window.html

const state = {
  a: 0,
  b: 0,
  op: '+',
  correct: 0,
  disabledAnswers: {}
}

const random = () => Math.floor(Math.random() * 10)

const actions = {
  answer: (answer) => state => {
    if (state.a + state.b === answer) {
      return {
        a: random(),
        b: random(),
        correct: state.correct + 1,
        disabledAnswers: {}
      }
    }

    const disabledAnswers = state.disabledAnswers
    disabledAnswers[String(answer)] = true

    return {disabledAnswers}
  }
}

const view = (state, actions) => {
  console.log(state.disabledAnswers)
  const answers = Array.from(Array(20)).map((x, k) => k)
    .map(k => {
      const attributes = {}
      if (state.disabledAnswers[String(k)]) {
        attributes.disabled = 'disabled'
      } else {
        attributes.onclick = actions.answer.bind(null, k)
      }
      return button(attributes, String(k))
    })

  console.log('correct answers', state.correct)
  return div([
    div({class: 'problem'}, [
      span({}, state.a),
      span({}, state.op),
      span({}, state.b),
    ]),
    div({class: 'answers'}, answers),
    footer({}, `Правильно ${state.correct}`)
  ])
}

app(state, actions, view, document.getElementById('app'))
