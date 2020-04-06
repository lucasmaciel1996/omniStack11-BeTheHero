import React, {useEffect, useState } from 'react';
import { View, FlatList, Image, Text, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import logoImg from '../../assets/logo.png';
import style from './style';

import api from '../../services/api';

function Incidents(){
  const navigation = useNavigation();

  const [incidents, setIncidents] = useState([]);
  const [total, setTotal] = useState();

  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);


  async function loadIncidents() {

    if(loading) {
      return;
    }

    if(total > 0 && incidents.length == total) {
      return;
    }

    setLoading(true);

    const response = await api.get('incidents', {
      params: { page }
    });

    setIncidents([...incidents, ...response.data]);
    setTotal(response.headers['x-total-count']);
    setPage(page +1);

    setLoading(false); 
  }

  useEffect(()=>{
    loadIncidents();
  },[])
  
  function navigateToDetails(incident) {
    navigation.navigate('Detail', { incident });
  }

  return (
    <View style={style.container}>
      <View style={style.header}>
        <Image source={logoImg} />
        <Text style={style.headerText}>
          Total de <Text style={style.headerTextBold}>{total} casos </Text>
        </Text>
      </View>
      <Text style={style.title}>Bem vindo!</Text>
      <Text style={style.description}>Escolha um dos casos abaixo e salve o dia</Text>

      <FlatList 
        data={incidents}
        style={style.incidentsList}
        keyExtractor={ incident => String(incident.id)}
        // showsVerticalScrollIndicator={false}
        onEndReached={loadIncidents}
        onEndReachedThreshold={0.2}
        renderItem={({ item: incident }) => (
          <View style={style.incident}>
            <Text style={style.incidentProperty}>ONG:</Text>
        <Text style={style.incidentValue}>{incident.name}</Text>

            <Text style={style.incidentProperty}>CASO:</Text>
            <Text style={style.incidentValue}>{incident.title}</Text>

            <Text style={style.incidentProperty}>VALOR:</Text>
            <Text style={style.incidentValue}>
              {Intl.NumberFormat('pt-BT', { 
                style: 'currency',
                currency: 'BRL'
              }).format(incident.value)}
            </Text>

            <TouchableOpacity
              style={style.detailsButton}
              onPress={() =>navigateToDetails(incident)}
            >
              <Text style={style.detailsButtonText}>ver mais detalhe</Text>
              <Feather name="arrow-right" size={16} color="#E02041"/>
           </TouchableOpacity>
          </View>
        )}
      
      />    
    </View>
  );
}

export default Incidents;