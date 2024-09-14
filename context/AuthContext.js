'use client'
import { auth, db } from '@/firebase'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  signInAnonymously,
  onAuthStateChanged,
} from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import React, { useContext, useState, useEffect } from 'react'

const AuthContext = React.createContext()

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [userDataObj, setUserDataObj] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('') // New state for error handling

  // AUTH HANDLERS
  function signup(email, password) {
    return createUserWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        console.error('Signup Error:', err.message)
        setError(err.message) // Handle signup errors
      })
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password)
      .catch((err) => {
        console.error('Login Error:', err.message)
        setError(err.message) // Handle login errors
      })
  }

  function logout() {
    setUserDataObj(null)
    setCurrentUser(null)
    return signOut(auth)
      .catch((err) => {
        console.error('Logout Error:', err.message)
        setError(err.message) // Handle logout errors
      })
  }

  function loginAsGuest() {
    return signInAnonymously(auth)
      .catch((err) => {
        console.error('Guest Login Error:', err.message)
        setError(err.message) // Handle guest login errors
      })
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        setLoading(true)
        setCurrentUser(user)
        if (!user) {
          console.log('No User Found')
          setUserDataObj(null)
          return
        }

        console.log('Fetching User Data')
        const docRef = doc(db, 'users', user.uid)
        const docSnap = await getDoc(docRef)
        if (docSnap.exists()) {
          console.log('Found User Data')
          setUserDataObj(docSnap.data())
        } else {
          setUserDataObj({})
          console.log('No User Data Found in Firestore')
        }
      } catch (err) {
        console.error('Auth State Change Error:', err.message)
        setError(err.message) // Handle errors during auth state changes
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  const value = {
    currentUser,
    userDataObj,
    setUserDataObj,
    signup,
    login,
    logout,
    loginAsGuest,
    loading,
    error, // Include error in context value
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
