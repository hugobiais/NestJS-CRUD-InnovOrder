import { INestApplication, ValidationPipe } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import * as pactum from 'pactum';
import { AppModule } from '../src/app.module';
import { AuthDto } from '../src/auth/dto';
import { PrismaService } from '../src/prisma/prisma.service';
import { EditUserDto } from '../src/user/dto';

describe('App e2e', () => {
  let app: INestApplication;
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
      }),
    );
    await app.init();
    await app.listen(3000);

    prisma = app.get(PrismaService);
    await prisma.cleanDb();
    await prisma.cleanCache();
    pactum.request.setBaseUrl('http://localhost:3000');
  });

  afterAll(() => {
    app.close();
  });

  describe('Auth', () => {
    const dto: AuthDto = {
      login: 'hugo',
      password: '123',
    };
    describe('Signup', () => {
      it('should throw if login empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody({
            login: dto.login,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signup').expectStatus(400);
      });
      it('should signup', () => {
        return pactum
          .spec()
          .post('/auth/signup')
          .withBody(dto)
          .expectStatus(201);
      });
    });

    describe('Signin', () => {
      it('should throw if login empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            password: dto.password,
          })
          .expectStatus(400);
      });
      it('should throw if password empty', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody({
            login: dto.login,
          })
          .expectStatus(400);
      });
      it('should throw if no body provided', () => {
        return pactum.spec().post('/auth/signin').expectStatus(400);
      });
      it('should signin', () => {
        return pactum
          .spec()
          .post('/auth/signin')
          .withBody(dto)
          .expectStatus(200)
          .stores('userAt', 'access_token');
      });
    });
  });

  describe('User', () => {
    describe('Get me', () => {
      it('should get current user', () => {
        return pactum
          .spec()
          .get('/users/me')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .expectStatus(200);
      });
    });

    describe('Get me (without access_token)', () => {
      it('should NOT get current user', () => {
        return pactum.spec().get('/users/me').expectStatus(401);
      });
    });

    describe('Edit user', () => {
      it('should edit user login', () => {
        const dto: EditUserDto = {
          login: 'John',
        };
        return pactum
          .spec()
          .patch('/users')
          .withHeaders({
            Authorization: 'Bearer $S{userAt}',
          })
          .withBody(dto)
          .expectStatus(200)
          .expectBodyContains(dto.login);
      });
    });
  });

  describe('Edit user', () => {
    it('should edit user password', () => {
      const dto: EditUserDto = {
        password: 'Test123',
      };
      return pactum
        .spec()
        .patch('/users')
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .withBody(dto)
        .expectStatus(200)
        .expectBodyContains('Password successfully changed');
    });
  });
});

describe('OpenFoodFact API', () => {
  describe('Access the route without access_token', () => {
    it('should NOT return the product associated with the barcode', () => {
      const barcode = '3760091725301';
      return pactum.spec().get(`/food/${barcode}`).expectStatus(401);
    });
  });

  describe('Send invalid barcode', () => {
    it('should return a 404 Product not found', () => {
      const barcode = '99874623';
      return pactum.spec().get(`/food/${barcode}`).expectStatus(404);
    });
  });

  describe('Fetch product X for the first time', () => {
    it('should return the product associated with the barcode and not be in the cache', () => {
      const barcode = '3760091725301';
      return pactum
        .spec()
        .get(`/food/${barcode}`)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('Cache Miss!');
    });
  });

  describe('Fetch product X for the second time', () => {
    it('should return the product associated from the cache', () => {
      const barcode = '3760091725301';
      return pactum
        .spec()
        .get(`/food/${barcode}`)
        .withHeaders({
          Authorization: 'Bearer $S{userAt}',
        })
        .expectStatus(200)
        .expectBodyContains('Cache Hit!');
    });
  });
});
