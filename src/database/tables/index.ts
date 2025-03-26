import { PROVIDERS } from "@/common/constants";
import { Schema } from "mongoose";
import { userTable } from "./user";
import { counterTable } from "./counter";
// import { counter2Table } from "./counter_2";

export interface ITable {
  provide: PROVIDERS;
  database_provider: string; // 使用哪个 数据库链接
  counter_model?: string; // 使用哪个 counter 表，若为空就不count
  name: string; // 表名
  counter?: string; // counter 的键
  schema: Schema; // 表定义
}

export const tablesConfig: ITable[] = [
  counterTable,
  // counter2Table,
  userTable,
];
