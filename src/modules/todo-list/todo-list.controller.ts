import { Controller, Get, Param, Query } from "@nestjs/common";
import { TodoListService } from "./todo-list.service";
import { ApiListResponse } from "@/common/decorator/swagger/api-list-response.decorator";
import { TodoListModel } from "./interface";
import { ApiPaginatedResponse } from "@/common/decorator/swagger/api-paginated-response.decorator";
import { ApiObjResponse } from "@/common/decorator/swagger/api-obj-response.decorator";
import { PublicRoute } from "@/common/decorator/setMetadata";
import { ApiTags } from "@nestjs/swagger";


@ApiTags("待办事项")
@Controller("todo-list")
export class TodoListController {
  constructor(private readonly todoListService: TodoListService) {}

  // 返回列表
  @PublicRoute()
  @Get('list')
  @ApiListResponse(TodoListModel, "返回列表")
  async getList() {
    return this.todoListService.getList();
  }

  // 分页返回列表
  @PublicRoute()
  @Get('list-by-page')
  @ApiPaginatedResponse(TodoListModel, "分页返回列表")
  async getListByPage(@Query('page') page: number, @Query('pageSize') pageSize: number) {
    return this.todoListService.getListByPage(page, pageSize);
  }

  // 返回单个
  @PublicRoute()
  @Get(':id')
  @ApiObjResponse(TodoListModel, "返回单个")
  async getListById(@Param('id') id: string) {
    return this.todoListService.getListById(id);
  }
}
