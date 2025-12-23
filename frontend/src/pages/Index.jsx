import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import RentalForm from "../components/RentalForm";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <About />
        <Pricing />
        <RentalForm />
        
        <Contact />
      </main>
      <Footer />
    </div>
  );
}

export default Index
