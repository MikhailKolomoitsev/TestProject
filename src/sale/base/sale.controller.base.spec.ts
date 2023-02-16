import { Test } from "@nestjs/testing";
import {
  INestApplication,
  HttpStatus,
  ExecutionContext,
  CallHandler
} from "@nestjs/common";
import request from "supertest";
import { MorganModule } from "nest-morgan";
import { ACGuard } from "nest-access-control";
import { DefaultAuthGuard } from "../../auth/defaultAuth.guard";
import { ACLModule } from "../../auth/acl.module";
import { AclFilterResponseInterceptor } from "../../interceptors/aclFilterResponse.interceptor";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { map } from "rxjs";
import { SaleController } from "../sale.controller";
import { SaleService } from "../sale.service";

const CREATE_INPUT = {
  createdAt: new Date(),
  orders: ["exampleId1"],
  id: "exampleId",
  totalPrice: 42,
  updatedAt: new Date()
};
const CREATE_RESULT = {
  createdAt: new Date(),
  orders: ["exampleId1"],
  id: "exampleId",
  totalPrice: 42,
  updatedAt: new Date()
};

const service = {
  create() {
    return CREATE_RESULT;
  }
};

const basicAuthGuard = {
  canActivate: (context: ExecutionContext) => {
    const argumentHost = context.switchToHttp();
    const request = argumentHost.getRequest();
    request.user = {
      roles: ["user"]
    };
    return true;
  }
};

const acGuard = {
  canActivate: () => {
    return true;
  }
};

const aclFilterResponseInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle().pipe(
      map((data) => {
        return data;
      })
    );
  }
};
const aclValidateRequestInterceptor = {
  intercept: (context: ExecutionContext, next: CallHandler) => {
    return next.handle();
  }
};

describe("Order", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [
        {
          provide: SaleService,
          useValue: service
        }
      ],
      controllers: [SaleController],
      imports: [MorganModule.forRoot(), ACLModule]
    })
      .overrideGuard(DefaultAuthGuard)
      .useValue(basicAuthGuard)
      .overrideGuard(ACGuard)
      .useValue(acGuard)
      .overrideInterceptor(AclFilterResponseInterceptor)
      .useValue(aclFilterResponseInterceptor)
      .overrideInterceptor(AclValidateRequestInterceptor)
      .useValue(aclValidateRequestInterceptor)
      .compile();

    app = moduleRef.createNestApplication();
    await app.init();
  });

  test("POST /sales", async () => {
    await request(app.getHttpServer())
      .post("/sale")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString()
      });
  });

  test("POST /sales existing resource", async () => {
    let agent = request(app.getHttpServer());
    await agent
      .post("/sale")
      .send(CREATE_INPUT)
      .expect(HttpStatus.CREATED)
      .expect({
        ...CREATE_RESULT,
        createdAt: CREATE_RESULT.createdAt.toISOString(),
        updatedAt: CREATE_RESULT.updatedAt.toISOString()
      })
      .then(function () {
        agent
          .post("/sale")
          .send(CREATE_INPUT)
          .expect(HttpStatus.CONFLICT)
          .expect({
            statusCode: HttpStatus.CONFLICT
          });
      });
  });

  afterAll(async () => {
    await app.close();
  });
});
