import Chat from "@/components/containers/Chat";
import Groups from "@/components/containers/Groups";

export default function Home(): JSX.Element {
  return (
    <main className="flex w-8/12 mx-auto shadow-sm">
      <div className="w-4/12">
        <Groups />
      </div>
      <div className="flex-1">
        <Chat />
      </div>
    </main>
  );
}
