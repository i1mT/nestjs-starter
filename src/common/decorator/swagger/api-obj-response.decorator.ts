import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiOkResponse, getSchemaPath } from "@nestjs/swagger";
import { ResponseObjDto } from "./content";

export const ApiObjResponse = <TModel extends Type<any>>(model: TModel, description: string) => {
  return applyDecorators(
    ApiExtraModels(ResponseObjDto, model),
    ApiOkResponse({
      schema: {
        title: description,
        properties: {
          statusCode: { type: "number", default: "0" },
          message: { type: "string", default: "success" },
          data: {
            $ref: getSchemaPath(model),
          },
        },
      },
    })
  );
};