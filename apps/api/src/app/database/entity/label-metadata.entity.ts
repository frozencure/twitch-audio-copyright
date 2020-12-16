import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import LabelEntity from './label.entity';
import { LabelMetadataModel } from '../../musicbrainz/model/label-metadata-model';

@Entity('label-metadata')
export default class LabelMetadataEntity {

  @PrimaryColumn('text') musicBrainzId: string;
  @Column('text') name: string;
  @Column({ type: 'text', nullable: true }) country: string;
  @Column({ type: 'text', nullable: true }) beginYear: string;
  @Column({ type: 'text', nullable: true }) wikipediaUrl?: string;

  @OneToOne(() => LabelEntity, label => label.metadata)
  label: LabelEntity;

  static FromLabelMetadataModel(model: LabelMetadataModel): LabelMetadataEntity {
    const labelMetadata = new LabelMetadataEntity();
    labelMetadata.musicBrainzId = model.musicBrainzId;
    labelMetadata.name = model.name;
    labelMetadata.beginYear = model.beginYear;
    labelMetadata.country = model.country;
    labelMetadata.wikipediaUrl = model.wikipediaUrl;
    return labelMetadata;
  }
}
