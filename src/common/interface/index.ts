export interface PageParams {
  current?: number;
  pageSize?: number;
}

export interface PaginationRequest<T> {
  current?: number;
  pageSize?: number;
  filter: T;
}
export enum FileType {
  image = "image",
}
