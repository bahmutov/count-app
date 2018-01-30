const { h, app } = window.hyperapp
const { div, span, button, footer, aside } = window.html

const state = {
  a: 0,
  b: 0,
  op: '+',
  correct: 0,
  disabledAnswers: {},
  language: 'ру'
}

const switchLanguage = (language) =>
  language === 'ру' ? 'en' : 'ру'

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
  },
  language: () => (state) => ({language: switchLanguage(state.language)})
}

const correctAnswers = (language, n) =>
  language === 'ру' ? `Правильно ${n}` : `Correct ${n}`

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

  return div([
    div({class: 'problem'}, [
      span({}, state.a),
      span({}, state.op),
      span({}, state.b),
    ]),
    div({class: 'answers'}, answers),
    footer({}, correctAnswers(state.language, state.correct)),
    aside({
      class: 'language',
      onclick: actions.language
    }, state.language)
  ])
}

app(state, actions, view, document.getElementById('app'))
