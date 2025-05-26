import { Injectable } from "@nestjs/common";
import mongoose from "mongoose";
import { faker } from "@faker-js/faker";
import { TodoListModel } from "./interface";
import { PaginatedDto } from "@/common/decorator/swagger/content";

@Injectable()
export class TodoListService {
  constructor() {}

  private genList(num: number) {
    const genItem = () => {
      return {
        _id: new mongoose.Types.ObjectId().toString(),
        title: faker.lorem.sentence(),
        done: faker.datatype.boolean(),
      };
    };

    return Array.from({ length: num }, genItem);
  }

  async getList() {
    return Promise.resolve(this.genList(10));
  }

  async getListByPage(page: number, pageSize: number): Promise<PaginatedDto<TodoListModel>> {
    const list = this.genList(10);

    return {
      total: faker.number.int({ min: 10, max: 500 }),
      page_size: pageSize,
      current: page,
      results: list,
    };
  }

  async getListById(id: string): Promise<TodoListModel> {
    const list = this.genList(1);

    return list[0];
  }
}
