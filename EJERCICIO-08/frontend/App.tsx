import { useEffect, useState } from 'react';
import { Button, FlatList, SafeAreaView, StyleSheet, Text, TextInput, View } from 'react-native';

type Cancion={id:number;titulo:string;artista:string};
type Playlist={id:number;nombre:string;canciones:Cancion[]};
const API_URL='http://172.22.26.111:3000';

export default function App(){
 const [playlist,setPlaylist]=useState<Playlist|null>(null);
 const [titulo,setTitulo]=useState('');
 const [artista,setArtista]=useState('');
 const [mensaje,setMensaje]=useState('');

 async function cargar(){
   const r=await fetch(API_URL+'/playlists/1');
   if(!r.ok) throw new Error('No se pudo cargar la playlist');
   setPlaylist(await r.json());
 }
 useEffect(()=>{cargar();},[]);

 async function anadirCancion(){
  if(!titulo.trim()||!artista.trim()){
   setMensaje('Escribe el título y el artista.');
   return;
  }

  try{
   const r=await fetch(API_URL+'/playlists/1/canciones',{
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body:JSON.stringify({titulo:titulo.trim(),artista:artista.trim()}),
   });
   if(!r.ok) throw new Error('No se pudo guardar la canción');
   setPlaylist(await r.json());
   setTitulo('');
   setArtista('');
   setMensaje('Canción añadida.');
  }catch{
   setMensaje('No se pudo añadir la canción. Comprueba que NestJS está activo.');
  }
 }


 if(!playlist)return <Text>Cargando...</Text>;

 return <SafeAreaView style={styles.container}>
   <Text style={styles.eyebrow}>MY PLAYLISTS · DESPUÉS DEL RETO</Text>
   <Text style={styles.heading}>{playlist.nombre}</Text>
   <FlatList data={playlist.canciones} keyExtractor={x=>String(x.id)}
     contentContainerStyle={styles.list}
     renderItem={({item})=><View style={styles.song}>
      <Text style={styles.songTitle}>🎵 {item.titulo}</Text>
      <Text style={styles.artist}>{item.artista}</Text>
     </View>}/>
   <View style={styles.form}>
    <TextInput
     style={styles.input}
     placeholder="Título de la canción"
     value={titulo}
     onChangeText={setTitulo}
    />
    <TextInput
     style={styles.input}
     placeholder="Artista"
     value={artista}
     onChangeText={setArtista}
    />
    <Button title="＋ Añadir canción" onPress={anadirCancion}/>
    {mensaje!==''&&<Text style={styles.message}>{mensaje}</Text>}
   </View>
 </SafeAreaView>;
}

const styles=StyleSheet.create({
 container:{flex:1,backgroundColor:'#F7F8FA',padding:24},
 eyebrow:{color:'#596579',fontSize:13,fontWeight:'700'},
 heading:{color:'#172033',fontSize:28,fontWeight:'800',marginTop:10,marginBottom:18},
 list:{gap:12,paddingBottom:16},
 song:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DDE3EC',borderRadius:10,padding:16},
 songTitle:{color:'#172033',fontSize:18,fontWeight:'700'},
 artist:{color:'#65738A',fontSize:15,marginTop:5},
 form:{gap:10,paddingTop:10},
 input:{backgroundColor:'#FFFFFF',borderWidth:1,borderColor:'#DDE3EC',borderRadius:8,padding:12},
 message:{color:'#46556B',marginTop:4},
});