import { redirect } from "next/navigation";

export default function Home() {
  // Automatically redirect to the dashboard when the project is run
  redirect('/dashboard');
}
