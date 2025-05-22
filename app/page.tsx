import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-items-center min-h-screen p-8 gap-8 bg-blue-200 text-black">
      <h1 className="font-bold text-[48px] text-center">Welcome to Radio Show</h1>
      <div className="flex flex-col md:flex-row justify-center items-center gap-5 font-bold">
        <Image
          src={"/radio-show.jpg"}
          alt="Image"
          width={640}
          height={640}
          className="max-w-[30%] min-w-[25%] rounded-[100px]"
        />
        <div className="flex flex-col gap-10 text-center">
          <p>Radio Show is a free internet radio platform for everyone.</p>
          <p>Listen to live music, browse archives, or host your own show.</p>
        </div>
      </div>
      <Button className="text-white bg-black hover:bg-gray-800">
        <Link href={"/dashboard"}>Click here to enter</Link>
      </Button>
      
    </div>
  );
}
