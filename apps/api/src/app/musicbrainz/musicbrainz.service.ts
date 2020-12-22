import { HttpService, Injectable, Logger } from '@nestjs/common';
import { LabelDto } from './model/label-dto';
import { WikiDataDto } from './model/wiki-data-dto';
import { LabelMetadataModel } from './model/label-metadata-model';
import { LabelNotFoundError, WikiDataNotFoundError } from './errors';
import { LabelSearchWrapper } from './model/label-search-wrapper';

@Injectable()
export class MusicbrainzService {

  private static readonly BaseUrl = 'http://musicbrainz.org/ws/2';

  constructor(private readonly httpService: HttpService) {
  }

  public async getLabelMetadata(labelName: string, scoreThreshold = 75): Promise<LabelMetadataModel> {
    const labelMetadata = new LabelMetadataModel();
    const labelDto = await this.searchLabels(labelName, scoreThreshold);
    if (!labelDto) throw new LabelNotFoundError(`No label was found for query ${labelName}`);
    const labelWithUrlsDto = await this.getLabelWithUrls(labelDto.id);
    labelMetadata.name = labelWithUrlsDto.name;
    labelMetadata.country = labelWithUrlsDto.country;
    labelMetadata.musicBrainzId = labelWithUrlsDto.id;
    labelMetadata.beginYear = labelWithUrlsDto['life-span'].begin;
    try {
      const wikipediaUrl = await this.getWikipediaUrl(labelWithUrlsDto);
      labelMetadata.wikipediaUrl = wikipediaUrl.sitelinks.enwiki.url;
    } catch (e) {
      Logger.log(`Wiki label could not be found for ${labelName}`);
    }
    return labelMetadata;
  }

  private static headers(): unknown {
    const version = process.env.npm_package_version;
    const name = process.env.npm_package_name;
    const host = process.env.NODE_ENV;
    return {
      'User-Agent': `${name}/${version} (${host})`,
      'Accept': `application/json`
    };
  }

  private async searchLabels(labelName: string, scoreThreshold: number): Promise<LabelDto> {
    try {
      const response = await this.httpService
        .get(`${MusicbrainzService.BaseUrl}/label?query=${labelName}&top=1`, {
          headers: MusicbrainzService.headers()
        }).toPromise();
      const result = response.data as LabelSearchWrapper;
      return result.labels.filter(label => label.score >= scoreThreshold)
        .reduce((prev, current) => {
          return (current.score > prev.score) ? current : prev;
        });
    } catch (e) {
      throw new LabelNotFoundError(`No label could be found for query ${labelName}. Reason: ${e}`);
    }
  }

  private async getLabelWithUrls(labelId: string): Promise<LabelDto> {
    try {
      const response = await this.httpService
        .get(`${MusicbrainzService.BaseUrl}/label/${labelId}?inc=url-rels`,
          {
            headers: MusicbrainzService.headers()
          }).toPromise();
      return response.data as LabelDto;
    } catch (e) {
      throw new LabelNotFoundError(`No label could be found with ID ${labelId}. Reason: ${e}`);
    }
  }

  private async getWikipediaUrl(labelDto: LabelDto): Promise<WikiDataDto> {
    try {
      const urlInfoDto = labelDto.relations.find(url => url.type === 'wikidata' &&
        url['target-type'] === 'url');
      const wikiDataUrl = urlInfoDto.url.resource
        .replace('/wiki/', '/entity/');
      const wikiEntityId = wikiDataUrl.substring(wikiDataUrl.lastIndexOf('/') + 1);
      const response = await this.httpService
        .get(wikiDataUrl, {
          headers: { 'Accept': 'application/json' }
        }).toPromise();
      return response.data['entities'][wikiEntityId] as WikiDataDto;
    } catch (e) {
      throw new WikiDataNotFoundError(`No wiki data could be found for label ${labelDto.id}. Reason: ${e}`);
    }
  }
}
