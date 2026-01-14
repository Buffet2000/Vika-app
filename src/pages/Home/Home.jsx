import Hero from '../../components/Hero/Hero.jsx'
import HelpCards from '../../components/HelpCards/HelpCards.jsx'
import WhenToAct from '../../components/WhenToAct/WhenToAct.jsx'
import Process from '../../components/Process/Process.jsx'
import GroupProgram from '../../components/GroupProgram/GroupProgram.jsx'
import IndividualProgram from '../../components/IndividualProgram/IndividualProgram.jsx'

export default function Home() {
  return (
    <>
      <Hero />
      <HelpCards />
      <WhenToAct />
      <Process />
      <GroupProgram />
      <IndividualProgram />
    </>
  )
}
