# InnovOrder NestJS CRUD

## Description

The goal of this project was to create a NestJS CRUD API capable of obtaining information on barcodes using OpenFoodFact's API.

## Technical choices

For this project, I decided to go with the following stack:

- **Database:** PostgreSQL
- **ORM:** Prisma
- **Testing:** E2E

## The project

What I was able to implement:
- User Authentication and Authorisation via login/password.
- Private/Guarded route dedicated to making calls to the OpenFoodFact API.
- User login and password modification via a Protected route.
- Getting currently logged in user profile on a protected route
- Caching systems for calls to the OpenFoodFact API using nestJS cache-manager.

What I wasn't able to implement (and would like to learn more about):
- 'Complete' Dockerisation of the project
- Kubernetes Manifest

I found this project really interesting because it pushed me to learn new technologies that I had never used before in a short amount of time. It takes way more time than the usual coding interview but at least, even if you get rejected you might have discovered a new technology.

## Prisma Schema

This is what my Prisma Schema looks like for the User model.

```prisma
model User {
  id Int @id @default(autoincrement())
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  login String @unique
  hash String

  @@map("users")
}
```

## API Documentation

You can click on the links to see the Parameters and Response of every endpoint.

### User Creation

<details>
 <summary><code>POST</code> <code><b>/auth/signup</b></code> </summary>

##### Request parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | login      |  required | string   | Username of the User  |
> | password      |  required | string   | Password of the User  |


##### Response

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | id      |  unique, autoincrement | int   | Id of the User  |
> | createdAt      |  auto | DateTime   | DateTime at which the User was created  |
> | updatedAt      |  auto | Date   | DateTime at which the User was updated  |
> | login      |  unique | string   | Username of the User  |

##### Example 

```javascript
// Request
{
  login: 'hugo',
  password: 'test'
}

// Response
{
  id: 1,
	createdAt: "2023-04-28T06:13:51.548Z",
	updatedAt: "2023-04-28T06:13:51.548Z",
	login: "hugo"
}
```

</details>

---

### User Authentication

<details>
 <summary><code>POST</code> <code><b>/auth/signin</b></code> </summary>

##### Request parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | login      |  required | string   | Username of the User  |
> | password      |  required | string   | Password of the User  |


##### Response

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | access_tokenn      |  JWT Token | string   | Access Token of the User, expires after 15mn  |

##### Example 

```javascript
// Request
{
  login: 'hugo',
  password: 'test'
}

// Response
{
	access_token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiaHVnbyIsImlhdCI6MTY4MjY2MjQ0MSwiZXhwIjoxNjgyNjYzMzQxfQ.U5Yiv9BUxw5IGBz51cI7Q2o-Gwo8636QmKt_VkGO00c"
}
```

</details>

---

### Get Current User

<details>
 <summary><code>GET</code> <code><b>/users/me</b></code> </summary>

##### Request parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | JWT access_token      |  required as Authorization Header with Bearer| JSON   | Used for authentication  |


##### Response

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | user      |  required | User Object, JSON   | User object with updated informations  |


##### Example 

```javascript
// Request
{
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiaHVnbyIsImlhdCI6MTY4MjY2NzA5NiwiZXhwIjoxNjgyNjY3OTk2fQ.-7WUAuf8lL7ljMGpxbH7Q3YyQhfhQptLviS6kBjqHCA'
}

// Response
{
  "id": 2,
  "createdAt": "2023-04-28T07:25:35.506Z",
  "updatedAt": "2023-04-28T07:31:56.087Z",
  "login": "thomas"
}

```

</details>

---

### Edit User's informations

<details>
 <summary><code>PATCH</code> <code><b>/users</b></code> </summary>

##### Request parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | login?      |  optional | string   | Updates the username of the User  |
> | password?      |  optional | string   | Updates the password of the User  |
> | JWT access_token      |  required as Authorization Header with Bearer| JSON   | Used for authentication  |


##### Response

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | user      |  required | User Object, JSON   | User object with updated informations  |
> | message?     |  optional | string   | Displayed if the user changed password because we cannot display the new password or hash  |

##### Example 

```javascript
// Request
{
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiaHVnbyIsImlhdCI6MTY4MjY2NzA5NiwiZXhwIjoxNjgyNjY3OTk2fQ.-7WUAuf8lL7ljMGpxbH7Q3YyQhfhQptLviS6kBjqHCA'
}
{
  login: 'Thomas',
}

// Response
{
"user": {
  "id": 1,
  "createdAt": "2023-04-28T07:25:35.506Z",
  "updatedAt": "2023-04-28T07:31:56.087Z",
  "login": "Thomas"
},

```

</details>

---

### Get Product from Barcode using OpenFoodFact API

<details>
 <summary><code>GET</code> <code><b>/food/{BARCODE}</b></code> </summary>

##### Request parameters

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | JWT access_token      |  required as Authorization Header with Bearer| JSON   | Used for authentication  |
> | Barcode     |  In URL | string   | Used for the API call to get corresponding product  |


##### Response

> | name      |  type     | data type               | description                                                           |
> |-----------|-----------|-------------------------|-----------------------------------------------------------------------|
> | message?    |  required | string   | Tells whether the call to the API was a Cache Miss or Hit.  |
> | product      |  required | Product Object, JSON   | Product object from OpenFoodFactAPI |

##### Example 

```javascript
// Request
const URL = .../food/3760091725301;
{
  Authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImxvZ2luIjoiaHVnbyIsImlhdCI6MTY4MjY2NzA5NiwiZXhwIjoxNjgyNjY3OTk2fQ.-7WUAuf8lL7ljMGpxbH7Q3YyQhfhQptLviS6kBjqHCA'
}


// Response
{
"message": 'Cache Miss!',
"product": {
    ...
  }
},

```

</details>

---


## Installing the necessary dependencies

```bash
$ npm install
```

## Running the app

```bash
# running the docker container for the postgreSQL database
$ npm run db:dev:up

# making the prisma migrations
$ npm run prisma:dev:deploy

# running the nestJS API in dev mode
$ npm run start:dev

# running in production mode
$ npm run start:prod

# Destroying the container with the db
$ npm run db:dev:rm
```

## Test

```bash
# create the test database
$ npm run db:test:restart

# run the tests
$ npm run test:e2e
```
## Thank you!

Thank you for reading until the end. 

You can reach out to me at hugo.s.biais@gmail.com
