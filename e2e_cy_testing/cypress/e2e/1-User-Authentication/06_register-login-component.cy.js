/// <reference types="cypress" />

context('register', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/register');
    });
    //user test
    it('Desde la interfaz "http:localhost:4200/register", creando usuario "test"', () => {
        cy.task('queryDb', "DELETE from user_entity");

        cy.get('[data-test-id="nameField"]').type('test');
        cy.get('[data-test-id="emailField"]').type('test@gmail.com');
        cy.get('[data-test-id="passwordField"]').type('test12345678');
        cy.get('[data-test-id="confirmPasswordField"]').type('test12345678');
        cy.get('[data-test-id="submitButton"]').should('not.be.disabled').click();
    });

    // user test2
    it('Desde la interfaz "http:localhost:4200/register", creando usuario "test2"', () => {
        cy.get('[data-test-id="nameField"]').type('test2');
        cy.get('[data-test-id="emailField"]').type('test2@gmail.com');
        cy.get('[data-test-id="passwordField"]').type('test12345678');
        cy.get('[data-test-id="confirmPasswordField"]').type('test12345678');
        cy.get('[data-test-id="submitButton"]').should('not.be.disabled').click();
    });

    // probando la validación del campo email
    it('Desde la interfaz "http:localhost:4200/register", creando usuario "test22". Comprobamos la validación asincrona', () => {
        cy.get('[data-test-id="nameField"]').type('test22');
        cy.get('[data-test-id="emailField"]').type('test2@g');
        cy.get('[data-test-id="passwordField"]').focus().wait(2000);
        cy.get('[data-test-id="ErrorEmailUsed"]').should('be.visible')
            .contains('Este email ya está en uso.').wait(2000);
        // corregimos datos
        cy.get('[data-test-id="emailField"]').clear().type('test22@gmail.com');
        cy.get('[data-test-id="passwordField"]').type('test12345678');
        cy.get('[data-test-id="confirmPasswordField"]').type('test12345678');
        cy.get('[data-test-id="submitButton"]').should('not.be.disabled').click().wait(2000);

        // llamemos a la base de datos para ver cuantos usuario hay
        cy.task('queryDb', "SELECT * from user_entity").then(result => {
            console.log(result);
            expect(result.rows.length).to.eq(3);
            expect(result.rows[2]).to.have.property('email', 'test22@gmail.com');
        });
    });
});

context('Login component', () => {
    beforeEach(() => {
        cy.visit('http://localhost:4200/login');
    });
    // user test
    it('desde la interfaz "http://localhost:4200/login", hagamos login con nuestro usuario "test22@gmail.com"', () => {
        cy.get('[data-test-id="emailField"]').type('test22@gmail.com');
        cy.get('[data-test-id="passwordField"]').type('test12345678');
        cy.get('[data-test-id="submitButton"]').should('not.be.disabled').click().then(() => {
            // no recibe nada ya que no es un response, sino un click de botón
            cy.wrap(localStorage)
                .invoke('getItem', 'access_token')
                .should('exist');
        });
    });
});