describe('Live Crypto -', ()=> {
  beforeEach(() => cy.visit('http://localhost:3000/'))
  it('When crypto is searched -', () => {
    cy.get('[name=search-crypto]').should('be.visible');
    cy.get('[name=search-crypto]').type('bitcoin');
    cy.get('[data-test=add-button]').click();
    cy.get('[data-test=websocket').should('contain', 'Open');
    cy.get('[data-test=crypto-list').within(() => {
      cy.get('li').should('have.length', 1);
      cy.contains('bitcoin');      
    })
  })
})