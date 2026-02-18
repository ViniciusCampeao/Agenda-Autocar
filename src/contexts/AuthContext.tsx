/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { 
  signInWithEmailAndPassword, 
  signOut, 
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  setPersistence,
  browserLocalPersistence,
  type User as FirebaseUser
} from 'firebase/auth';
import { auth, db } from '../config/firebase';
import { doc, getDoc, setDoc, collection, getDocs, query, deleteDoc } from 'firebase/firestore';
import type { Employee } from '../types';

interface AuthContextType {
  currentUser: Employee | null;
  firebaseUser: FirebaseUser | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  employees: Employee[];
  addEmployee: (name: string, email: string, password: string, isAdmin: boolean) => Promise<void>;
  deleteEmployee: (employeeId: string) => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEmployees = async () => {
    try {
      const q = query(collection(db, 'employees'));
      const querySnapshot = await getDocs(q);
      const loadedEmployees: Employee[] = [];
      querySnapshot.forEach((docSnap) => {
        loadedEmployees.push({ id: docSnap.id, ...docSnap.data() } as Employee);
      });
      setEmployees(loadedEmployees);
    } catch {
      return;
    }
  };

  useEffect(() => {
    let mounted = true;

    const initialize = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        setFirebaseUser(user);
        if (user && mounted) {
          try {
            const docRef = doc(db, 'employees', user.uid);
            const docSnap = await getDoc(docRef);
            if (docSnap.exists()) {
              setCurrentUser({ id: user.uid, ...docSnap.data() } as Employee);
            } else {
              await signOut(auth);
              alert('Erro: Seu cadastro está incompleto. Entre em contato com o administrador.');
            }
          } catch {
            await signOut(auth);
          }
        } else {
          setCurrentUser(null);
        }
        if (mounted) {
          setLoading(false);
        }
      });

      await loadEmployees();

      return unsubscribe;
    };

    const unsubscribePromise = initialize();

    return () => {
      mounted = false;
      unsubscribePromise.then(unsub => unsub());
    };
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      await setPersistence(auth, browserLocalPersistence);
      await signInWithEmailAndPassword(auth, email, password);
      return true;
    } catch {
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setCurrentUser(null);
    } catch {
      return;
    }
  };

  const addEmployee = async (name: string, email: string, password: string, isAdmin: boolean): Promise<void> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      const employeeData = {
        name,
        email,
        isAdmin,
      };

      try {
        await setDoc(doc(db, 'employees', user.uid), employeeData);
      } catch {
        await new Promise(resolve => setTimeout(resolve, 500));
        await setDoc(doc(db, 'employees', user.uid), employeeData);
      }
      
      await loadEmployees();
      
      await signOut(auth);
      
    } catch (error: unknown) {
      
      if (error && typeof error === 'object' && 'code' in error) {
        const firebaseError = error as { code: string; message: string };
        if (firebaseError.code === 'auth/email-already-in-use') {
          throw new Error('Este email já está cadastrado. Contate o suporte técnico para resolver o problema.');
        }
        if (firebaseError.code === 'permission-denied') {
          throw new Error('Erro de permissão no Firestore. Verifique as regras de segurança do banco de dados.');
        }
      }
      
      throw error;
    }
  };

  const deleteEmployee = async (employeeId: string): Promise<void> => {
    await deleteDoc(doc(db, 'employees', employeeId));
    await loadEmployees();
  };

  return (
    <AuthContext.Provider value={{ currentUser, firebaseUser, login, logout, employees, addEmployee, deleteEmployee, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
