import { Entity, OneToMany, PrimaryColumn } from 'typeorm';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';

@Entity('album')
export default class AlbumEntity {

  @PrimaryColumn('text') name: string;

  @OneToMany(() => IdentifiedSongEntity, song => song.album)
  identifiedSongs: IdentifiedSongEntity[];
}
