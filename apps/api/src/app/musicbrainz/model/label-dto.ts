import { UrlInfoDto } from './url-dto';
import { LabelLifeSpanDto } from './label-life-span-dto';

export interface LabelDto {
  id: string;
  'sort-name': string;
  name: string;
  score: number;
  disambiguation: string;
  'label-code': number;
  'type-id': string;
  type: string;
  relations?: UrlInfoDto[];
  country?: string;
  'life-span': LabelLifeSpanDto;
}
