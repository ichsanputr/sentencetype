import { collection, doc, onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { auth, firestore } from "../util//firebase";
import { User, onAuthStateChanged } from "firebase/auth";
import { setUserEmail } from "../store/testSlice";
import { useAppDispatch } from "../store/store";
export function useUserData() {
  const [username, setUsername] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>();
  const dispatch = useAppDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
      dispatch(setUserEmail(user?.email))
    });
  }, []);

  useEffect(() => {
    setLoading(true);
    let unsubscribe;
    if (user) {
      const ref = doc(collection(firestore, "users"), user.uid);
      unsubscribe = onSnapshot(ref, (doc) => {
        setUsername(doc.data()?.username);
        setEmail(doc.data()?.email);
      });
    } else {
      setUsername(null);
    }
    if (user === undefined) {
      setLoading(true);
    } else {
      setLoading(false);
    }

    return unsubscribe;
  }, [user]);

  return { user, username, email, loading };
}
