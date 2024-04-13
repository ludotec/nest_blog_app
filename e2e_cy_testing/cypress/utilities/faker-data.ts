// ESM
import { faker } from '@faker-js/faker';
import { User } from './user.interface';

function createRandomUser(): User {
    return {
        name: faker.internet.userName(),
        email: faker.internet.email(),
        password: faker.internet.password()
    }
}

export const USERS: User[] = faker.helpers.multiple(createRandomUser, {
    count: 25,
})
