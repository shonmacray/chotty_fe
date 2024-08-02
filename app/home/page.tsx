import Chat from "@/components/containers/Chat";
import Groups from "@/components/containers/Groups";

export default function Home(): JSX.Element {
  return (
    <main className="flex w-7/12 mx-auto py-4 h-screen gap-4">
      <div className="w-3/12 shadow-md rounded-lg overflow-hidden">
        <Groups />
      </div>
      <div className="flex-1 shadow-md rounded-lg overflow-hidden">
        <Chat />
      </div>
    </main>
  );
}
