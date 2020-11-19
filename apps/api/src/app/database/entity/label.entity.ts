import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import IdentifiedSong from './identified-song.entity';


@Entity('label')
export default class Label {
  @PrimaryGeneratedColumn() id: number;

  @Column('text') name: string;
  @Column({ default: true }) isCopyright: boolean;

  @OneToMany(() => IdentifiedSong, song => song.label)
  identifiedSongs: IdentifiedSong[];

}
