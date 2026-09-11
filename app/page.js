import World from "@/components/world";
import Politics from "@/components/politics";
import Finance from "@/components/finance";
import Business from "@/components/business";
import US from "@/components/us";
import Culture from "@/components/culture";

export default function Home() {
  return (
    <main>
      <World />
      <Politics />
      <Finance />
      <Business />
      <US />
      <Culture />
    </main>
  );
}