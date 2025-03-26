import { Provider } from "@nestjs/common";
import { Connection } from "mongoose";
import { ITable, tablesConfig } from "../tables";

function table2providers(tables: ITable[]): Provider[] {
  return tables.map((table) => {
    // 不需要counter
    if (!table.counter_model) {
      return {
        provide: table.provide,
        inject: [table.database_provider],
        useFactory: (connection: Connection) =>
          connection.model(table.name, table.schema),
      };
    }

    return {
      provide: table.provide,
      inject: [table.database_provider, table.counter_model],
      useFactory: counterFactory(table.schema, table.name, table?.counter),
    };
  });
}

export default table2providers(tablesConfig);

export function counterFactory(schema, modelName: string, counterKey?: string) {
  return (connection: Connection, counterModel) => {
    schema.pre("save", async function (next) {
      // 给每条数据添加自增 id
      const doc = this;
      // 如果已经有 id 了，或者没有 counterKey 则不进行计数
      if (doc.id || !counterKey) return next();

      try {
        let counter = await counterModel.findByIdAndUpdate(
          { _id: counterKey },
          { $inc: { seq: 1 } }
        );
        // first
        if (!counter) {
          counter = await counterModel.create({ _id: counterKey });
        }
        doc.id = `${counter.seq}`;

        next();
      } catch (e) {
        return next(e);
      }
    });

    const model = connection.model(modelName, schema);
    return model;
  };
}
