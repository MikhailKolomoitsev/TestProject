import * as common from "@nestjs/common";
import * as swagger from "@nestjs/swagger";
import * as nestAccessControl from "nest-access-control";
import { UserService } from "./user.service";
import { Body, Controller, Post } from "@nestjs/common";
import { UserCreateInput } from "./base/UserCreateInput";
import { Prisma } from "@prisma/client";

@swagger.ApiTags("users")
@Controller("users")
export class UserController {
  constructor(
    protected readonly service: UserService,
    @nestAccessControl.InjectRolesBuilder()
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @Post("")
  createUser(@Body() dto: Prisma.UserCreateArgs) {
    console.log('Post')
    return this.service.create(dto);
  }
}
