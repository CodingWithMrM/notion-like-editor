import Image from "next/image";
import EditorComponent from "./component/editor-component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col   p-24">
      <EditorComponent />
    </main>
  );
}
