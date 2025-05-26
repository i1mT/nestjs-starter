import { mongo } from "mongoose";
import { ApiProperty } from "@nestjs/swagger";

export class ResponseDto {
  @ApiProperty({ description: "状态码" })
  statusCode: number;

  @ApiProperty({ description: "消息" })
  message: string;

  @ApiProperty({ description: "结果" })
  data: any;
}

export class ResponseObjDto<TData> extends ResponseDto {
  @ApiProperty()
  data: TData;
}

export class ResponseListDto<TData> extends ResponseDto {
  @ApiProperty()
  data: TData[];
}

export class PaginatedDto<TData> {
  @ApiProperty()
  total: number;

  @ApiProperty()
  page_size: number;

  @ApiProperty()
  current: number;

  @ApiProperty()
  results: TData[];
}

export class ResponsePaginatedDto<TData> extends ResponseDto {
  @ApiProperty()
  data: PaginatedDto<TData>;
}


export class BaseModel {
  @ApiProperty({ description: "id" })
  _id: mongo.ObjectId;
  @ApiProperty({ description: "创建时间" })
  createdAt: Date;
  @ApiProperty({ description: "更新时间" })
  updatedAt: Date;
}
