import { ArgumentsHost, ExecutionContext } from "@nestjs/common";
import { GqlExecutionContext } from "@nestjs/graphql";
import { PriviledgedRequest } from "../@types/request";

export enum ExecutionContextType {
  GQL,
  HTTP,
}

/**
 * Get Execution Context type
 * @see https://github.com/nestjs/nest/issues/1581
 */
export const getType = (context: ArgumentsHost): ExecutionContextType =>
  context.getArgs().length === 4
    ? ExecutionContextType.GQL
    : ExecutionContextType.HTTP;

/**
 * Get HTTP request object from Execution Context
 */
export const getRequest = (context: ExecutionContext): PriviledgedRequest =>
  getType(context) === ExecutionContextType.GQL
    ? GqlExecutionContext.create(context).getContext().req // `req` object put here by Apollo server
    : context.switchToHttp().getRequest();
