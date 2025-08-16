import {
  Box,
  Container,
  Heading,
  Flex,
  Spacer,
  IconButton,
  useColorMode,
  useColorModeValue,
  Text,
  HStack,
  Link,
  VStack
} from '@chakra-ui/react'
import { MoonIcon, SunIcon, ExternalLinkIcon } from '@chakra-ui/icons'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

const Layout = ({ children, title = "Task Management" }) => {
  const { colorMode, toggleColorMode } = useColorMode()
  const { logout } = useAuth()
  const navigate = useNavigate()
  const bg = useColorModeValue('gray.50', 'gray.900')
  const headerBg = useColorModeValue('white', 'gray.800')
  const footerBg = useColorModeValue('gray.100', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.700')
  const currentYear = new Date().getFullYear()

  const handleSignOut = () => {
    logout()
    navigate('/login')
  }

  return (
    <VStack spacing={0} minH="100vh" w="100vw">
      <Box bg={bg} flex="1" w="100%">
        {/* Header */}
        <Box bg={headerBg} borderBottom="1px" borderColor={borderColor} py={4}>
          <Container maxW="100%" px={6}>
            <Flex align="center">
              <HStack spacing={4}>
                <Heading as="h1" size="lg" color="teal.500">
                  {title}
                </Heading>
              </HStack>
              <Spacer />
              <HStack spacing={2}>
                <IconButton
                  aria-label="Toggle color mode"
                  icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                  onClick={toggleColorMode}
                  variant="ghost"
                  size="lg"
                />
                <IconButton
                  aria-label="Sign out"
                  icon={<ExternalLinkIcon />}
                  onClick={handleSignOut}
                  variant="ghost"
                  size="lg"
                  colorScheme="red"
                />
              </HStack>
            </Flex>
          </Container>
        </Box>

        {/* Main Content */}
        <Container maxW="100%" px={6} py={8}>
          {children}
        </Container>
      </Box>

      {/* Footer */}
      <Box bg={footerBg} borderTop="1px" borderColor={borderColor} py={6} w="100%">
        <Container maxW="100%" px={6}>
          <Flex direction={{ base: 'column', md: 'row' }} align="center" justify="space-between">
            <Text fontSize="sm" color="gray.600">
              © {currentYear} Task Management App. All rights reserved.
            </Text>
            <HStack spacing={4} mt={{ base: 2, md: 0 }}>
              <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'teal.500' }}>
                Privacy Policy
              </Link>
              <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'teal.500' }}>
                Terms of Service
              </Link>
              <Link href="#" fontSize="sm" color="gray.600" _hover={{ color: 'teal.500' }}>
                Contact
              </Link>
            </HStack>
          </Flex>
        </Container>
      </Box>
    </VStack>
  )
}

export default Layout
