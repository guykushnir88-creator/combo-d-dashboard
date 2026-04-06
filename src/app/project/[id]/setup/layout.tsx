import { getProject } from "@/lib/data";

interface LayoutProps {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const project = await getProject(id);
  const name = project?.name || id;
  return {
    title: `${name} Setup`,
  };
}

export default function SetupLayout({ children }: LayoutProps) {
  return children;
}
