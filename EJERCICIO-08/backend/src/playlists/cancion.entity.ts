import { Column,Entity,ManyToOne,PrimaryGeneratedColumn } from 'typeorm';
import { Playlist } from './playlist.entity';

@Entity('canciones')
export class Cancion {
 @PrimaryGeneratedColumn() id:number;
 @Column() titulo:string;
 @Column() artista:string;

 @ManyToOne(()=>Playlist,(playlist)=>playlist.canciones,{onDelete:'CASCADE'})
 playlist:Playlist;
}