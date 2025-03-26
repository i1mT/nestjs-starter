import { Schema } from "mongoose";
import { ITable } from ".";
import { PROVIDERS } from "@/common/constants";

export const CounterSchema = new Schema({
  _id: { type: String, required: true },
  seq: { type: Number, default: 10000 },
});

export const counter2Table: ITable = {
  provide: PROVIDERS.DB2_COUNTER_MODEL,
  database_provider: PROVIDERS.DATABASE_CONNECTION_2,
  schema: CounterSchema,
  name: "Counter",
};
