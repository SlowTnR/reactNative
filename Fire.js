import firebase from 'firebase';
import '@firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDrhNpCFw0rGwOijVLZu1GsOQ-NOJx-cAs",
  authDomain: "rntodoapp-9194f.firebaseapp.com",
  databaseURL: "https://rntodoapp-9194f.firebaseio.com",
  projectId: "rntodoapp-9194f",
  storageBucket: "rntodoapp-9194f.appspot.com",
  messagingSenderId: "414193624461",
  appId: "1:414193624461:web:3d9d3eaa6958db65a149c4"
};

class Fire {
  constructor(callback){
    this.init(callback);
  }

  init(callback){
    if (!firebase.apps.length){
      firebase.initializeApp(firebaseConfig)
    }

    firebase.auth().onAuthStateChanged(user => {
      if(user){
        callback(null,user)

      }else {
        firebase.auth().signInAnonymously().catch(error => {
          callback(error);
        });
      }

    });
  }
  getLists(callback){
      let ref = firebase.firestore().collection("users").doc(this.userId).collection("lists");

      this.unsubscribe = ref.onSnapshot(snapshot => {
        lists = [];

        snapshot.forEach(doc => {
          lists.push({id:doc.id, ...doc.data()});
        });
        callback(lists);
      });
  }

  get userId(){
      return firebase.auth().currentUser.uid;
  }

  detach(){
    this.unsubscribe();
  }


}

export default Fire;