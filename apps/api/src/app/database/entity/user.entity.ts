import { Column, Entity, Index, PrimaryColumn } from 'typeorm';

@Entity('user')
export default class UserEntity {

  @Index({ unique: true })
  @PrimaryColumn({ type: 'text', unique: true }) id: string;
  @Column('text') login: string;
  @Column('text') display_name: string;
  @Column('text') type: string;
  @Column({ type: 'text', nullable: true }) broadcaster_type: string;
  @Column('text') description: string;
  @Column({ type: 'text', unique: true }) profile_image_url: string;
  @Column({ type: 'text', unique: true }) offline_image_url: string;
  @Column('int') view_count: string;
  @Column('text') email: string;

}
