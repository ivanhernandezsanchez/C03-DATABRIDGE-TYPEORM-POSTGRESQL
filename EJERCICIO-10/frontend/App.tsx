import { useEffect,useState } from 'react';
import { Button,FlatList,SafeAreaView,Text,TextInput,View } from 'react-native';

type Prioridad='BAJA'|'MEDIA'|'ALTA';
type Destino={id:number;ciudad:string;pais:string;descripcion:string;prioridad:Prioridad;visitado:boolean};
const API_URL='http://172.22.26.111:3000';
const prioridades:Prioridad[]=['BAJA','MEDIA','ALTA'];

export default function App(){
 const [destinos,setDestinos]=useState<Destino[]>([]);
 const [ciudad,setCiudad]=useState('');
 const [pais,setPais]=useState('');
 const [prioridad,setPrioridad]=useState<Prioridad>('ALTA');
 const [error,setError]=useState('');

 async function request(url:string,options?:RequestInit){
   const r=await fetch(url,options);
   if(!r.ok) throw new Error('HTTP '+r.status);
   return r;
 }

 async function cargar(){
   try{
     const r=await request(API_URL+'/destinos');
     setDestinos(await r.json());
     setError('');
   }catch{setError('No se pudieron cargar los destinos.');}
 }
 useEffect(()=>{cargar();},[]);

 async function crear(){
   try{
     await request(API_URL+'/destinos',{
       method:'POST',
       headers:{'Content-Type':'application/json'},
       body:JSON.stringify({
         ciudad,
         pais,
         descripcion:'Nuevo destino',
          prioridad,
          visitado:false,
       }),
     });
     setCiudad('');
     setPais('');
       setPrioridad('ALTA');
     await cargar();
   }catch{setError('No se pudo crear.');}
 }

   async function editar(id:number,cambios:Partial<Destino>){
   try{
     await request(API_URL+'/destinos/'+id,{
       method:'PATCH',
       headers:{'Content-Type':'application/json'},
         body:JSON.stringify(cambios),
     });
     await cargar();
   }catch{setError('No se pudo actualizar.');}
 }

   function siguientePrioridad(actual:Prioridad):Prioridad{
     const indice=prioridades.indexOf(actual);
     return prioridades[(indice+1)%prioridades.length];
   }

 async function eliminar(id:number){
   try{
     await request(API_URL+'/destinos/'+id,{method:'DELETE'});
     await cargar();
   }catch{setError('No se pudo eliminar.');}
 }

 return <SafeAreaView>
   <Text>WANDER · DESPUÉS DEL RETO</Text>
   <Text>🌍 Tus destinos</Text>
   {error!==''&&<Text>{error}</Text>}
   <TextInput placeholder="Ciudad" value={ciudad} onChangeText={setCiudad}/>
   <TextInput placeholder="País" value={pais} onChangeText={setPais}/>
   <Text>Prioridad del nuevo destino: {prioridad}</Text>
   <Button title="Cambiar prioridad" onPress={()=>setPrioridad(siguientePrioridad(prioridad))}/>
   <Button title="Crear destino" onPress={crear}/>
   <FlatList
     data={destinos}
     keyExtractor={x=>String(x.id)}
     renderItem={({item})=><View>
       <Text>{item.ciudad} · {item.pais}</Text>
       <Text>{item.descripcion}</Text>
       <Text>Prioridad {item.prioridad}</Text>
       <Text>{item.visitado?'✓ Visitado':'Pendiente de visitar'}</Text>
       <Button title="Cambiar prioridad" onPress={()=>editar(item.id,{prioridad:siguientePrioridad(item.prioridad)})}/>
       <Button title={item.visitado?'Marcar pendiente':'Marcar visitado'} onPress={()=>editar(item.id,{visitado:!item.visitado})}/>
       <Button title="Eliminar" onPress={()=>eliminar(item.id)}/>
     </View>}
   />
 </SafeAreaView>;
}