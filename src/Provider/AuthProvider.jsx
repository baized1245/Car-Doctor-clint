import React, { createContext, useEffect, useState } from 'react';
import { GoogleAuthProvider, createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import app from './../firebase/firebase.config';

export const AuthContext = createContext();
const auth = getAuth(app)

const AuthProvider = ({children}) => {

    const [user, setUser] = useState([null]);
    const [loading, setLoading] = useState([true]);
    const googleProvider = new GoogleAuthProvider();

    const creatUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password)
    }

    const googleSignIn = () => {
        setLoading(true);
        return signInWithPopup(auth, googleProvider);
    }
     
     const signIn = (email, password) =>{
        setLoading(true);
        return signInWithEmailAndPassword(auth, email, password)
     }

     const logOut = () => {
        setLoading(true);
        return signOut(auth);
     }

    useEffect(() =>{
       const unsubscribe = onAuthStateChanged(auth, currentUser =>{
            setUser(currentUser);
            console.log('current user in auth provider', currentUser);
            setLoading(false);
            if(currentUser && currentUser.email){
                const loggedUser = {
                    email: currentUser.email
                  }
                fetch(('https://car-doctor-server-delta-pearl.vercel.app/jwt'), {
                    method: 'POST',
                    headers: {
                     'content-type': 'application/json'
                    },
                    body: JSON.stringify(loggedUser)
                 })
                 .then(res => res.json())
                 .then(data => {
                   console.log("jwtresponce", data);
                   // Store token in local storage
                   localStorage.setItem('car-access-token', data.token);
                 })  
            }
            else{
                localStorage.removeItem('car-access-token');
            }
        });
        return() => {
            return unsubscribe();
        }
    }, [])

   const authInfo = {
      user,
      loading, 
      creatUser,
      signIn,
      googleSignIn,
      logOut
   }

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;