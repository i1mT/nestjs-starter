import { applyDecorators, Type } from "@nestjs/common";
import { ApiExtraModels, ApiProperty, getSchemaPath } from "@nestjs/swagger";

export const PaginatedResponse = <TModel extends Type<any>>(model: TModel) =>
  applyDecorators(
    ApiExtraModels(model),
    ApiProperty({
      type: "object",
      properties: {
        data: {
          type: "array",
          items: { $ref: getSchemaPath(model) },
          required: true,
        },
        total: {
          type: "number",
          required: true,
        },
        has_more: {
          type: "boolean",
          required: true,
        },
      },
    })
  );