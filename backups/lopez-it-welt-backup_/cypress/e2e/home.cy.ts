describe('Home Page', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should load the home page', () => {
    cy.get('h1').should('be.visible');
  });

  it('should have working navigation', () => {
    cy.get('nav').should('be.visible');
    cy.get('nav a').first().click();
    cy.url().should('not.equal', '/');
  });

  it('should have responsive design', () => {
    cy.viewport('iphone-6');
    cy.get('nav').should('be.visible');
    cy.viewport('macbook-13');
    cy.get('nav').should('be.visible');
  });

  it('should have working dark mode', () => {
    cy.get('[data-theme-toggle]').click();
    cy.get('body').should('have.class', 'dark-mode');
  });

  it('should have working search', () => {
    cy.get('[data-search-input]').type('test');
    cy.get('[data-search-results]').should('be.visible');
  });
});
