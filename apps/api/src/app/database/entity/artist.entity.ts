import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import IdentifiedSong from '../identified-song/identified-song.entity';

@Entity('artist')
export default class Artist {

  @PrimaryColumn('text') name: string;

  @ManyToMany('IdentifiedSong', 'artists')
  @JoinTable()
  identifiedSongs: IdentifiedSong[];

}
