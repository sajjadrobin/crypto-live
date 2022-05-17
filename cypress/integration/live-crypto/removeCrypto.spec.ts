describe('Live Crypto -', ()=> {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
    cy.get('[name=search-crypto]').type('bitcoin');
    cy.get('[data-test=add-button]').click();
    cy.get('[data-test=websocket').should('contain', 'Open');    
  })
  it('When remove button is clicked -', () => {
    cy.on('window:confirm', () => true);
    cy.get('[data-test=crypto-list').within(() => {
      cy.get('li').should('have.length', 1);
      cy.contains('bitcoin');      
      cy.get('button').contains('Remove').click();
      cy.get('li').should('have.length', 0);
    })
  })
})