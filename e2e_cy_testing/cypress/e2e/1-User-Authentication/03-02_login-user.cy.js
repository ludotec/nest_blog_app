describe('login-part-2', () => {
    it('acceder al endpoint "/login" enviando datos del login desde cypress', () => {

        const sentArgs = { email: 'test@gmail.com', password: 'test12345678' }
        cy.visit('http://localhost:4200/login')
        localStorage.clear()
        cy.get('[data-test-id="emailField"').type(sentArgs.email);
        cy.get('[data-test-id="passwordField"').type(sentArgs.password);
        cy.get('[data-test-id="submitButton"').click()
            .then((resp) => {
                cy.wrap(localStorage)
                    .invoke('getItem', 'access_token')
                    .should('exist')
            });


    });
})