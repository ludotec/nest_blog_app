## Nest app 
**NODE v21.6.2**
**npm 10.4.0**
**nest 10.3.2**

#### New app 
- comand: "nest new app_name"

#### Task01

**Acceptance criteria:**

1. Use git and github
2. Api set up with Nestjs
3. Postgress Database
4. .env File
5. api have to respond "Hello World"

#### Task02

**Acceptance criteria:**

1. Use typeorm and his repository
2. Use observables instead promises
3. feature module "user"
4. user should have propeties_
    - name 
    - email(unique)
    - id (primary key)
5. Use git flow


#### Task03 : Module auth with JWT authentication (login)

**specifications**

As a user I want to be able to authenticate myself so I can perform (later protected) requests.

**Acceptance criteria:**
1- New Endpoint: POST '/login', check password in method 
2- Expand User model with password
3- Store 'email' alway in lowercase
4- Store 'password' alwas as hashed value in  database 
5- Add an Auth Module for this

#### Task04 : Secure some endpoints with JWT. add a role to the User and protect some endpoint with @hasRole

**specifications**

As a thecnical lead I want that we are able to protect endpoints with a custo hasRole('roleName') annotation,
so we can protect endpoints so they are only available for a user
with a valid JWT token and the specific role.

**Acceptance criteria:**
1- Should be able to use the hasRole() annotation
2- Use jwtGuard and rolesGuard
3- User should have a property 'role'
4- Protect andpoint (with 'role' admin) PUT 'users/:id/role' to update a user role 

#### Task05 : Pagination user

**specifications**

As a thecnical lead I want to see all users, for this I want pagination, so I can turn the page and the user are displayed in a this way. Also we should fix some minor bugs.

**Acceptance criteria:**
1- roles only can change if is in the list of roles.
2- user should not ba able to update his own role.
3- endpoint create(), should always create a user wiyh the role "user"
4- admin is the only that can change roles in users
5- user can change his own password -doing
5- user can change his own password 
6- Gettin all Users should be pageable, use QueryParams

#### Task06 : NG setup project

**specifications**

As a Users I want navigate between login and register, and as a editor or admin between other pages for this roles. So users can navigate to profile like editors and admins, but his profiles will be diferent.
As a technical lead I want a SPA (PWA) with angular.

**Acceptance criteria:**
1- [+] set up with angular
2- [+] modules for admin
3- [+] basic routing
4- [+] basic components/pages login register
5- paginating overview over all users: angular material, table, pagination, endpoint getAllUsers()
6- use proxy.conf to check if connection server is working.
7- [+] PWA
8- [+] CORS

#### Task08 : Formularios reactivos y validaciones con angular

**desciption**

Terminemos esos componentes pendientes de angular, con formularios reactivos, validaciones, angular material, etc.

**Acceptance criteria:**
1.- login formulario reactivo con validaciones
2.- register formulario recativo con validaciones
3.- Custom validators para 'Comparing passwords'
4.- asyn vallidation para emailExist

Vamos con el auth service y el user service, nos hará falta para poder loguearnos, registrarnos, sabe si un usuario ya existe a partie de su email, para ello utilizaremos los endpoints que hemos creado en el backend:

1.- **auth.service**
- login: http://localhost:4200/api/users/login
- register: http://localhost:4200/api/users/register

estos dos ya los hicimos, vamos con el user service

2.- **user.service**
- emailexists: http://lcalhost:4200/api/users/exist

ahora vamos a los componentes, empecemos por el register:

cearemos un formulario reactivo con agular material, con un email, password, password2 y un boton de submit.

Vamos a la parte de html y con los mat-form-field creemos esos campos.

#### Task-09: más test de cypress

**tests**
--> test cerar usuario, con 'name', 'password' y ver que al cerarlo nos devuelve ese usuario con un 'id', prestar atención quí a las validaciones, (email correcto y formulñario completo).
--> test acceder al endpoint '/login' check password (email válido, formulario completo).
--> test al crtear un usuario este debe guadar una password encriptada en bd
--> test el email debe estar en minúsculas en la bd siempre.
--> test comprobar si una petición (el admin actualiza un role) necesita el hasRole().
-> test lo mismo para Roles guard().
--> test todos los usuarios deben tener un role de tipo 'user' | 'editor' | 'admin'.
--> test create() solo puede crear usuarios con role 'user'.
--> test ver que funciona la paginación, crear al menos 15 usuarios para estas comprobaciones.

Task 17: Blog Module & TypeOrm @ManyToOne() relation

New module blog, tendremos los modelos para las entradas del blog, construimos los conttroladores y servicios.

Criterios de Acepatción:
- New module blog
- blog-entry.entity, blog-entry.interface manyToOne RelationShip to user
- Blog Entry (blog interface) con relación muchos a uno con el usuario
- uno a muchos relación de usuarios con las entradas

