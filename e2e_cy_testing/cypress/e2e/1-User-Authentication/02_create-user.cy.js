/// <reference types="cypress" />
describe('Create user', () => {
    it('endpoint: send body {email, name and password} and receive a status code 200, and the same user with an id, without password', () => {
        cy.task('queryDb', 'DELETE from user_entity').then((results) => {
            cy.log(results);
        })
        cy.request({
            method: 'POST',
            url: 'http://localhost:3000/api/users',
            form: false,
            body: {
                name: 'test',
                email: 'test@gmail.com',
                password: 'test12345678',
                role: 'admin'
            }
        }).then((resp) => {
        expect(resp.status).to.eq(201) //recurso creado
        expect(resp.body).to.have.property('name', 'test')
        expect(resp.body).to.have.property('email','test@gmail.com')
        expect(resp.body).to.have.property('role', 'user')
        // Comprobar si el id existe y si es del tipo string
        expect(resp.body).to.have.property('id')//.that.is.a('number')
        // Comprobar si el access_token existe y no esta vacío
        // expect(resp.body).to.have.property(Cypress.env('JWT_NAME')).that.is.not.empty
        });
    });
});

    /*it('should return an error if required fields are missing', () => {
        cy.request({
            method: 'POST',
            url: `${Cypress.env('API_URL')}/api/scurity/login`,
            failOnStatusCode: false, // Esto permite que la prueba no falle por código de estado diferente a 2xx
            body: {
                // Aqí puedes enviar datos incomplñetos o incorrectos, nos falta el userName 
                email: 'test1@agileninjatech.com',
                password: Cypress.env('DEFAULT_PASSWORD'),
            }
        }).then((resp) => {
            // verificamos que la respuesta tenga el formato esperado
            expect(resp.status).to.not.eq(201) // Esperamos que el código de estado no sea 201
            expect(resp.status).to.eq(404) // Esperamos que el servidor responda con un código 400 bad request
            expect(resp.body).to.have.property('message') // Esperamos que el cuerpo de la respuesta contenga un mensage de error
            expect(resp.body).to.have.property('statusCode', 404) // Esperamos que el código de estado sea 404
        })
        localStorage.clear()
    }),
    it('should redirect to user profile after register automatically', () => {
        let userId // Variable para almacenar el ID del usuario

        // Borramos cualquier usuario existente en la base de datos
        cy.task('queryDb', 'DELETE from user_entity').then((results) => {
            cy.log(results)
        })

        // Limpiamos cualquier token que pueda estar en el localStorage
        localStorage.clear()

        // Interceptamos la solicitud de registro y capturamos su respuesta
        cy.intercept('POST', 'http://127.0.01:3000/api/users').as(
            'registerRequest',
        )
        // Llama a la función registerUser con los datos del ususraio
        const userData = {
            userName: 'test',
            email: Cypress.env('DEFAULT_EMAIL'),
            password: Cypress.env('DEFAULT_PASSWORD'),
        }
        cy.registerUserByInterfaz(userData)

        // Esperamos a que se complete la solicitud de registro
        cy.wait('@registerRequest').then((interception) => {
            // Accedemos a la respuesta del backend para obtener el Id del usuario registrado
            userId = interception.response.body.user.id
            // Verificamos la redirección a la página del perfil de usuario, sabemos que tras un registro hace el login automáticamente
            cy.url().should('eq', `http://localhost:4200/#/users/${userId}`)
        })
    }))
})*/