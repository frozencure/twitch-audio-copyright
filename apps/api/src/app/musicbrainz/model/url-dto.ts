export interface UrlInfoDto {
  url: UrlDto,
  'source-credit': string;
  type: string;
  ended: false;
  'target-type': string;
  'target-credit': string,
  direction: string,
  'type-id': string,
  attributes: unknown[],
  'attribute-ids': unknown,
  'attribute-values': unknown
}

export interface UrlDto {
  id: string,
  resource: string
}


