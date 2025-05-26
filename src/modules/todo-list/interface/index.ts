import { ApiProperty } from "@nestjs/swagger";


export class TodoListModel {
  @ApiProperty({ description: "标题" })
  title: string;

  @ApiProperty({ description: "是否完成" })
  done: boolean;
}