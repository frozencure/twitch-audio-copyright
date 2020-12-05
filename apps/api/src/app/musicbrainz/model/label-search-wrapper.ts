import { LabelDto } from './label-dto';

export interface LabelSearchWrapper {
  created: Date;
  count: number;
  offset: number;
  labels: LabelDto[]
}
