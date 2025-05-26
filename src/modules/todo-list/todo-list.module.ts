import { Module } from "@nestjs/common";

import { TodoListService } from "./todo-list.service";
import { TodoListController } from "./todo-list.controller";

/**
 * 待办事项模块，分页示例
 */

@Module({
  imports: [],
  controllers: [TodoListController],
  providers: [TodoListService],
})
export class TodoListModule {}
