import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';
import LabelMetadataEntity from './label-metadata.entity';

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
}
