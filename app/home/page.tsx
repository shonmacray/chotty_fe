import Chat from "@/components/containers/Chat";
import Groups from "@/components/containers/Groups";

export default function Home(): JSX.Element {
  return (
    <main className="flex">
      <div className="w-6/12">
        <Groups />
      </div>
      <div className="w-6/12 bg-slate-300">
        <Chat />
      </div>
    </main>
  );
}
