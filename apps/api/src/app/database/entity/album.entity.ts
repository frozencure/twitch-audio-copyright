import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import IdentifiedSong from './identified-song.entity';


@Entity('album')
export default class Album {
  @PrimaryGeneratedColumn() id: number;

  @Column('text') name: string;

  @OneToMany('IdentifiedSong', 'album')
  identifiedSongs: IdentifiedSong[];

}
