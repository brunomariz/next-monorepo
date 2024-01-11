import { SharedUi } from "@next-monorepo/ui";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <SharedUi>
        <p className="bg-myGreen p-5 rounded-md">
          Hello! I am app 2 and now I use the shared theme!
        </p>
      </SharedUi>
    </main>
  );
}
