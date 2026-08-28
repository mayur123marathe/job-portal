import Navbar from "../components/Navbar"
import Hero from "../components/Hero"
import HowItWorks from "../components/HowItWorks"
import Features from "../components/Features"
import ForCandidates from "../components/ForCandidates"
import ForEmployers from "../components/ForEmployers"
import Stats from "../components/Stats"
import CTA from "../components/CTA"
import Footer from "../components/Footer"

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <Navbar />

      {/* Main Content */}
      <main>
        {/* Hero Section */}
        <Hero />

        {/* How It Works */}
        <HowItWorks />

        {/* Key Features */}
        <Features />

        {/* For Job Seekers */}
        <ForCandidates />

        {/* For Employers */}
        <ForEmployers />

        {/* Trust / Stats */}
        <Stats />

        {/* Final CTA */}
        <CTA />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  )
}
