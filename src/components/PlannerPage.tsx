import { useEffect, useState } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import type { PlannerDay } from "../types/planner";
import PlannerPanel from "./PlannerPanel";
import { useAuthUser } from "../hooks/useAuthUser";
import { db } from "../firebase";

const STORAGE_KEY = "daylink-planner-days";

const today = new Date().toISOString().slice(0, 10);

const initialDays: PlannerDay[] = [
  {
    ownerId: "me",
    date: today,
    note: "",
    todos: [],
    timeBlocks: [],
    review: "",
  },
  {
    ownerId: "friend",
    date: today,
    note: "",
    todos: [],
    timeBlocks: [],
    review: "",
  },
];

function PlannerPage() {
  const { user, isAuthLoading } = useAuthUser();
  const [isCloudLoaded, setIsCloudLoaded] = useState(false);

  const [days, setDays] = useState<PlannerDay[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      return initialDays;
    }

    try {
      return JSON.parse(saved) as PlannerDay[];
    } catch {
      return initialDays;
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(days));
  }, [days]);

  useEffect(() => {
    const loadFirebaseData = async () => {
      if (!user) {
        setIsCloudLoaded(false);
        return;
      }

      const ref = doc(db, "users", user.uid);
      const snapshot = await getDoc(ref);

      if (snapshot.exists()) {
        const data = snapshot.data();

        if (data.days) {
          setDays(data.days as PlannerDay[]);
        }
      }

      setIsCloudLoaded(true);
    };

    loadFirebaseData();
  }, [user]);

  useEffect(() => {
    const saveFirebaseData = async () => {
      if (!user || !isCloudLoaded) return;

      const ref = doc(db, "users", user.uid);

      await setDoc(
        ref,
        {
          uid: user.uid,
          email: user.email,
          displayName: user.displayName,
          days,
          updatedAt: new Date().toISOString(),
        },
        { merge: true }
      );
    };

    saveFirebaseData();
  }, [days, user, isCloudLoaded]);

  const updateDay = (updatedDay: PlannerDay) => {
    setDays((prev) =>
      prev.map((day) =>
        day.ownerId === updatedDay.ownerId ? updatedDay : day
      )
    );
  };

  if (isAuthLoading) {
    return <p className="auth-message">로그인 상태 확인 중...</p>;
  }

  return (
    <main className="planner-page">
      <h1 className="app-title">DayLink</h1>

      {user ? (
        <p className="auth-message">
          로그인됨: {user.displayName ?? user.email} / Firebase 저장 중
        </p>
      ) : (
        <p className="auth-message">
          현재는 로컬 저장 모드입니다. 로그인하면 Firebase 저장을 사용할 수 있습니다.
        </p>
      )}

      <div className="planner-layout">
        {days.map((day) => (
          <PlannerPanel
            key={day.ownerId}
            plannerDay={day}
            onChange={updateDay}
          />
        ))}
      </div>
    </main>
  );
}

export default PlannerPage;