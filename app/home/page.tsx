import Chat from "@/components/containers/Chat";
import Groups from "@/components/containers/Groups";

export default function Home(): JSX.Element {
  return (
    <main className="lg:flex w-11/12 lg:w-8/12 xl:w-7/12 mx-auto py-4 h-screen gap-4">
      <div className="w-full hidden lg:block lg:w-3/12 shadow-md rounded-lg overflow-hidden">
        <Groups />
      </div>
      <div className="flex-1 h-full shadow-md rounded-lg overflow-hidden">
        <Chat />
      </div>
    </main>
  );
}
