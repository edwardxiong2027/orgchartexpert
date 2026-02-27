import { useState, useEffect } from "react";
import { subscribeToCharts } from "../firebase/chartService";

export function useDashboardData(userId) {
  const [charts, setCharts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!userId) {
      setCharts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    let unsubscribe;

    try {
      unsubscribe = subscribeToCharts(userId, (data) => {
        setCharts(data);
        setLoading(false);
      });
    } catch (err) {
      console.error("Error loading dashboard:", err);
      setError(err.message);
      setLoading(false);
    }

    return () => unsubscribe && unsubscribe();
  }, [userId]);

  return { charts, loading, error };
}
