import { Body,Controller,Get,Param,ParseIntPipe,Post } from '@nestjs/common';
import { PlaylistsService } from './playlists.service';
import { CreateCancionDto } from './create-cancion.dto';
import { Playlist } from './playlist.entity';

@Controller('playlists')
export class PlaylistsController {
 constructor(private readonly service:PlaylistsService){}

 @Get(':id')
 findOne(@Param('id',ParseIntPipe) id:number){
   return this.service.findOne(id);
 }

 @Post(':id/canciones')
 addSong(
  @Param('id',ParseIntPipe) id:number,
  @Body() dto:CreateCancionDto,
 ):Promise<Playlist>{
  return this.service.addSong(id,dto.titulo,dto.artista);
 }
}