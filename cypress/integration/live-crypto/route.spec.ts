describe('Live Crypto -', ()=> {
  beforeEach(() => cy.visit('http://localhost:3000/'))
  it('route is available', () => {
    cy.get('[data-test=add-button]').should('be.visible');
  })
})