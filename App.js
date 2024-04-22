import React, { createContext, useContext, useEffect, useState } from 'react';
import { AsyncStorage, View, Text, Button, FlatList, TextInput,Image } from 'react-native';

const cores = {
  primária: '#007bff',
  secundária: '#6c757d',
  sucesso: '#28a745',
  perigo: '#dc3545',
  claro: '#f8f9fa',
  escuro: '#343a40',
};

const ContextoMembros = createContext();
const ContextoTransações = createContext();

const TelaMembros = () => {
  const { membros } = useContext(ContextoMembros);

   

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Image source={require('./assets/Screenshot_1.png')} />
      
      <Text style={{ color: cores.primária }}>Descrição dos Membros:</Text>
      {membros.map((membro, index) => (
        <Text key={index} style={{ color: cores.escuro }}>{membro.nome}: {membro.função}</Text>
      ))}
    </View>
  );
};

const TelaTransações = () => {
  const { transações } = useContext(ContextoTransações);

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={transações}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ padding: 10 }}>
            <Text style={{ color: cores.sucesso }}>{item.tipo}: R${item.valor.toFixed(2)}</Text>
          </View>
        )}
      />
    </View>
  );
};

const TelaAdicionarTransação = () => {
  const { adicionarTransação } = useContext(ContextoTransações);
  const [tipo, setTipo] = useState('');
  const [valor, setValor] = useState('');

  const lidarComAdiçãoDeTransação = () => {
    if (tipo && valor) {
      adicionarTransação({ tipo, valor: parseFloat(valor) });
      setTipo('');
      setValor('');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TextInput
        style={{ borderWidth: 1, borderColor: cores.escuro, padding: 10, marginBottom: 10, color: cores.escuro }}
        placeholder="Tipo (ex: Depósito, Saque)"
        value={tipo}
        onChangeText={setTipo}
      />
      <TextInput
        style={{ borderWidth: 1, borderColor: cores.escuro, padding: 10, marginBottom: 10, color: cores.escuro }}
        placeholder="Valor"
        keyboardType="numeric"
        value={valor}
        onChangeText={setValor}
      />
      <Button title="Adicionar Transação" color={cores.primária} onPress={lidarComAdiçãoDeTransação} />
    </View>
  );
};

const App = () => {
  const [telaAtual, setTelaAtual] = useState('membros');
  const [transações, setTransações] = useState([]);
  const [membros] = useState([
    { nome: 'Munir', função: 'RM550893' },
    { nome: 'Macirander Filho', função: 'RM551416' },
  ]);

  useEffect(() => {
    const carregarTransações = async () => {
      const transaçõesSalvas = await AsyncStorage.getItem('transações');
      if (transaçõesSalvas) {
        setTransações(JSON.parse(transaçõesSalvas));
      }
    };
    carregarTransações();
  }, []);

  const adicionarTransação = (transação) => {
    const transaçõesAtualizadas = [...transações, transação];
    setTransações(transaçõesAtualizadas);
    AsyncStorage.setItem('transações', JSON.stringify(transaçõesAtualizadas));
  };

  const TelaAtual = () => {
    switch (telaAtual) {
      case 'membros':
        return <TelaMembros />;
      case 'transações':
        return <TelaTransações />;
      case 'adicionarTransação':
        return <TelaAdicionarTransação />;
      default:
        return <TelaMembros />;
    }
  };

  return (
    <ContextoMembros.Provider value={{ membros }}>
      <ContextoTransações.Provider value={{ transações, adicionarTransação }}>
        <View style={{ flex: 1 }}>
          <TelaAtual />
          <Button title="Membros" color={cores.primária} onPress={() => setTelaAtual('membros')} />
          <Button title="Transações" color={cores.primária} onPress={() => setTelaAtual('transações')} />
          <Button title="Adicionar Transação" color={cores.primária} onPress={() => setTelaAtual('adicionarTransação')} />
        </View>
      </ContextoTransações.Provider>
    </ContextoMembros.Provider>
  );
};

export default App;
