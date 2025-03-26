import { Document } from 'mongoose';

export interface UserModel extends Document {
  readonly id: string;
  readonly nickname: string;
  readonly username: string;
  readonly password: string;
}

export type User = Pick<
  UserModel,
  '_id' | 'id' | 'nickname' | 'username' | 'password'
>;
