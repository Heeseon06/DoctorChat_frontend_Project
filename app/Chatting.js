import React, { useRef, useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
const Chatting = () => {
  const flatListRef = useRef();
  const [messages, setMessages] = useState([
    { id: '1', sender: 'bot', text: '안녕하세요! 어디가 불편하신가요?', animated: true },
  ]);
  const [input, setInput] = useState('');
  const [displayMessages, setDisplayMessages] = useState([...messages]);

  useEffect(() => {
    // 메시지가 변경되면 스크롤을 맨 아래로 내립니다.
    flatListRef.current?.scrollToEnd({ animated: false });
  }, [displayMessages]);

  const sendMessage = async () => {
    if (input.trim()) {
      const newMessage = { id: (messages.length + 1).toString(), sender: 'user', text: input, animated: false };
      setMessages([...messages, newMessage]);
      setInput('');
      try {
        const res = await fetch("{URL}/generate", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            message: input,
            history: messages.map(msg => [msg.sender === 'user' ? msg.text : '', msg.sender === 'bot' ? msg.text : ''])
          }),
        });
        const data = await res.json();
        if (data && data.response) {
          // 백엔드에서 단일 문자열로 응답하는 경우
          setMessages(prev => [...prev, { id: (prev.length + 1).toString(), sender: 'bot', text: data.response, animated: false }]);
      }
        
      } catch (error) {
        console.error('Error while fetching response:', error);
      }
    }
  };
  useEffect(() => {
    messages.forEach((msg) => {
      if (!msg.animated) {
        let currentText = '';
        msg.text.split('').forEach((char, index) => {
          setTimeout(() => {
            currentText += char;
            setDisplayMessages(prevDisplayMessages => {
              const index = prevDisplayMessages.findIndex(m => m.id === msg.id);
              if (index !== -1) {
                return prevDisplayMessages.map(m => m.id === msg.id ? {...m, text: currentText} : m);
              } else {
                return [...prevDisplayMessages, {...msg, text: currentText}];
              }
            });
          }, 50 * index);
        });
        setMessages(prevMessages =>
          prevMessages.map(m => (m.id === msg.id ? { ...m, animated: true } : m))
        );
      }
    });
  }, [messages]);
  const renderItem = ({ item }) => (
    <View style={[styles.messageContainer, item.sender === 'user' ? styles.userMessageContainer : styles.botMessageContainer]}>
      {item.sender === 'bot' && <Image source={require('../assets/images/bot.png')} style={styles.avatar} />}
      <View style={item.sender === 'user' ? styles.userMessage : styles.botMessage}>
        <Text style={item.sender === 'user' ? styles.userText : styles.botText}>{item.text}</Text>
      </View>
    </View>
  );
  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={displayMessages}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.chatContainer}
      />
      <TouchableOpacity style={styles.resetButton} onPress={() => {
        setMessages([{ id: '1', sender: 'bot', text: '안녕하세요! 어디가 불편하신가요?', animated: true }]);
        setDisplayMessages([{ id: '1', sender: 'bot', text: '안녕하세요! 어디가 불편하신가요?', animated: true }]);
      }}>
        {/* <Text style={styles.resetButtonText}>초기화</Text> */}
        <Image source={require('../assets/images/reload.png')} style={styles.reload} />
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="메시지를 입력해주세요"
        />
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}>
          <Text style={styles.sendButtonText}>보내기</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: 'white'
  },
  chatContainer: {
    flex: 1,
    marginTop: 60,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#ccc',
    padding: 10,
    height: 80,
  },
  input: {
    flex: 1,
    height: 50,
    borderColor: '#028CFD',
    borderWidth: 2,
    borderRadius: 10,
    paddingHorizontal: 14,
    marginRight: 10,
    fontFamily: 'NanumSquareR',
  },
  messageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  userMessageContainer: {
    justifyContent: 'flex-end',
  },
  botMessageContainer: {
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 20,
  },
  userMessage: {
    backgroundColor: '#A3D8FF',
    borderRadius: 20,
    padding: 18,
    marginVertical: 5,
    maxWidth: '70%',
    marginLeft: 10,
  },
  botMessage: {
    backgroundColor: '#EDEDED',
    borderRadius: 20,
    padding: 18,
    marginVertical: 5,
    maxWidth: '70%',
    marginRight: 10,
    marginLeft: 12,
  },
  userText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'NanumSquareEB',
  },
  botText: {
    color: 'black',
    fontSize: 18,
    fontFamily: 'NanumSquareEB',
  },
  sendButton: {
    backgroundColor: '#028CFD',
    padding: 10,
    borderRadius: 10,
    height: 44,
  },
  sendButtonText: {
    color: 'white',
    fontSize: 16,
    marginTop: 4,
    fontFamily: 'NanumSquareB',
  },
  resetButton: {
    position: 'absolute',
    top: 30,
    right: 20,
  },
  // resetButtonText: {
  //   color: 'white',
  //   fontSize: 16,
  //   fontFamily: 'NanumSquareB',
  // },
  reload: {
    width: 40,
    height: 40,
    alignSelf: 'center',
  },
});
export default Chatting;
