import {
  collection,
  doc,
  addDoc,
  updateDoc,
  getDocs,
  writeBatch,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

function chartsCol(userId) {
  return collection(db, "users", userId, "charts");
}

function chartDoc(userId, chartId) {
  return doc(db, "users", userId, "charts", chartId);
}

// Real-time listener for user's charts
export function subscribeToCharts(userId, callback, onError) {
  const q = query(chartsCol(userId), orderBy("updatedAt", "desc"));
  return onSnapshot(
    q,
    async (snapshot) => {
      const charts = [];
      for (const d of snapshot.docs) {
        const data = d.data();
        // Get member count
        try {
          const membersSnap = await getDocs(
            collection(db, "users", userId, "charts", d.id, "members")
          );
          charts.push({
            id: d.id,
            ...data,
            memberCount: membersSnap.size,
          });
        } catch {
          charts.push({
            id: d.id,
            ...data,
            memberCount: 0,
          });
        }
      }
      callback(charts);
    },
    (err) => {
      console.error("subscribeToCharts error:", err);
      if (onError) onError(err);
    }
  );
}

// Create a new chart
export async function createChart(userId, { name, unit }) {
  const docRef = await addDoc(chartsCol(userId), {
    name,
    unit,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update chart metadata (name, unit)
export async function updateChart(userId, chartId, updates) {
  const ref = chartDoc(userId, chartId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Delete a chart and all its members
export async function deleteChart(userId, chartId) {
  const membersSnap = await getDocs(
    collection(db, "users", userId, "charts", chartId, "members")
  );

  const batch = writeBatch(db);
  membersSnap.docs.forEach((d) => batch.delete(d.ref));
  batch.delete(chartDoc(userId, chartId));
  await batch.commit();
}
