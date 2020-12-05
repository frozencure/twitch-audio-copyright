export interface WikiDataDto {
  sitelinks: WikiLinksWrapper;
  title: string;
  type: string;
  id: string;
}

export interface WikiLinksWrapper {
  enwiki: WikiLinkDto
}

export interface WikiLinkDto {
  site: string;
  title: string;
  badges: unknown[];
  url: string;
}
