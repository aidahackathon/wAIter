"use server";
import fs from "fs";
import path from "path";

const DB_PATH = process.env.NODE_ENV === "production" 
  ? "/tmp/incidents_db.json" 
  : path.join(process.cwd(), "incidents_db.json");

if (!fs.existsSync(DB_PATH)) {
  fs.writeFileSync(DB_PATH, JSON.stringify([]), "utf-8");
}

export async function getIncidents() {
  try {
    const data = fs.readFileSync(DB_PATH, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

export async function saveIncident(incident: any) {
  const incidents = await getIncidents();
  incidents.unshift(incident);
  fs.writeFileSync(DB_PATH, JSON.stringify(incidents, null, 2), "utf-8");
  return { success: true };
}

export async function updateIncidentStatus(id: string, status: string) {
  const incidents = await getIncidents();
  const updated = incidents.map((inc: any) => 
    inc.id === id ? { ...inc, status } : inc
  );
  fs.writeFileSync(DB_PATH, JSON.stringify(updated, null, 2), "utf-8");
  return { success: true };
}

export async function clearIncidents() {
  fs.writeFileSync(DB_PATH, JSON.stringify([]), "utf-8");
  return { success: true };
}

