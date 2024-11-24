import React from 'react'
import Header from '../components/Header'
import Steps from '../components/Steps'
import Description from '../components/Description'
import Generate from '../components/Generate'

const Home = () => {
  return (
    <div>
      <Header/>
      <Steps/>
      <Description/>
      <Generate/>
    </div>
  )
}

export default Home