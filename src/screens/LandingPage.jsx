import Nav from '../components/Nav'
import Footer from '../components/Footer'
import Hero from './landing/Hero'
import WhyAsking from './landing/WhyAsking'
import SubmitSection from './landing/SubmitSection'
import Timeline from './landing/Timeline'
import Resources from './landing/Resources'

// The ported v1.0 landing page. `onSubmit` opens the submission chooser.
export default function LandingPage({ onSubmit }) {
  return (
    <>
      <Nav />
      <Hero />
      <WhyAsking />
      <SubmitSection onSubmit={onSubmit} />
      <Timeline />
      <Resources />
      <Footer />
    </>
  )
}
