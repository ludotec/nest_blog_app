describe('login-part-3', () => {
    it('acceder al endpoint "/login" enviando datos del login desde cypress', () => {
        // visitemos la página y borremos el token
        cy.visit('http://localhost:4200/login').then(() => {
            localStorage.clear();

            // enviamos un usuario para crearlo primero 
            // ya hay uno credao en la parte 1 de login, nos debe mostrar el error por consola
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
            }).then(() => {
                // ahora enviamos una petición de login
                cy.request({
                    method: 'POST',
                    url: 'http://localhost:3000/api/users/login',
                    form: false,
                    body: {
                        email: 'test@gmail.com',
                        password: 'test12345678',
                    }
                }).then((resp) => {
                    // observa como ahora en cypress el token no está por ningún lado, si no visitamos la página y hacemos click
                    expect(resp.status).to.eq(201);
                    localStorage.setItem('acces_token', resp.body); // por esto lo grabamos nosotros
                    cy.wrap(localStorage)
                        .invoke('getItem', 'acces_token')
                        .should('exist');
                });
            });
        });
    });
});

