import Image from "next/image";
import EditorComponent from "./component/editor-component";
import Link from "next/link";

export default function Home() {
  return (
    <main className="flex flex-col min-h-screen" >
      <div className="flex-grow p-24">
        <EditorComponent />
      </div>
      <footer className="flex justify-center items-center w-full py-4 ">
        Made with ❤️ by <Link href={"https://www.youtube.com/@CodingWithMrM"}
          target="_blank"
        >
          Coding With Mr.M
        </Link>
      </footer>
    </main >

  );
}
