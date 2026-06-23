import { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, type User } from "firebase/auth";

export function useAuthUser() {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthLoading, setIsAuthLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { user, isAuthLoading };
}