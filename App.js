import React, {useState} from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { createSignalRContext } from "react-signalr/signalr";
import { ScrollView} from 'react-native-web';
import { useFonts } from 'expo-font';

const SignalRContext = createSignalRContext();

const Comp = () => {
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
      {messages.map(message => <Text style={{fontFamily:'Poppins'}} >{message.user} says {message.message}</Text>)}
    </ScrollView>
  );
};

export default function App() {

  const [fontsLoaded] = useFonts({
    'Poppins' : require('./assets/fonts/popins/Poppins-Regular.ttf')
  });

  const [user, onChangeUser] = useState('');
  const [text, onChangeText] = useState('Send a message');

  if(!fontsLoaded){
    return <Text>Cargando ...</Text>
  }

  return (
    <SignalRContext.Provider 
      connectEnabled={true}
      url={"https://localhost:7144/chatHub"}
    >
        <View style={styles.container}>
          <Text style={{ fontSize: 50, fontFamily:'Poppins'}}>Chats</Text>
          <StatusBar style="auto" />
          <Comp/>
          <TextInput
            style={styles.input}
            onChangeText={onChangeUser}
            value={user}
          />
          <TextInput
            style={styles.input}
            onChangeText={onChangeText}
            value={text}
            onSubmitEditing={ () => {
              SignalRContext.invoke("SendMessage", user, text).catch(err => console.error(err));
            }}
          />
        </View>
    </SignalRContext.Provider>

  );
}

const styles = StyleSheet.create({
  container: {
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
