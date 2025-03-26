import { mongo } from 'mongoose';

export function getObjectId(_id: string): mongo.BSON.ObjectId {
  return mongo.BSON.ObjectId.createFromHexString(_id as string);
}
