/// <reference types="Cypress" />
describe('Count', () => {
  beforeEach(() => {
    cy.visit('dist/index.html')
  })

  const showsZeroPlusZero = () => {
    cy.contains('.a-op-b', '0+0')
  }

  const showsZeroPlusZeroEqualsZero = () => {
    cy.contains('.a-op-b', '0+0')
    cy.contains('= 0')
    cy.get('.problem.right').should('be.visible')
  }

  const solveZeroPlusZero = () => {
    showsZeroPlusZero()
    cy.contains('.answers > button', '0').click()
    showsZeroPlusZeroEqualsZero()
  }

  it('adds 0 + 0', () => {
    cy.get('.problem').should('be.visible')
    solveZeroPlusZero()
    cy.contains('footer', 'правильно 1')
  })

  it('switches to English', () => {
    solveZeroPlusZero()
    cy.get('aside.language').click()
      .should('contain', 'en')
    cy.contains('footer', 'correct 1')

    cy.log('language is remembered')
    cy.reload()
    cy.contains('aside.language', 'en')
  })

  it('looks good on iphone', () => {
    cy.viewport('iphone-6')
    solveZeroPlusZero()
  })
})
