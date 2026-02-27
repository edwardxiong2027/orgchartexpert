import { useState, useEffect } from "react";
import { subscribeToOrgMembers } from "../firebase/orgService";

export function useOrgData(userId, chartId) {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId || !chartId) {
      setMembers([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);

    const unsubscribe = subscribeToOrgMembers(
      userId,
      chartId,
      (data) => {
        setMembers(data);
        setLoading(false);
      },
      (err) => {
        console.error("Error loading org data:", err);
        setError(err.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [userId, chartId]);

  return { members, loading, error };
}
