import * as common from "@nestjs/common";
import * as graphql from "@nestjs/graphql";
import * as nestAccessControl from "nest-access-control";
import * as gqlACGuard from "../../auth/gqlAC.guard";
import { GqlDefaultAuthGuard } from "../../auth/gqlDefaultAuth.guard";
import { AclValidateRequestInterceptor } from "../../interceptors/aclValidateRequest.interceptor";
import { SaleService } from "../sale.service";
import { CreateSaleArgs } from "./CreateSaleArgs";
import { Sale } from "./Sale";

@graphql.Resolver(() => Sale)
@common.UseGuards(GqlDefaultAuthGuard, gqlACGuard.GqlACGuard)
export class SaleResolverBase {
  constructor(
    protected readonly service: SaleService,
    protected readonly rolesBuilder: nestAccessControl.RolesBuilder
  ) {}

  @common.UseInterceptors(AclValidateRequestInterceptor)
  @graphql.Mutation(() => Sale)
  @nestAccessControl.UseRoles({
    resource: "Sale",
    action: "create",
    possession: "any"
  })
  async createOrder(@graphql.Args() args: CreateSaleArgs): Promise<Sale> {
    return await this.service.create({
      ...args,
      data: {
        ...args.data,
        customer: args.data.customer
          ? {
              connect: args.data.customer
            }
          : undefined,
        orders: args.data.orders
      }
    });
  }
}
