import { Connection, Schema } from "mongoose";
import { ITable } from ".";
import { PROVIDERS } from "@/common/constants";

/**
 * counter 表是用于给其他表生成自增 id 的表，记录 表的 id 自增到多少了
 */
export const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 10000 },
});

export const counterTable: ITable = {
  provide: PROVIDERS.COUNTER_MODEL,
  database_provider: PROVIDERS.DATABASE_CONNECTION,
  schema: CounterSchema,
  name: "Counter",
};
