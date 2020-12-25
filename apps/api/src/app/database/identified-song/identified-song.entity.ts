import { BaseEntity, Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import VideoEntity from '../video/video.entity';
import LabelEntity from '../entity/label.entity';
import AlbumEntity from '../entity/album.entity';
import ArtistEntity from '../entity/artist.entity';
import ClipEntity from '../clip/clip.entity';
import { IdentifiedAudioRecording } from '../../acr_cloud/model/identified-audio-recording';
import { IdentifiedSong } from '@twitch-audio-copyright/data';

@Entity('identified_song')
export default class IdentifiedSongEntity extends BaseEntity {

  @PrimaryGeneratedColumn() id: number;
  @Column('text') acrId: string;

  @Column('text') title: string;
  @Column('int') playOffsetInSeconds: number;
  @Column('int') totalSongDurationInSeconds: number;
  @Column('int') identificationScore: number;
  @Column('int') identificationStart: number;
  @Column('int') identificationEnd: number;
  @Column({ type: 'text', nullable: true }) isrcId: string;

  @ManyToOne(() => VideoEntity, video => video.identifiedSongs)
  video: VideoEntity;

  @ManyToOne(() => ClipEntity, clip => clip.identifiedSongs)
  clip: ClipEntity;

  @ManyToOne(() => LabelEntity, label => label.identifiedSongs, {
    cascade: true
  })
  label: LabelEntity;

  @ManyToOne(() => AlbumEntity, album => album.identifiedSongs, {
    cascade: true
  })
  album: AlbumEntity;

  @ManyToMany(() => ArtistEntity, artist => artist.identifiedSongs, {
    cascade: true
  })
  @JoinTable()
  artists: ArtistEntity[];

  static FromAcrResponse(identifiedAudioRecording: IdentifiedAudioRecording, identificationStart: number,
                         identificationEnd: number, video?: VideoEntity, clip?: ClipEntity): IdentifiedSongEntity {
    const identifiedSong = new IdentifiedSongEntity();
    identifiedSong.video = video;
    identifiedSong.acrId = identifiedAudioRecording.acrid;
    identifiedSong.title = identifiedAudioRecording.title;
    identifiedSong.playOffsetInSeconds = Math.round(identifiedAudioRecording.play_offset_ms / 1000);
    identifiedSong.totalSongDurationInSeconds = Math.round(identifiedAudioRecording.duration_ms / 1000);
    identifiedSong.identificationScore = Math.round(identifiedAudioRecording.score);
    identifiedSong.identificationStart = identificationStart;
    identifiedSong.identificationEnd = identificationEnd;
    identifiedSong.clip = clip;
    identifiedSong.isrcId = identifiedAudioRecording.external_ids.isrc;

    identifiedSong.setLabel(identifiedAudioRecording);
    identifiedSong.setAlbum(identifiedAudioRecording);
    identifiedSong.setArtists(identifiedAudioRecording);
    return identifiedSong;
  }

  toIdentifiedSongDto(): IdentifiedSong {
    const artists = this.artists.map(a => a.name);
    const label = this.label.toLabelDto();
    const album = this.album.name;
    return Object.assign(new IdentifiedSong(), this, { artists: artists, label: label, album: album });
  }

  private setAlbum(identifiedAudioRecording: IdentifiedAudioRecording): void {
    const album = new AlbumEntity();
    album.name = identifiedAudioRecording.album.name;
    this.album = album;
  }

  private setLabel(identifiedAudioRecording: IdentifiedAudioRecording): void {
    const label = new LabelEntity();
    label.name = identifiedAudioRecording.label;
    this.label = label;
  }

  private setArtists(identifiedAudioRecording: IdentifiedAudioRecording): void {
    this.artists = identifiedAudioRecording.artists.map(artistDto => {
      const artist = new ArtistEntity();
      artist.name = artistDto.name;
      return artist;
    });
  }
}
