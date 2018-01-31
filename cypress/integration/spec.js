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

  const solvesTheProblem = () => {
    showsTheProblem()
    getState().its('expectedAnswer')
    .then(expectedAnswer => {
      const answer = new RegExp(`^${expectedAnswer}$`)
      cy.contains('.answers > button', answer).click()
    })
  }

  it('has answer buttons', () => {
    cy.get('.answers button').should('have.length', 41)
    cy.contains('.answers button', /^0$/)
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

  it('looks good on iphone', () => {
    cy.viewport('iphone-6')
    solvesTheProblem()
    showsTheSolution()
  })
})
