import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/global.css'
import Hero from './components/Hero/Hero.jsx'
import HelpCards from './components/HelpCards/HelpCards.jsx'
import Process from './components/Process/Process.jsx'
import Pricing from './components/Pricing/Pricing.jsx'
import Booking from './components/Booking/Booking.jsx'
import WhenToAct from './components/WhenToAct/WhenToAct.jsx'
import GroupProgram from './components/GroupProgram/GroupProgram.jsx'
import IndividualProgram from './components/IndividualProgram/IndividualProgram.jsx'
import Header from './components/Header/Header.jsx'
import Footer from './components/Footer/Footer.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Header />
    <Hero />
    <HelpCards />
    <WhenToAct />
    <Process />
    <GroupProgram />
    <IndividualProgram />
    <Footer />
    {/* <Pricing /> */}
    {/*<Booking />
    <Services />
    <BookingForm />
    <Footer /> */}
  </StrictMode>,
)
