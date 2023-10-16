import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import { FAQContent } from '../../components/user/FAQContent'

const FrequentlyAskedQuestion = () => {
  return (
    <Box>
        <Navbar />
        <FAQContent />
        <Footer />
    </Box>
  )
}

export default FrequentlyAskedQuestion