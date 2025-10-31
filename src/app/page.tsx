import Hero from "@/components/Hero/Hero";
import Steps from "@/components/Steps/Steps";
import Industries from "@/components/Industries/Industries";
import ExchangeForms from "@/components/ExchangeForms/ExchangeForms"; // ⬅️ nuevo
import Footer from "@/components/Footer/Footer";

export default function HomePage() {
  return (
    <main>
      <Hero />
      <Steps />
      <Industries />
      <ExchangeForms /> {/* ⬅️ formulario CANJEA / FORMÁ PARTE */}
        <Footer />
    </main>
  );
}
