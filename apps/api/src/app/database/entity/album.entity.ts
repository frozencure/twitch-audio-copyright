import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import IdentifiedSong from '../identified-song/identified-song.entity';

@Entity('album')
export default class Album {

  @PrimaryColumn('text') name: string;

  @OneToMany('IdentifiedSong', 'album')
  identifiedSongs: IdentifiedSong[];
}
