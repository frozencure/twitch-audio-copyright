import { Column, Entity, OneToMany, PrimaryColumn } from 'typeorm';
import IdentifiedSong from '../identified-song/identified-song.entity';


@Entity('label')
export default class Label {

  @PrimaryColumn('text') name: string;
  @Column({ default: true }) isCopyright: boolean;

  @OneToMany('IdentifiedSong', 'label')
  identifiedSongs: IdentifiedSong[];

}
