import SharedUi from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>Hello! I am app 1</SharedUi>
    </main>
  );
}
