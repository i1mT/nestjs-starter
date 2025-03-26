import { currentTime } from "@/common/libs/date";
import { Schema } from "mongoose";
import { ITable } from ".";
import { PROVIDERS } from "@/common/constants";

const UserSchema = new Schema(
  {
    id: String,
    username: String,
    password: String,
  },
  {
    timestamps: {
      currentTime,
    },
  }
);

/**
 * 用户表
 */

export const userTable: ITable = {
  provide: PROVIDERS.USER_MODEL, // 用户模型
  database_provider: PROVIDERS.DATABASE_CONNECTION, // 使用哪个数据库链接
  counter_model: PROVIDERS.COUNTER_MODEL,
  counter: "userIdCounter",
  schema: UserSchema,
  name: "User",
};
