import {
  collection,
  doc,
  getDocs,
  addDoc,
  updateDoc,
  writeBatch,
  query,
  orderBy,
  onSnapshot,
} from "firebase/firestore";
import { db } from "./config";

// Helper to get subcollection paths
function membersCol(userId, chartId) {
  return collection(db, "users", userId, "charts", chartId, "members");
}

function memberDoc(userId, chartId, memberId) {
  return doc(db, "users", userId, "charts", chartId, "members", memberId);
}

// Real-time listener for org members within a chart
export function subscribeToOrgMembers(userId, chartId, callback, onError) {
  const q = query(membersCol(userId, chartId), orderBy("name"));
  return onSnapshot(
    q,
    (snapshot) => {
      const members = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      callback(members);
    },
    (err) => {
      console.error("subscribeToOrgMembers error:", err);
      if (onError) onError(err);
    }
  );
}

// Get all org members (one-time)
export async function getOrgMembers(userId, chartId) {
  const q = query(membersCol(userId, chartId), orderBy("name"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
}

// Add a new member
export async function addOrgMember(userId, chartId, member) {
  const docRef = await addDoc(membersCol(userId, chartId), {
    name: member.name,
    title: member.title,
    supervisorId: member.supervisorId || null,
    department: member.department || "",
    email: member.email || "",
    phone: member.phone || "",
    isVacant: member.isVacant || false,
    isCoordinator: member.isCoordinator || false,
    teamGroup: member.teamGroup || "",
    color: member.color || "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

// Update a member
export async function updateOrgMember(userId, chartId, id, updates) {
  const ref = memberDoc(userId, chartId, id);
  await updateDoc(ref, {
    ...updates,
    updatedAt: new Date().toISOString(),
  });
}

// Delete a member and reassign their reports
export async function deleteOrgMember(userId, chartId, id, members) {
  const batch = writeBatch(db);

  const member = members.find((m) => m.id === id);
  const subordinates = members.filter((m) => m.supervisorId === id);

  for (const sub of subordinates) {
    const subRef = memberDoc(userId, chartId, sub.id);
    batch.update(subRef, {
      supervisorId: member?.supervisorId || null,
      updatedAt: new Date().toISOString(),
    });
  }

  batch.delete(memberDoc(userId, chartId, id));
  await batch.commit();
}

// Change supervisor
export async function changeSupervisor(userId, chartId, memberId, newSupervisorId) {
  const ref = memberDoc(userId, chartId, memberId);
  await updateDoc(ref, {
    supervisorId: newSupervisorId,
    updatedAt: new Date().toISOString(),
  });
}

// Move an entire subtree under a new supervisor
export async function moveSubtree(userId, chartId, memberId, newSupervisorId) {
  const ref = memberDoc(userId, chartId, memberId);
  await updateDoc(ref, {
    supervisorId: newSupervisorId,
    updatedAt: new Date().toISOString(),
  });
}

// Seed sample org chart data into a specific chart
export async function seedOrgData(userId, chartId) {
  const existing = await getDocs(membersCol(userId, chartId));
  if (!existing.empty) return false;

  const batch = writeBatch(db);

  const members = [
    { id: "amy", name: "Amy Jiang", title: "Interim Dean", supervisorId: null, department: "Library Administration", color: "#1B3A5C" },
    { id: "wayne", name: "Wayne Thurston", title: "Executive Assistant & Learning Commons Manager", supervisorId: "amy", department: "Learning Commons", color: "#2E6B8A" },
    { id: "jennifer", name: "Jennifer Cady", title: "Head of Collections & Scholarship", supervisorId: "amy", department: "Collections", color: "#2E6B8A" },
    { id: "keren", name: "Keren Darancette", title: "Archives & Special Collections Librarian", supervisorId: "amy", department: "Archives", color: "#4A90B8" },
    { id: "sabrina", name: "Sabrina Mora", title: "Communications Coordinator & Interim Makerspace Manager", supervisorId: "amy", department: "Communications", color: "#4A90B8" },
    { id: "bil", name: "Bil Owen", title: "LLC Data Analyst", supervisorId: "amy", department: "Data Analytics", color: "#4A90B8" },
    { id: "karen", name: "Karen Beavers", title: "Coordinator, Research & Instruction", supervisorId: "amy", department: "Research & Instruction", color: "#C4956A", isCoordinator: true, teamGroup: "Research & Instruction Team" },
    { id: "law_coord", name: "(Vacant)", title: "Coordinator of Library of Law & Public Admin", supervisorId: "amy", department: "Law Library", color: "#999999", isVacant: true },
    { id: "ben", name: "Ben Mulchin", title: "Circulation Supervisor", supervisorId: "wayne", department: "Circulation", color: "#4A90B8" },
    { id: "matt", name: "Matt Durian", title: "Circulation Supervisor", supervisorId: "wayne", department: "Circulation", color: "#4A90B8" },
    { id: "marissa", name: "Marissa Corona", title: "Weekend Circulation Supervisor", supervisorId: "wayne", department: "Circulation", color: "#4A90B8" },
    { id: "sean", name: "Sean Beslin", title: "Makerspace Manager", supervisorId: "sabrina", department: "Makerspace", color: "#4A90B8" },
    { id: "david", name: "David Austin", title: "Law Library Manager", supervisorId: "law_coord", department: "Law Library", color: "#4A90B8" },
    { id: "linda", name: "Linda Gordon", title: "Research & Instruction Librarian", supervisorId: "amy", department: "Research & Instruction", color: "#C4956A", teamGroup: "Research & Instruction Team" },
    { id: "cathy", name: "Cathy Johnson", title: "Research & Instruction Librarian", supervisorId: "amy", department: "Research & Instruction", color: "#C4956A", teamGroup: "Research & Instruction Team" },
    { id: "liberty", name: "Liberty McCoy", title: "Research & Instruction Librarian", supervisorId: "amy", department: "Research & Instruction", color: "#C4956A", teamGroup: "Research & Instruction Team" },
    { id: "vinaya", name: "Vinaya Tripuraneni", title: "Research & Instruction Librarian", supervisorId: "amy", department: "Research & Instruction", color: "#C4956A", teamGroup: "Research & Instruction Team" },
    { id: "ri_vacant", name: "(Vacant)", title: "Research & Instruction Librarian", supervisorId: "amy", department: "Research & Instruction", color: "#999999", isVacant: true, teamGroup: "Research & Instruction Team" },
  ];

  for (const m of members) {
    const ref = doc(db, "users", userId, "charts", chartId, "members", m.id);
    batch.set(ref, {
      name: m.name,
      title: m.title,
      supervisorId: m.supervisorId,
      department: m.department || "",
      email: m.email || "",
      phone: m.phone || "",
      isVacant: m.isVacant || false,
      isCoordinator: m.isCoordinator || false,
      teamGroup: m.teamGroup || "",
      color: m.color || "",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
  }

  await batch.commit();
  return true;
}
