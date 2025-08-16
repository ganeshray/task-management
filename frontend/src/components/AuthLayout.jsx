import React from 'react'
import {
  Box,
  useColorModeValue,
  IconButton,
  useColorMode,
  VStack,
  Flex,
  Container
} from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'

const AuthLayout = ({ children }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('gray.50', 'gray.900')

  return (
    <Box bg={bg} minH="100vh" position="center" w="60vh" overflow="hidden">
      {/* Theme Toggle Button */}
      <Box position="absolute" top={{ base: 2, sm: 4 }} right={{ base: 2, sm: 4 }} zIndex={10}>
        <IconButton
          aria-label="Toggle color mode"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          variant="ghost"
          size={{ base: "md", sm: "lg" }}
        />
      </Box>

      {/* Content */}
      <Flex 
        align="center" 
        justify="center" 
        minH="100vh" 
        w="100%" 
        px={{ base: 2, sm: 4, md: 6, lg: 8 }}
        py={{ base: 4, sm: 6, md: 8 }}
      >
        <Box 
          w="100%" 
          maxW={{ base: "95%", xs: "400px", sm: "450px", md: "500px", lg: "550px" }}
        >
          {children}
        </Box>
      </Flex>
    </Box>
  )
}

export default AuthLayout
