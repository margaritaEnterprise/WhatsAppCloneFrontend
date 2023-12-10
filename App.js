import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View, ScrollView } from 'react-native';
import { createSignalRContext } from "react-signalr/signalr";
import { useFonts } from 'expo-font';
import Constants from 'expo-constants';

const apiUrl = "https://whatsappclonebackned.onrender.com/chatHub";
const SignalRContext = createSignalRContext();

const Messages = () => {
  const [messages, setMessage] = useState([]);

  SignalRContext.useSignalREffect(
    "ReceiveMessage", // Your Event Key
    (user, message) => {
      let messagesWithUser = { user : user, message : message }
      setMessage([...messages, messagesWithUser]);
    },
  );

  return (
    <ScrollView>
      <View>
        {messages.map((message, index) => <Text key={index} style={{fontFamily:'Poppins'}} >{message.user} says {message.message}</Text>)}
      </View>
    </ScrollView>
  );
};

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins' : require('./assets/fonts/popins/Poppins-Regular.ttf')
  });

  const [user, onChangeUser] = useState('');
  const [text, onChangeText] = useState('');

  if(!fontsLoaded){
    return <Text>Cargando ...</Text>
  }

  return (
    <SignalRContext.Provider 
      connectEnabled={true}
      url={apiUrl}
    >
        <View style={styles.container}>
          <Text style={{ fontSize: 50, fontFamily:'Poppins'}}>Chats</Text>
          <StatusBar style="auto" />
          <Messages/>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUser}
            placeholder={'username'}
            value={user}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            placeholder={'Send a message'}
            onSubmitEditing={ (e) => {
              SignalRContext.invoke("SendMessage", user, text).catch(err => console.error(err));
              e.target.value = '';
            }}
          />
        </View>
    </SignalRContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: Constants.statusBarHeight,
    flex: 1,
    flexDirection: 'column',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    fontFamily: 'Poppins'
  },
  input: {
    fontFamily: 'Poppins',
    height: 40,
    margin: 12,
    borderWidth: 2,
    padding: 10,
    borderColor: 'black',
    width: '90%',
    borderRadius: 10
  },
});
