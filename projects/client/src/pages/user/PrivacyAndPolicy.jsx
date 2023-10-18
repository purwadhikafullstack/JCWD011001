import { Box } from '@chakra-ui/react'
import React from 'react'
import Navbar from '../../components/landing/Navbar'
import PrivacyAndPolicyContent from '../../components/user/PrivacyAndPolicyContent'
import Footer from '../../components/landing/Footer'

const PrivacyAndPolicy = () => {
  return (
    <Box>
        <Navbar />
        <PrivacyAndPolicyContent />
        <Footer />
    </Box>
  )
}

export default PrivacyAndPolicy