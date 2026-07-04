import { useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase";

interface Props {
  onFriendSelected: (friendUid: string) => void;
}

function FriendSearch({ onFriendSelected }: Props) {
  const [friendCode, setFriendCode] = useState("");
  const [message, setMessage] = useState("");

  const searchFriend = async () => {
    const code = friendCode.trim().toUpperCase();

    if (code === "") {
      setMessage("친구 코드를 입력해주세요.");
      return;
    }

    const usersRef = collection(db, "users");
    const q = query(usersRef, where("friendCode", "==", code));
    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      setMessage("해당 친구 코드를 찾을 수 없습니다.");
      return;
    }

    const friendDoc = snapshot.docs[0];
    onFriendSelected(friendDoc.id);

    setMessage("친구 플래너를 연결했습니다.");
  };

  return (
    <div className="friend-search">
      <input
        value={friendCode}
        onChange={(e) => setFriendCode(e.target.value)}
        placeholder="친구 코드 입력 예: DL-ABC123"
      />

      <button type="button" onClick={searchFriend}>
        친구 플래너 연결
      </button>

      {message && <p>{message}</p>}
    </div>
  );
}

export default FriendSearch;