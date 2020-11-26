import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import Video from '../video/video.entity';
import Label from '../entity/label.entity';
import Album from '../entity/album.entity';
import Artist from '../entity/artist.entity';
import { IdentifiedAudioRecording } from '../../acr_cloud/model/identified-audio-recording';

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

  static FromAcrResponse(identifiedAudioRecording: IdentifiedAudioRecording, identificationStart: number,
              identificationEnd: number, video: Video): IdentifiedSong {
    const identifiedSong = new IdentifiedSong();
    identifiedSong.video = video;
    identifiedSong.acrId = identifiedAudioRecording.acrid;
    identifiedSong.title = identifiedAudioRecording.title;
    identifiedSong.playOffsetInSeconds = Math.round(identifiedAudioRecording.play_offset_ms / 1000);
    identifiedSong.durationInSeconds = Math.round(identifiedAudioRecording.duration_ms / 1000);
    identifiedSong.identificationScore = Math.round(identifiedAudioRecording.score);
    identifiedSong.identificationStart = identificationStart;
    identifiedSong.identificationEnd = identificationEnd;

    identifiedSong.setLabel(identifiedAudioRecording);
    identifiedSong.setAlbum(identifiedAudioRecording);
    identifiedSong.setArtists(identifiedAudioRecording);
    return identifiedSong;
  }

  private setAlbum(identifiedAudioRecording: IdentifiedAudioRecording): void {
    const album = new Album();
    album.name = identifiedAudioRecording.album.name;
    this.album = album;
  }

  private setLabel(identifiedAudioRecording: IdentifiedAudioRecording): void {
    const label = new Label();
    label.name = identifiedAudioRecording.label;
    this.label = label;
  }

  private setArtists(identifiedAudioRecording: IdentifiedAudioRecording): void {
    this.artists = identifiedAudioRecording.artists.map(artistDto => {
      const artist = new Artist();
      artist.name = artistDto.name;
      return artist;
    });
  }


}
