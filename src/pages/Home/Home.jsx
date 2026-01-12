import Header from '../../components/Header/Header.jsx'
import Hero from '../../components/Hero/Hero.jsx'
import HelpCards from '../../components/HelpCards/HelpCards.jsx'
import WhenToAct from '../../components/WhenToAct/WhenToAct.jsx'
import Process from '../../components/Process/Process.jsx'
import GroupProgram from '../../components/GroupProgram/GroupProgram.jsx'
import IndividualProgram from '../../components/IndividualProgram/IndividualProgram.jsx'
import Footer from '../../components/Footer/Footer.jsx'

export default function Home() {
  return (
    <>
      <Header />

      <main>
        <Hero />
        <HelpCards />
        <WhenToAct />
        <Process />
        <GroupProgram />
        <IndividualProgram />
      </main>

      <Footer />
    </>
  )
}
