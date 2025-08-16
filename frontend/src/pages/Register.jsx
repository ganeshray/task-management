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
  IconButton,
  Checkbox,
  HStack
} from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import { Link as RouterLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import AuthLayout from '../components/AuthLayout'

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const { register } = useAuth()
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

  const validateForm = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill in all fields')
      return false
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long')
      return false
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return false
    }

    if (!acceptTerms) {
      setError('Please accept the terms and conditions')
      return false
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      setError('Please enter a valid email address')
      return false
    }

    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    if (!validateForm()) {
      setIsLoading(false)
      return
    }

    try {
      await register(formData)
      setSuccess('Account created successfully! Redirecting to login...')
      
      // Reset form
      setFormData({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
      })
      setAcceptTerms(false)
      
      // Redirect to login after a short delay
      setTimeout(() => {
        navigate('/login')
      }, 2000)
      
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
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
            Create Account
          </Heading>

          {error && (
            <Alert status="error" borderRadius="md">
              <AlertIcon />
              {error}
            </Alert>
          )}

          {success && (
            <Alert status="success" borderRadius="md">
              <AlertIcon />
              {success}
            </Alert>
          )}

          <Box as="form" onSubmit={handleSubmit} width="100%">
            <VStack spacing={{ base: 3, sm: 4 }}>
              <HStack 
                spacing={{ base: 2, sm: 4 }} 
                width="100%" 
                flexDirection={{ base: "column", sm: "row" }}
              >
                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", sm: "md" }}>First Name</FormLabel>
                  <Input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="First name"
                    focusBorderColor="teal.400"
                    size={{ base: "md", sm: "lg" }}
                  />
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize={{ base: "sm", sm: "md" }}>Last Name</FormLabel>
                  <Input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Last name"
                    focusBorderColor="teal.400"
                    size={{ base: "md", sm: "lg" }}
                  />
                </FormControl>
              </HStack>

              <FormControl isRequired>
                <FormLabel fontSize={{ base: "sm", sm: "md" }}>Email</FormLabel>
                <Input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Enter your email"
                  focusBorderColor="teal.400"
                  size={{ base: "md", sm: "lg" }}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={{ base: "sm", sm: "md" }}>Password</FormLabel>
                <InputGroup size={{ base: "md", sm: "lg" }}>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    focusBorderColor="teal.400"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                      icon={showPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Password must be at least 6 characters long
                </Text>
              </FormControl>

              <FormControl isRequired>
                <FormLabel fontSize={{ base: "sm", sm: "md" }}>Confirm Password</FormLabel>
                <InputGroup size={{ base: "md", sm: "lg" }}>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm your password"
                    focusBorderColor="teal.400"
                  />
                  <InputRightElement>
                    <IconButton
                      aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                      icon={showConfirmPassword ? <ViewOffIcon /> : <ViewIcon />}
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="ghost"
                      size="sm"
                    />
                  </InputRightElement>
                </InputGroup>
              </FormControl>

              <FormControl>
                <Checkbox
                  isChecked={acceptTerms}
                  onChange={(e) => setAcceptTerms(e.target.checked)}
                  colorScheme="teal"
                  size={{ base: "sm", sm: "md" }}
                >
                  <Text fontSize={{ base: "xs", sm: "sm" }}>
                    I agree to the{' '}
                    <Link color="teal.500" href="#" textDecoration="underline">
                      Terms of Service
                    </Link>{' '}
                    and{' '}
                    <Link color="teal.500" href="#" textDecoration="underline">
                      Privacy Policy
                    </Link>
                  </Text>
                </Checkbox>
              </FormControl>

              <Button
                type="submit"
                colorScheme="teal"
                width="100%"
                size={{ base: "md", sm: "lg" }}
                isLoading={isLoading}
                loadingText="Creating account..."
                mt={2}
              >
                Create Account
              </Button>
            </VStack>
          </Box>

          <Text 
            fontSize={{ base: "xs", sm: "sm" }} 
            color="gray.600" 
            textAlign="center"
          >
            Already have an account?{' '}
            <Link 
              as={RouterLink} 
              to="/login" 
              color="teal.500" 
              fontWeight="medium"
            >
              Sign in here
            </Link>
          </Text>
        </VStack>
      </Box>
    </AuthLayout>
  )
}

export default Register
