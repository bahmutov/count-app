/// <reference types="Cypress" />
describe('Count', () => {
  beforeEach(() => {
    cy.visit('dist/index.html')
  })

  const solveZeroPlusZero = () => {
    cy.contains('.a', '0')
    cy.contains('.op', '+')
    cy.contains('.b', '0')
    cy.contains('.answers > button', '0').click()
  }

  it('adds 0 + 0', () => {
    cy.get('.problem').should('be.visible')
    solveZeroPlusZero()
    cy.contains('footer', 'Правильно 1')
  })

  it('switches to English', () => {
    solveZeroPlusZero()
    cy.get('aside.language').click()
      .should('contain', 'en')
    cy.contains('footer', 'Correct 1')

    cy.log('language is remembered')
    cy.reload()
    cy.contains('aside.language', 'en')
  })
})
