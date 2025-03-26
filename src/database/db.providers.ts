import * as mongoose from "mongoose";
import * as timestampMongoose from "mongoose-timestamp";

import { PROVIDERS } from "@/common/constants";
import { config } from "@/config";

// 时区设置
// mongoose.plugin((schema, opt) => {
//   schema.plugin(timestampMongoose, {
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//     timezone: 'Asia/shanghai',
//   });
// });

export const databaseProviders = [
  {
    // 主数据库
    provide: PROVIDERS.DATABASE_CONNECTION,
    useFactory: (): mongoose.Connection =>
      mongoose.createConnection(
        `mongodb://${config.get("mongo.host")}:${config.get("mongo.port")}`,
        {
          user: config.get("mongo.user"),
          pass: encodeURIComponent(config.get("mongo.password")),
          dbName: config.get("mongo.database"),
          authSource: config.get("mongo.authsource"),
          autoCreate: true,
        }
      ),
  },
  // {
  //   // 副数据库
  //   provide: PROVIDERS.DATABASE_CONNECTION_2,
  //   useFactory: (): mongoose.Connection =>
  //     mongoose.createConnection(
  //       `mongodb://${config.get("mongo2.host")}:${config.get("mongo2.port")}`,
  //       {
  //         user: config.get("mongo2.user"),
  //         pass: encodeURIComponent(config.get("mongo2.password")),
  //         dbName: config.get("mongo2.database"),
  //         authSource: config.get("mongo2.authsource"),
  //         autoCreate: true,
  //       }
  //     ),
  // },
];
