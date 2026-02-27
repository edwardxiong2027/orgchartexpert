import { useState, useEffect } from "react";
import { subscribeToOrgMembers, seedOrgData } from "../firebase/orgService";

export function useOrgData() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let unsubscribe;

    async function init() {
      try {
        // Seed initial data if empty
        await seedOrgData();

        // Subscribe to real-time updates
        unsubscribe = subscribeToOrgMembers((data) => {
          setMembers(data);
          setLoading(false);
        });
      } catch (err) {
        console.error("Error loading org data:", err);
        setError(err.message);
        setLoading(false);
      }
    }

    init();
    return () => unsubscribe && unsubscribe();
  }, []);

  return { members, loading, error };
}
