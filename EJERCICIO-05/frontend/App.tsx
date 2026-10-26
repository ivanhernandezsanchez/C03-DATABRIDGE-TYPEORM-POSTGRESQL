import { useState } from 'react';
import { Button, SafeAreaView, StyleSheet, Text, TextInput } from 'react-native';
const API_URL='http://172.22.31.189:3000';

export default function App(){
 const [estado,setEstado]=useState('RESERVADO');
 const [fecha,setFecha]=useState('2027-04-10');
 const [mensaje,setMensaje]=useState('');

 async function actualizar(cambios: {estado?: string; fecha?: string}){
   const r=await fetch(API_URL+'/viajes/1',{
     method:'PATCH',
     headers:{'Content-Type':'application/json'},
     body:JSON.stringify(cambios),
   });
   setMensaje(r.ok?'Viaje actualizado ✓':'No se pudo actualizar');
 }

 return <SafeAreaView style={styles.container}>
   <Text style={styles.title}>✈️ Travel Book</Text>
   <Text style={styles.section}>Editar viaje</Text>
   <Text style={styles.details}>✈️ Tokio</Text>
   <Text style={styles.details}>Japón · {estado}</Text>
   <Text style={styles.label}>📅 Fecha: {fecha.split('-').reverse().join('/')}</Text>
   <TextInput style={styles.input} value={fecha} onChangeText={setFecha} placeholder="AAAA-MM-DD"/>
   <Text style={styles.label}>Estado</Text>
   <TextInput style={styles.input} value={estado} onChangeText={setEstado}/>
   <Button title="Guardar cambios" onPress={()=>actualizar({estado, fecha})}/>
   <Text>{mensaje}</Text>
 </SafeAreaView>;
}
const styles=StyleSheet.create({container:{flex:1,padding:24},title:{fontSize:30,fontWeight:'800'},section:{fontSize:22,fontWeight:'700',marginTop:24},details:{fontSize:18,marginTop:8},label:{fontSize:16,marginTop:20},input:{padding:14,backgroundColor:'#F1F5F9',marginVertical:8}});
