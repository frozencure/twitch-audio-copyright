import { Column, Entity, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Video from '../video/video.entity';
import Label from './label.entity';
import Album from './album.entity';
import Artist from './artist.entity';

@Entity('identified_song')
export default class IdentifiedSong {

  @PrimaryGeneratedColumn() id: number;
  @Column('text') acrId: string;

  @Column('text') title: string;
  @Column('int') playOffsetInSeconds: number;
  @Column('int') durationInSeconds: number;
  @Column('int') identificationScore: number;
  @Column('int') identificationStart: number;
  @Column('int') identificationEnd: number;

  @ManyToOne('Video', 'identifiedSongs')
  video: Video;

  @ManyToOne('Label', 'identifiedSongs')
  label: Label;

  @ManyToOne('Album', 'identifiedSongs')
  album: Album;

  @ManyToMany('Artist', 'identifiedSongs')
  artists: Artist[];

}
