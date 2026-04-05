import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data");

export async function getProjects() {
  const raw = await fs.readFile(path.join(dataDir, "projects.json"), "utf-8");
  return JSON.parse(raw);
}

export async function getProject(id: string) {
  const projects = await getProjects();
  return projects.find((p: { id: string }) => p.id === id) || null;
}

export async function getAgents(projectId: string) {
  try {
    const raw = await fs.readFile(
      path.join(dataDir, projectId, "agents.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getKnowledgeBase(projectId: string) {
  try {
    const raw = await fs.readFile(
      path.join(dataDir, projectId, "knowledge-base.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getGovernance(projectId: string) {
  try {
    const raw = await fs.readFile(
      path.join(dataDir, projectId, "governance.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return [];
  }
}

export async function getAssessment(projectId: string) {
  try {
    const raw = await fs.readFile(
      path.join(dataDir, projectId, "assessment.json"),
      "utf-8"
    );
    return JSON.parse(raw);
  } catch {
    return null;
  }
}
