import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";

import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  onSnapshot,
  serverTimestamp,
  setDoc,
  updateDoc,
  query,
  orderBy
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDyi9DN3aaf6a98lWYH87cGmeaWQzspRE0",
  authDomain: "echoe---chat-app.firebaseapp.com",
  projectId: "echoe---chat-app",
  storageBucket: "echoe---chat-app.firebasestorage.app",
  messagingSenderId: "981699696912",
  appId: "1:981699696912:web:4f00245e498d2a9500ed95",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

const db = getFirestore(app);

export const listenForChats = (setChats) => {
  if (!auth.currentUser) {
    return ()=>{}
  }
  const chatsRef = collection(db, "chats");
  const unsubscribe = onSnapshot(chatsRef, (snapshot) => {
    const chatList = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    const filteredChats = chatList.filter((chat) =>
      chat?.users?.some((user) => user.email === auth.currentUser.email)
    );
    setChats(filteredChats);
  });

  return unsubscribe;
};

export const sendMessage = async (messageText, chatId, user1, user2) => {
  const chatsRef = doc(db, "chats", chatId);

  const user1Doc = await getDoc(doc(db, "user", user1));
  const user2Doc = await getDoc(doc(db, "user", user2));

  if (!user1Doc.exists()) {
    console.error("Could not find user data for current user:", user1);
    return; // Stop the function
  }
  if (!user2Doc.exists()) {
    console.error("Could not find user data for selected user:", user2);
    return; // Stop the function
  }

  console.log(user1Doc);
  console.log(user2Doc);

  const user1Data = user1Doc.data();
  const user2Data = user2Doc.data();

  const chatDoc = await getDoc(chatsRef);
  if (!chatDoc.exists()) {
    await setDoc(chatsRef, {
      users: [user1Data, user2Data],
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  } else {
    await updateDoc(chatsRef, {
      lastMessage: messageText,
      lastMessageTimestamp: serverTimestamp(),
    });
  }

  const messageRef = collection(db, "chats", chatId, "messages");

  await addDoc(messageRef, {
    text: messageText,
    sender: auth.currentUser.email,
    timestamp: serverTimestamp(),
  });
};

export const listenForMessages = (chatId, setMessages) => {
  const chatRef = collection(db, "chats", chatId, "messages")
  const q = query(chatRef, orderBy("timestamp", "asc"))

  const unsubscribe = onSnapshot(q, (snapshot)=>{
      const messages = snapshot.docs.map((doc)=>({
        id: doc.uid,
        ...doc.data(),
      }))
      setMessages(messages)
  })
  return unsubscribe
}

export { auth, db };
