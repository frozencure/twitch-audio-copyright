import {Pagination} from './Pagination';

export interface HelixWrapper<T> {
  data: Array<T>;
  pagination?: Pagination;
  total?: number;
}
