import { Column,Entity,OneToMany,PrimaryGeneratedColumn } from 'typeorm';
import { Cancion } from './cancion.entity';

@Entity('playlists')
export class Playlist {
 @PrimaryGeneratedColumn() id:number;
 @Column() nombre:string;

 @OneToMany(()=>Cancion,(cancion)=>cancion.playlist)
 canciones:Cancion[];
}