import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { PaginatedDto, ResponsePaginatedDto } from "./content";

export const ApiPaginatedResponse = <TModel extends Type<any>>(
  model: TModel,
  description?: string
) => {
  return applyDecorators(
    ApiExtraModels(ResponsePaginatedDto, PaginatedDto, model),
    ApiOkResponse({
      schema: {
        title: description,
        allOf: [
          { $ref: getSchemaPath(ResponsePaginatedDto) },
          {
            properties: {
              statusCode: { type: "number", default: "0" },
              message: { type: "string", default: "success" },
              data: {
                allOf: [
                  { $ref: getSchemaPath(PaginatedDto) },
                  {
                    properties: {
                      results: {
                        type: "array",
                        items: { $ref: getSchemaPath(model) },
                      },
                    },
                  },
                ],
                type: "object",
                items: { $ref: getSchemaPath(PaginatedDto) },
              },
            },
          },
        ],
      },
    })
  );
};