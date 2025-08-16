import {
  Box,
  Text,
  Badge,
  Button,
  HStack,
  VStack,
  useColorModeValue
} from '@chakra-ui/react'

const TaskCard = ({ title, description, status, priority, onComplete }) => {
  const cardBg = useColorModeValue('white', 'gray.700')
  const borderColor = useColorModeValue('gray.200', 'gray.600')

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'in-progress':
        return 'blue'
      case 'pending':
        return 'yellow'
      default:
        return 'gray'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'red'
      case 'medium':
        return 'orange'
      case 'low':
        return 'green'
      default:
        return 'gray'
    }
  }

  return (
    <Box
      bg={cardBg}
      p={4}
      borderRadius="md"
      border="1px"
      borderColor={borderColor}
      shadow="sm"
      _hover={{ shadow: 'md' }}
      transition="all 0.2s"
    >
      <VStack align="start" spacing={3}>
        <HStack justify="space-between" w="full">
          <Text fontWeight="bold" fontSize="lg">
            {title}
          </Text>
          <HStack>
            <Badge colorScheme={getPriorityColor(priority)}>
              {priority}
            </Badge>
            <Badge colorScheme={getStatusColor(status)}>
              {status}
            </Badge>
          </HStack>
        </HStack>
        
        <Text color="gray.600" fontSize="sm">
          {description}
        </Text>
        
        <Button
          size="sm"
          colorScheme="teal"
          onClick={onComplete}
          isDisabled={status === 'completed'}
        >
          {status === 'completed' ? 'Completed' : 'Mark Complete'}
        </Button>
      </VStack>
    </Box>
  )
}

export default TaskCard
