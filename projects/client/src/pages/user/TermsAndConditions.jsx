import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../../components/landing/Navbar'
import Footer from '../../components/landing/Footer'
import TermsAndConditionsContent from '../../components/user/TermsAndConditionsContent'

const TermsAndConditions = () => {
  return (
    <Box>
        <Navbar />
        <TermsAndConditionsContent />
        <Footer />
    </Box>
  )
}

export default TermsAndConditions