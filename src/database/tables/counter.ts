import { Connection, Schema } from "mongoose";
import { ITable } from ".";
import { PROVIDERS } from "@/common/constants";

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
