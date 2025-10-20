import React from 'react';
import { View, Text, StyleSheet, Linking, ScrollView } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const AboutScreen = () => {
  const openLink = () => {
    Linking.openURL('https://github.com/CelularBat/rnMeteo');
  };

  const openLinkICM =() =>{
    Linking.openURL('https://old.meteo.pl/');
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>O aplikacji</Text>
      <Text style={styles.paragraph}>
        Nieoficjalny klient dla starszej wersji modelu pogodowego 
        <Text style={styles.link} onPress={openLinkICM}>
         {" ICM Meteo"}
        </Text> 
        . Obsługuje meteogramy numerycznego modelu pogody UM 60h.
        {"\n"} Projekt hobbystyczny.
        {"\n"}{"\n"}Jego zaletą jest możliwość wyszukania dowolnej miejscowości w obrębie modelu, który obejmuje znaczną część Europy północnej i centralnej.
        {"\n"}Odnajdziesz równiez prognozę dla najmniejszej wsi.
      </Text>

      <Text style={styles.heading}>Autor</Text>
      <Text style={styles.paragraph}>CelularBat (2023-2025)</Text>

      <Text style={styles.heading}>Strona aplikacji</Text>
      <Text style={styles.link} onPress={openLink}>
        <FontAwesome name="github" size={16} /> https://github.com/CelularBat/rnMeteo
      </Text>

      <Text style={[styles.paragraph, styles.italic]}>
      {"\n"}{"\n"}{"\n"}{"\n"}
        Prognozy są udostępnione nieodpłatnie przez serwis 
        <Text style={styles.link} onPress={openLinkICM}>
        { " meteo.pl " }
        </Text>
        prowadzony przez ICM, Uniwersytet Warszawski.{"\n"}{"\n"}
        Wyniki uzyskano przy użyciu oprogramowania Met Office.{"\n"}
        Material produced using Met Office Software
      </Text>
    </ScrollView>
  );
};

export default AboutScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 5,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 22,
    color: '#333',
  },
  link: {
    fontSize: 16,
    color: '#007AFF',
    marginTop: 5,
  },
  italic: {
    fontStyle: 'italic'
  }
});
