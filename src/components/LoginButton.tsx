import { useEffect, useState } from "react";
import { auth } from "../firebase";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
  type User,
} from "firebase/auth";

function LoginButton() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error(error);
      alert("로그인 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
    }
  };

  const logout = async () => {
    await signOut(auth);
  };

  if (user) {
    return (
      <button type="button" onClick={logout}>
        로그아웃 ({user.displayName ?? user.email})
      </button>
    );
  }

  return (
    <button type="button" onClick={login}>
      Google로 로그인
    </button>
  );
}

export default LoginButton;