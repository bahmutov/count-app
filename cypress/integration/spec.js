/// <reference types="Cypress" />
describe('Count', () => {
  let app
  beforeEach(() => {
    cy.visit('dist/index.html')
    cy.window().its('app').then(a => {
      app = a
    })
  })

  const getState = () =>
    cy.window().its('app').invoke('getState')

  const getAppActions = () =>
    cy.window().its('app')

  const showsTheProblem = () => {
    getState().its('problem')
    .then(problem => {
      cy.contains('.problem', problem)
    })
  }

  const showsTheSolution = () => {
    getState().its('problem')
    .then(problem => {
      cy.contains('.problem.right', problem)
    })
    cy.get('.problem.right').should('not.exist')
  }

  const pressButton = (caption) => {
    expect(caption).to.be.a('number')
    const answer = new RegExp(`^${caption}$`)
    cy.contains('.answers > button', answer).click()
  }

  const solvesTheProblem = () => {
    showsTheProblem()
    getState().its('expectedAnswer')
      .then(pressButton)
  }

  it('cannot get more points by clicking right answer many times', () => {
    showsTheProblem()
    getState().its('expectedAnswer')
      .then(answer => {
        pressButton(answer)
        pressButton(answer)
        pressButton(answer)
      })
    // there should be a single correct answer
    cy.contains('footer', 'правильно 1')
  })

  it('has answer buttons', () => {
    cy.get('.answers button').should('have.length', 41)
    cy.contains('.answers button', /^0$/)
  })

  it('exposed app actions', () => {
    getAppActions().should('be.an', 'object')
  })

  it('solves given problem', () => {
    getAppActions().its('setNextQuestion').then(setNextQuestion => {
      setNextQuestion({
        a: 2,
        b: 10,
        problem: '2 + 10',
        expectedAnswer: 12
      })
    })
    cy.contains('.problem', '2 + 10').should('be.visible')
    pressButton(12)
    cy.contains('footer', 'правильно 1')
  })

  it('solves first problem', () => {
    cy.get('.problem').should('be.visible')
    solvesTheProblem()
    cy.contains('footer', 'правильно 1')
    showsTheSolution()
  })

  it('solves 3 problems', () => {
    solvesTheProblem()
    showsTheSolution()
    solvesTheProblem()
    showsTheSolution()
    solvesTheProblem()
    showsTheSolution()
    cy.contains('footer', 'правильно 3')
  })

  it('switches to English', () => {
    solvesTheProblem()
    cy.get('aside.language').click()
      .should('contain', 'en')
    cy.contains('footer', 'correct 1')

    cy.log('language is remembered')
    cy.reload()
    cy.contains('aside.language', 'en')
  })

  it('keeps score', () => {
    solvesTheProblem()
    showsTheSolution()
    cy.reload()
    cy.contains('footer', 'правильно 1')
  })

  it('saves in local storage', () => {
    solvesTheProblem()
    showsTheSolution()
    cy.window().its('localStorage').then(ls => {
      return {
        correct: ls.getItem('correct'),
        language: ls.getItem('language')
      }
    }).should('deep.equal', {
      correct: '1',
      language: 'ру'
    })
  })

  it('looks good on iphone', () => {
    cy.viewport('iphone-6')
    solvesTheProblem()
    showsTheSolution()
  })

  it('can make wrong guesses', () => {
    showsTheProblem()
    getState().its('expectedAnswer')
      .then(expectedAnswer => {
        if (expectedAnswer === 0) {
          pressButton(20)
        } else {
          pressButton(`-${expectedAnswer}`)
        }
      })
    cy.get('button:disabled').should('have.length', 1)
    cy.contains('footer', 'правильно 0')
  })
})
