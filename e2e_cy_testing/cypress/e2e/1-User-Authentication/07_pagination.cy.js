/// <reference types="cypress"/>

//import { result } from "cypress/types/lodash";
import { USERS } from "../../utilities/faker-data";

context('Pagination, get all users, without filtering "name parameter', () => {
    it('Creamos veinticinco usuarios en la base de datos, borrando los que ya se habían credao en anteriores test, tendremos 25 usuarios aleatorios', () => {
        cy.task('queryDb', "DELETE from user_entity").then(results => {
            cy.log(results);
        });
        // enviamos data ficticia desde faker 25 usuarios aleatorios
        USERS.forEach((user) => {
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/users',
                form: false,
                body: user
            }).then((resp) => {
                expect(resp.status).to.eq(201);
                expect(resp.body).to.have.property('role', 'user');
                expect(resp.body).to.have.property('name');
                expect(resp.body).to.have.property('email');
                expect(resp.body).to.have.property('id');
            });
        });
        // paginacion
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users',
            form: false,
        }).then((resp) => {
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[24]).not.to.be.null;
        });
    });

    it('Paginación: de 10 en 10 solicito la primera página, sino ponemos parametro en la url, por defecto es la primera página ', () => {
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users',
            form: false,
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[9]).not.to.be.null;
        });
    });
    it('Paginación: de 20 en 20 solicito la segunda página, me debe de devolver 5 usuarios', () => {
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users?limit=20&page=2',
            form: false,
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[4]).not.to.be.null;
        });
    });
});

context('Paginacion, get all users with filtering name="test', () => {
    it('Creamos veinticinco usuarios en la base de datos, borrando los que ya había de anteriores test, tendremos 25 usuarios aleatorios', () => {
        cy.task('queryDb', 'DELETE from user_entity').then(results => {
            cy.log(results);
        });
        // enviamos data ficticia desde faker 25 usuarios aleatorios
        USERS.forEach((user) => {
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/users',
                form: false,
                body: user
            }).then((resp) => {
                expect(resp.status).to.eq(201);
                expect(resp.body).to.have.property('role', 'user');
                expect(resp.body).to.have.property('name');
                expect(resp.body).to.have.property('email');
                expect(resp.body).to.have.property('id');
            });
        });
        // paginacion
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users',
            form: false,
        }).then((resp) => {
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[24]).not.to.be.null;
        });
    });

    it('creamos dos usuarios más con name="test" y name="test2", respectivamente. Los usaremos para el filtrado', () => {
        const user1 = {
            name: "test",
            email: "test@gmail.com",
            password: "test12345678"
        };
        const user2 = {
            name: "test2",
            email: "test2@gmail.com",
            password: "test12345678"
        };
        cy.request({
            method: "POST",
            url: 'http://localhost:3000/api/users',
            form: false,
            body: user1
        }).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body).to.have.property('name', 'test');
        });
        cy.request({
            method: "POST",
            url: 'http://localhost:3000/api/users',
            form: false,
            body: user2
        }).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body).to.have.property('name', 'test2');
        });

    });
    it('Paginación: de 10 en 10, solicito la primera página, pero añadimos el name="test", devolverá solo dos usuarios coinicidentes', () => {
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users?page=0&limit=10&name=test',
            form: false
        }).then((resp) => {
            expect(resp.status).to.eq(200);
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[1]).not.to.be.null;
            expect(resp.body.items[0]).to.have.property('name', 'test');
            expect(resp.body.items[1]).to.have.property('name', 'test2');
        });
    });

});

context('Pagination, Real time Server Side User Search with Pagination', () => {
    it('Creamos veinticinco usuarios en la base de datos, borrando los que ya había de anteriores test, tendremos 25 usuarios aleatorios', () => {
        cy.task('queryDb', 'DELETE from user_entity').then(results => {
            cy.log(results);
        });
        // enviamos data ficticia desde faker 25 usuarios aleatorios
        USERS.forEach((user) => {
            cy.request({
                method: "POST",
                url: 'http://localhost:3000/api/users',
                form: false,
                body: user
            }).then((resp) => {
                expect(resp.status).to.eq(201);
                expect(resp.body).to.have.property('role', 'user');
                expect(resp.body).to.have.property('name');
                expect(resp.body).to.have.property('email');
                expect(resp.body).to.have.property('id');
            });
        });
        // paginacion
        cy.request({
            method: "GET",
            url: 'http://localhost:3000/api/users',
            form: false,
        }).then((resp) => {
            expect(resp.body).to.have.property('items');
            expect(resp.body.items[0]).not.to.be.null;
            expect(resp.body.items[24]).not.to.be.null;
        });
    });

    it('creamos dos usuarios más con name="test" y name="test2", respectivamente. Los usaremos para el filtrado', () => {
        const user1 = {
            name: "test",
            email: "test@gmail.com",
            password: "test12345678"
        };
        const user2 = {
            name: "test2",
            email: "test2@gmail.com",
            password: "test12345678"
        };
        cy.request({
            method: "POST",
            url: 'http://localhost:3000/api/users',
            form: false,
            body: user1
        }).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body).to.have.property('name', 'test');
        });
        cy.request({
            method: "POST",
            url: 'http://localhost:3000/api/users',
            form: false,
            body: user2
        }).then((resp) => {
            expect(resp.status).to.eq(201);
            expect(resp.body).to.have.property('name', 'test2');
        });

    });
    it('Escribiremos dentro del formulario de busqueda, campo [data-test-id]="searchNameField"', () => {
        cy.visit('http://localhost:4200/users');
        cy.get('[data-test-id="searchNameField"]').focus().type('test');
        cy.get('[data-test-id="usersTable"]').get('mat-row').eq(0).get('mat-cell').eq(1).contains('test');
        cy.get('[data-test-id="usersTable"]').get('mat-row').eq(1).get('mat-cell').eq(1).contains('test');
    });
});