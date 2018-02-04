(function () {
  const { app } = window.hyperapp
  const { div, span, button, footer, aside } = window.html
  const _ = window._

  const range = (from, to) => {
    const a = []
    for (let k = from; k <= to; k += 1) {
      a.push(k)
    }
    return a
  }

  const problemText = (state) =>
    `${state.a}${state.op}${state.b}`

  const state = {
    // ranges of answers
    min: -20,
    max: 20,
    // current problem
    a: 0,
    b: 0,
    op: '-',
    problem: '0-0',
    expectedAnswer: 0,
    // game state
    correct: 0,
    disabledAnswers: {},
    language: 'ру',
    rightAnswer: null
  }

  const switchLanguage = (language) =>
    language === 'ру' ? 'en' : 'ру'

  const heroMessage = (language) =>
    language === 'ру' ? 'счет' : 'count'

  const pickAddition = (min, max) => {
    const a = _.random(0, max)
    const b = _.random(max - a)
    return {a, b}
  }

  const pickSubtraction = (min, max) => {
    const a = _.random(0, max)
    const b = _.random(0, max)
    return {a, b}
  }

  const pickNumbers = (op, min, max) =>
    op === '+' ? pickAddition(min, max) : pickSubtraction(min, max)

  const actions = {
    load: () => state => ({
      language: localStorage.getItem('language') || 'ру',
      correct: parseInt(localStorage.getItem('correct') || '0'),
    }),
    save: () => state => {
      localStorage.setItem('language', state.language)
      localStorage.setItem('correct', state.correct)
    },
    toggleOp: () => state => ({
      op: state.op === '+' ? '-' : '+'
    }),
    // could be done nicely with merge function
    setNextQuestion: ({a, b, problem, expectedAnswer}) => state => ({
      a,
      b,
      problem,
      expectedAnswer,
      disabledAnswers: {},
      rightAnswer: null
    }),
    nextQuestion: () => (state, actions) => {
      const op = state.op
      const {a, b} = pickNumbers(op, state.min, state.max)
      const problem = problemText({a, b, op})
      const expectedAnswer = eval(problem)
      return actions.setNextQuestion({a, b, problem, expectedAnswer})
    },
    rightAnswer: (answer) => (state) => {
      return {
        correct: state.correct + 1,
        rightAnswer: answer
      }
    },
    getState: () => state => state,
    answer: (answer) => (state, actions) => {
      if (state.rightAnswer !== null) {
        // we have already answered this question
        // ignore multiple clicks on the same answer
        return
      }

      if (state.expectedAnswer === answer) {
        setTimeout(actions.nextQuestion, 2000)
        actions.rightAnswer(answer)
        actions.toggleOp()
        return actions.save()
      }

      const disabledAnswers = state.disabledAnswers
      disabledAnswers[String(answer)] = true

      return {disabledAnswers}
    },
    language: () => (state) => {
      language = switchLanguage(state.language)
      return {language}
    }
  }

  const correctAnswers = (language, n) =>
    language === 'ру' ? `правильно ${n}` : `correct ${n}`

  const view = (state, actions) => {
    const answers = range(state.min, state.max)
      .map(k => {
        const attributes = {}
        if (state.disabledAnswers[String(k)]) {
          attributes.disabled = 'disabled'
        } else {
          attributes.onclick = actions.answer.bind(null, k)
        }
        return button(attributes, String(k))
      })

    const problemAttributes = state.rightAnswer === null
      ? {class: 'problem'} : {class: 'problem right'}

    const problem = state.rightAnswer === null
      ? span(state.problem)
      : span(`${state.problem} = ${state.rightAnswer}`)

    return div({oncreate: actions.load}, [
      div({class: 'hero'}, heroMessage(state.language)),
      div(problemAttributes, problem),
      div({class: 'answers'}, answers),
      footer(correctAnswers(state.language, state.correct)),
      aside({
        class: 'language',
        onclick: () => {
          actions.language()
          actions.save()
        }
      }, state.language)
    ])
  }

  window.app = app(state, actions, view, document.getElementById('app'))
}())
