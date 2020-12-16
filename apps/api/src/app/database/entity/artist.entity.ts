import { Entity, JoinTable, ManyToMany, PrimaryColumn } from 'typeorm';
import IdentifiedSongEntity from '../identified-song/identified-song.entity';

@Entity('artist')
export default class ArtistEntity {

  @PrimaryColumn('text') name: string;

  @ManyToMany(() => IdentifiedSongEntity, song => song.artists)
  @JoinTable()
  identifiedSongs: IdentifiedSongEntity[];

}
