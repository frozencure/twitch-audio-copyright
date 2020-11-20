import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import IdentifiedSong from './identified-song.entity';

@Entity('artist')
export default class Artist {
  @PrimaryGeneratedColumn() id: number;

  @Column('text') name: string;

  @ManyToMany('IdentifiedSong', 'artists')
  identifiedSongs: IdentifiedSong[];

}
