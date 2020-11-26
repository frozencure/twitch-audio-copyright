import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Video from '../video/video.entity';
import Label from '../entity/label.entity';
import Album from '../entity/album.entity';
import Artist from '../entity/artist.entity';
import Clip from '../clip/clip.entity';

@Entity('identified_song')
export default class IdentifiedSong extends BaseEntity {

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

  @ManyToOne('Clip', 'identifiedSongs')
  clip: Clip;

  @ManyToOne('Label', 'identifiedSongs', {
    cascade: true
  })
  label: Label;

  @ManyToOne('Album', 'identifiedSongs', {
    cascade: true
  })
  album: Album;

  @ManyToMany('Artist', 'identifiedSongs', {
    cascade: true
  })
  @JoinTable()
  artists: Artist[];

}
