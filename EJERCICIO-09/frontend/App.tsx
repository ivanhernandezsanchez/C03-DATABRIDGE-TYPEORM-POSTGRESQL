import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Button,
  FlatList,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

type Evento = {
  id: number;
  nombre: string;
  ciudad: string;
  categoria: string;
  fecha: string;
};

const API_URL = 'http://172.22.26.111:3000';

export default function App() {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [ciudad, setCiudad] = useState('Zaragoza');
  const [categoria, setCategoria] = useState('Tecnologia');
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState('');

  async function filtrar() {
    const parametros: string[] = [];
    if (ciudad.trim()) {
      parametros.push(`ciudad=${encodeURIComponent(ciudad.trim())}`);
    }
    if (categoria.trim()) {
      parametros.push(`categoria=${encodeURIComponent(categoria.trim())}`);
    }

    const query = parametros.length > 0 ? `?${parametros.join('&')}` : '';

    setCargando(true);
    setError('');
    try {
      const respuesta = await fetch(`${API_URL}/eventos${query}`);
      if (!respuesta.ok) throw new Error('La API respondió con error');
      setEventos(await respuesta.json());
    } catch {
      setError('No se pudieron cargar los eventos. Comprueba que NestJS está activo.');
    } finally {
      setCargando(false);
    }
  }

  useEffect(() => {
    void filtrar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.eyebrow}>EVENT RADAR · DESPUÉS DEL RETO</Text>
      <Text style={styles.heading}>Eventos filtrados</Text>

      <View style={styles.filters}>
        <TextInput
          style={styles.input}
          placeholder="Ciudad"
          value={ciudad}
          onChangeText={setCiudad}
        />
        <TextInput
          style={styles.input}
          placeholder="Categoría"
          value={categoria}
          onChangeText={setCategoria}
        />
        <Button title="Buscar" onPress={filtrar} />
      </View>

      {cargando && <ActivityIndicator style={styles.status} />}
      {error !== '' && <Text style={styles.error}>{error}</Text>}

      <FlatList
        data={eventos}
        keyExtractor={(item) => String(item.id)}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          !cargando && error === '' ? <Text>No hay eventos con esos filtros.</Text> : null
        }
        renderItem={({ item }) => (
          <View style={styles.event}>
            <Text style={styles.city}>📍 {item.ciudad}</Text>
            <Text style={styles.category}>Categoría: {item.categoria}</Text>
            <Text style={styles.name}>🎟️ {item.nombre}</Text>
            <Text style={styles.details}>{item.ciudad} · {item.categoria}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F8FA', padding: 24 },
  eyebrow: { color: '#566579', fontSize: 13, fontWeight: '700' },
  heading: { color: '#172033', fontSize: 26, fontWeight: '800', marginTop: 10, marginBottom: 18 },
  filters: { gap: 10, marginBottom: 16 },
  input: { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', borderWidth: 1, borderRadius: 8, padding: 12 },
  status: { marginVertical: 12 },
  error: { color: '#B42318', marginBottom: 12 },
  list: { gap: 12, paddingBottom: 24 },
  event: { backgroundColor: '#FFFFFF', borderColor: '#D7DEE8', borderWidth: 1, borderRadius: 10, padding: 16 },
  city: { color: '#52627A', fontSize: 14, fontWeight: '600' },
  category: { color: '#52627A', marginTop: 4 },
  name: { color: '#172033', fontSize: 18, fontWeight: '800', marginTop: 14 },
  details: { color: '#52627A', marginTop: 5 },
});