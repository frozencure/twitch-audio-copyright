import { Column, Entity, JoinColumn, OneToMany, OneToOne, PrimaryColumn } from 'typeorm';
import IdentifiedSong from '../identified-song/identified-song.entity';
import LabelMetadata from './label-metadata.entity';

@Entity('label')
export default class Label {

  @PrimaryColumn('text') name: string;
  @Column({ default: true }) isCopyright: boolean;

  @OneToMany('IdentifiedSong', 'label')
  identifiedSongs: IdentifiedSong[];

  @OneToOne(() => LabelMetadata, metadata => metadata.label,
    { cascade: true })
  @JoinColumn()
  metadata: LabelMetadata;
}
