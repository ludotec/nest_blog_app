/// <reference types="cypress" />
context('Login user', () => {
    it('Eliminar la tabla users, crear uno con un request a la api', () => {
        cy.task('queryDb', 'DELETE from user_entity').then((results) => {
            cy.log(results);
        })
        // crear usuario
        cy.request({
            method: 'POST',
            url: 'http://127.0.0.1:3000/api/users',
            form: false,
            body: {
                name: 'test',
                email: 'test@gmail.com',
                password: 'test12345678',
                role: 'admin'
            }
        })
    });
    
});
