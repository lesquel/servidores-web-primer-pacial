import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { ValidatedUser } from "../strategies/jwt.strategy";

/**
 * Decorator para extraer el usuario validado del request.
 * Uso: @CurrentUser() user: ValidatedUser
 */
export const CurrentUser = createParamDecorator(
  (data: keyof ValidatedUser | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    const user = request.user as ValidatedUser;

    return data ? user?.[data] : user;
  }
);
