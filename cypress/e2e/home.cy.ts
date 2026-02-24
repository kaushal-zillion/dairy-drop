describe('Home Page Test', () => {

  it('Visits the Angular app', () => {
    cy.visit('http://localhost:4200')
  })

})

describe('Login Flow', () => {

  it('logs user in successfully', () => {

    cy.visit('http://localhost:4200/login')

    cy.get('.btn-submit').should('be.disabled')
    cy.get('#email').type('kaushal@gmail.com')
    cy.get('#password').type('123456')

    cy.get('.btn-submit').should('not.be.disabled')
    cy.get('.btn-submit').click()

    cy.contains('Welcome').should('be.visible')

  })

})

describe('Login Validation', () => {

  it('shows error for invalid email', () => {

    cy.visit('/login')

    cy.get('#email').type('wrong-email')
    cy.get('.btn-submit').click()

    cy.contains('Invalid credentials').should('be.visible')

  })

})