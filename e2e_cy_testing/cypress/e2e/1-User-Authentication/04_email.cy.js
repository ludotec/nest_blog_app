context('Create User using ng interface', () => {
    it('Sending a successfullu form: send body {email, name and password} and receive status code 201, response with the same user with an id, without password, and the role is "user', () => {
        cy.task('queryDb', 'DELETE from user_entity').then((results) => {
            cy.log(results);
        })
        cy.visit('http://localhost:4200/register')
        localStorage.clear(); // limpiamos por sia acaso quedan resto de otras pruebas

        cy.intercept('POST', 'http://127.0.0.1:3000/api/users').as('registerRequest');

        const dataArgs = {name: 'test2', email: 'test2@gmail.com', password: 'test12345678', role: 'user'};

        cy.get('[data-test-id="nameField"]').type(dataArgs.name);
        cy.get('[data-test-id="emailField"]').type(dataArgs.email);
        cy.get('[data-test-id="passwordField"]').type(dataArgs.password);
        cy.get('[data-test-id="confirmPasswordField"]').type(dataArgs.password);
        cy.get('[data-test-id="submitButton"]').click()

        cy.wait('@registerRequest').then((interception) => {
            expect(interception.response.statusCode).to.eq(201)
            expect(interception.response.body).to.have.property('name', dataArgs.name);
            expect(interception.response.body).to.have.property('email', dataArgs.email);
            expect(interception.response.body).to.have.property('role', dataArgs.role);
            expect(interception.response.body).to.have.property('id');
            cy.log('## DATA: ', JSON.stringify(interception.response));
        });
    });

    it('should have a frontend error in ng UI, because we put in the input type email, the same email than other user', () => {
        // no limpiamos la base de datos ahí tenemos al usuario de la prueba anterior
        cy.visit('http://localhost:4200/register');
        cy.get('[data-test-id="nameField"]').type('test2');
        cy.get('[data-test-id="emailField"]').type('test2@gmail.com').blur();
        cy.get('[data-test-id="emailField"]').should('have.class', 'ng-invalid');
        cy.get('[data-test-id="ErrorEmailUsed"]').should('be.visible').should('contain', 'Este email ya está en uso.');
    });
});

context('Login user using frontend ng interface', () => {
    
    it('debe iniciar sesión con éxito', () => {
        // visit page
        cy.visit('http://localhost:4200/login');

        // Intercepta la solicitud POST a la API de inicio de sesión
        cy.intercept('POST', 'http://127.0.0.1:3000/api/users/login').as('loginRequest');
        const dataArgs = {name: 'test2', email: 'test2@gmail.com', password: 'test12345678', role: 'user'};
        // Ingresa el correo y la contraseña
        cy.get('[data-test-id="emailField"]').type(dataArgs.email);
        cy.get('[data-test-id="passwordField"]').type(dataArgs.password);

        // Envía el formulario
        cy.get('[data-test-id="submitButton"]').click();

        cy.wait(2000);
        // Espera a que se complete la solicitud de inicio de sesión
        cy.wait('@loginRequest').then((interception) => {
            // Verifica el estado de la solicitud
            expect(interception.response.statusCode).to.eq(201); // Cambia el código de estado según tu API
            // Verifica la respuesta
            expect(interception.response.body).to.have.property('access_token');
            // Puedes agregar más aserciones según la respuesta de tu API
        });

        // Verifica que el usuario haya iniciado sesión correctamente en la interfaz
        // cy.contains('Bienvenido, Usuario); // Ajusta según tu interfaz

        it('Sending a not successfully form: sebd body {email(taken), name and password} and receive a status code 201, but with error', () => {
            // DONOT clean the DB, because we need the user to be created to test the error
            localStorage.clear();
            // Es necesario enviarlo por debajo, sino como el mail está en uso, no se puede enviar, ya que el botón del formulario no está activo
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/users',
                form: false,
                body: {
                    name: "textx",
                    email: "test2@gmail.com",
                    password: "test12345678"
                }
            })
            .then((resp) => {
                expect(resp.status).to.eq(201);
                expect(resp.body).to.have.property('error');
                expect(resp.body.error).to.contains('duplicate key value violates unique constraint');
                console.log('### DATA: ', resp.body);
            });
        });
    });
    
});