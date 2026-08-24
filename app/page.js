import World from "@/components/world";
import Politics from "@/components/politics";
import Technology from "@/components/technology";
import Business from "@/components/business";
import Science from "@/components/science";
import Culture from "@/components/culture";

export default function Home() {
  return (
    <main>
      <World />
      <Politics />
      <Technology />
      <Business />
      <Science />
      <Culture />
    </main>
  );
}