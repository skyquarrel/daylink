import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";
import type { PlannerDay } from "../types/planner";

interface Props {
  onFriendLoaded: (friendDays: PlannerDay[]) => void;
}

function FriendSearch({ onFriendLoaded }: Props) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const searchFriend = async () => {
    if (email.trim() === "") {
      setMessage("친구 이메일을 입력해주세요.");
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("email", "==", email.trim()));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setMessage("해당 이메일의 사용자를 찾을 수 없습니다.");
      return;
    }

    const friendData = snapshot.docs[0].data();

    if (!friendData.days) {
      setMessage("친구의 플래너 데이터가 아직 없습니다.");
      return;
    }

    onFriendLoaded(friendData.days as PlannerDay[]);
    setMessage("친구 플래너를 불러왔습니다.");
  };

  return (
    <div className="friend-search">
      <input
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="친구 이메일 입력"
      />

      <button type="button" onClick={searchFriend}>
        친구 플래너 불러오기
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FriendSearch;