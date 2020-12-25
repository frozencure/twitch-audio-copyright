import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';
import LabelMetadataEntity from './label-metadata.entity';
import { Label } from '@twitch-audio-copyright/data';

@Entity('label')
export default class LabelEntity {

  @PrimaryColumn('text') name: string;
  @Column({ default: true }) isCopyright: boolean;

  @OneToMany(() => IdentifiedSongEntity, song => song.label)
  identifiedSongs: IdentifiedSongEntity[];

  @OneToOne(() => LabelMetadataEntity, metadata => metadata.label,
    { cascade: true })
  @JoinColumn()
  metadata: LabelMetadataEntity;

  toLabelDto(): Label {
    const labelDto = new Label();
    labelDto.name = this.name;
    if(this.metadata) {
      labelDto.name = this.metadata.name;
      labelDto.beginYear = this.metadata.beginYear;
      labelDto.country = this.metadata.country;
      labelDto.musicBrainzId = this.metadata.musicBrainzId;
      labelDto.wikipediaUrl = this.metadata.wikipediaUrl;
    }
    return labelDto;
  }
}
