import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Text,
  Link,
  Alert,
  AlertIcon,
  useColorModeValue,
  Heading,
  InputGroup,
  InputRightElement,
  IconButton
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const { login } = useAuth()
  const navigate = useNavigate()
  const bg = useColorModeValue('white', 'gray.800')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      await login(formData.email, formData.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout>
      <Box
        bg={bg}
        p={{ base: 4, sm: 6, md: 8, lg: 10 }}
        borderRadius={{ base: "lg", sm: "xl" }}
        borderWidth="1px"
        borderColor={borderColor}
        boxShadow={{ base: "lg", sm: "xl", md: "2xl" }}
        w="100%"
        maxW="100%"
      >
        <VStack spacing={{ base: 4, sm: 5, md: 6 }}>
          <Heading 
            as="h1" 
            size={{ base: "lg", sm: "xl", md: "2xl" }} 
            textAlign="center" 
            color="teal.500"
          >
            Sign In
          </Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit} width="100%">
            <VStack spacing={{ base: 4, sm: 5, md: 6 }}>
              <FormControl isRequired>
                <FormLabel fontSize={{ base: "sm", sm: "md", md: "lg" }}>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  focusBorderColor="teal.400"
                  size={{ base: "lg", sm: "lg", md: "lg" }}
                  fontSize={{ base: "md", sm: "md", md: "lg" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={{ base: "sm", sm: "md", md: "lg" }}>Password</FormLabel>
                <InputGroup size={{ base: "lg", sm: "lg", md: "lg" }}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    focusBorderColor="teal.400"
                    fontSize={{ base: "md", sm: "md", md: "lg" }}
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size={{ base: "sm", sm: "md" }}
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="100%"
                size={{ base: "lg", sm: "lg", md: "lg" }}
                fontSize={{ base: "md", sm: "lg", md: "xl" }}
                py={{ base: 6, sm: 7, md: 8 }}
                isLoading={isLoading}
                loadingText="Signing in..."
                mt={2}
              >
                Sign In
              </Button>
            </VStack>
          </Box>

          <VStack spacing={{ base: 3, sm: 4, md: 5 }}>
            <Link 
              as={RouterLink} 
              to="/forgot-password" 
              color="teal.500" 
              fontSize={{ base: "sm", sm: "md", md: "lg" }}
            >
              Forgot your password?
            </Link>
            <Text 
              fontSize={{ base: "sm", sm: "md", md: "lg" }} 
              color="gray.600" 
              textAlign="center"
            >
              Don't have an account?{' '}
              <Link 
                as={RouterLink} 
                to="/register" 
                color="teal.500" 
                fontWeight="medium"
              >
                Sign up here
              </Link>
            </Text>
          </VStack>
        </VStack>
      </Box>
    </AuthLayout>
  )
}

export default Login
