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


