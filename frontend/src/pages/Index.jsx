import { useLocation } from "react-router-dom";
import About from "../components/About";
import Contact from "../components/Contact";
import Footer from "../components/Footer";
import Header from "../components/Header";
import Hero from "../components/Hero";
import Pricing from "../components/Pricing";
import { useEffect } from "react";
import FeaturedBikes from "../components/FeaturedBikes";
import FAQ from "../components/FAQ";



const Index = () => {

  const location = useLocation();

  useEffect(() => {
    // Check if we just arrived here from another page with a 'scrollTo' instruction
    if (location.state?.scrollTo) {
      const id = location.state.scrollTo;

      // Small timeout to ensure the DOM is fully loaded before scrolling
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) {
          const y = el.getBoundingClientRect().top + window.pageYOffset - 96;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 100);

      // Clear the state so it doesn't scroll again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <Hero />
        <FeaturedBikes/>
        <About />
        <Pricing />
        {/* <RentalForm /> */}
       <FAQ/>
      </main>
      <Footer />
    </div>
  );
}

export default Index
