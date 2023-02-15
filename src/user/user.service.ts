import { Injectable } from "@nestjs/common";
import { PrismaService } from "../prisma/prisma.service";
import { UserServiceBase } from "./base/user.service.base";
import { PasswordService } from "../auth/password.service";
import { UserCreateInput } from "./base/UserCreateInput";
import { Prisma } from "@prisma/client";

@Injectable()
export class UserService extends UserServiceBase {
  constructor(
    protected readonly prisma: PrismaService,
    protected readonly passwordService: PasswordService
  ) {
    super(prisma, passwordService);
  }

  async create(dto: Prisma.UserCreateArgs){
    const hashedPass= await this.passwordService.hash(dto.data.password)
    return  this.prisma.user.create({
      data: {
        ...dto.data,
        password:hashedPass
      }
    })
  }
}
