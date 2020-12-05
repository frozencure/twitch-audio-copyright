import { Column, Entity, OneToOne, PrimaryColumn } from 'typeorm';
import Label from './label.entity';
import { LabelMetadataModel } from '../../musicbrainz/model/label-metadata-model';

@Entity('label-metadata')
export default class LabelMetadata {

  @PrimaryColumn('text') musicBrainzId: string;
  @Column('text') name: string;
  @Column({ type: 'text', nullable: true }) country: string;
  @Column({ type: 'text', nullable: true }) beginYear: string;
  @Column({ type: 'text', nullable: true }) wikipediaUrl?: string;

  @OneToOne(() => Label, label => label.metadata)
  label: Label;

  static FromLabelMetadataModel(model: LabelMetadataModel): LabelMetadata {
    const labelMetadata = new LabelMetadata();
    labelMetadata.musicBrainzId = model.musicBrainzId;
    labelMetadata.name = model.name;
    labelMetadata.beginYear = model.beginYear;
    labelMetadata.country = model.country;
    labelMetadata.wikipediaUrl = model.wikipediaUrl;
    return labelMetadata;
  }
}
