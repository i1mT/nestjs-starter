import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ResponseListDto } from "./content";

export const ApiListResponse = <TModel extends Type<any>>(model: TModel, description?: string) => {
  return applyDecorators(
    ApiExtraModels(ResponseListDto, model),
    ApiOkResponse({
      schema: {
        title: description,
        allOf: [
          { $ref: getSchemaPath(ResponseListDto) },
          {
            properties: {
              statusCode: { type: "number", default: "0" },
              message: { type: "string", default: "success" },
              data: {
                type: "array",
                items: { $ref: getSchemaPath(model) },
              },
            },
          },
        ],
      },
    })
  );
};