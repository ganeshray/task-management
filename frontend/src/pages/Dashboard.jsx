import { useState, useMemo } from 'react'
import {
  Box,
  Button,
  Heading,
  VStack,
  HStack,
  Text,
  Card,
  CardBody,
  Badge,
  Input,
  FormControl,
  FormLabel,
  Select,
  Textarea,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  IconButton,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure
} from '@chakra-ui/react'
import { CheckIcon, AddIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout'

function Dashboard() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Setup React Project",
      description: "Create a new React application with Chakra UI",
      status: "completed",
      priority: "high"
    },
    {
      id: 2,
      title: "Design UI Components",
      description: "Create reusable components with Chakra UI",
      status: "in-progress",
      priority: "medium"
    },
    {
      id: 3,
      title: "Add Dark Mode",
      description: "Implement dark/light mode toggle",
      status: "pending",
      priority: "low"
    }
  ])

  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 'medium'
  })

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  })

  const { isOpen, onOpen, onClose } = useDisclosure()

  const toast = useToast()

  // Filtered tasks based on current filters
  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = filters.status === 'all' || task.status === filters.status
      const matchesPriority = filters.priority === 'all' || task.priority === filters.priority
      const matchesSearch = filters.search === '' || 
        task.title.toLowerCase().includes(filters.search.toLowerCase()) ||
        task.description.toLowerCase().includes(filters.search.toLowerCase())
      
      return matchesStatus && matchesPriority && matchesSearch
    })
  }, [tasks, filters])

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

  const handleCompleteTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, status: 'completed' }
        : task
    ))
    
    toast({
      title: "Task completed!",
      status: "success",
      duration: 2000,
      isClosable: true,
    })
  }

  const handleAddTask = () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        status: "error",
        duration: 2000,
        isClosable: true,
      })
      return
    }

    const task = {
      id: tasks.length + 1,
      title: newTask.title,
      description: newTask.description,
      status: 'pending',
      priority: newTask.priority
    }

    setTasks([...tasks, task])
    setNewTask({ title: '', description: '', priority: 'medium' })
    onClose() // Close the modal
    
    toast({
      title: "Task added!",
      status: "success",
      duration: 2000,
      isClosable: true,
    })
  }

  return (
    <Layout title="Task Management App">
      <Box maxW="1200px" mx="auto" px={4}>
        <VStack spacing={8} align="stretch">
          {/* Add New Task Button */}
          <Box textAlign="center">
            <Button 
              leftIcon={<AddIcon />} 
              colorScheme="teal" 
              onClick={onOpen}
              size="lg"
            >
              Add New Task
            </Button>
          </Box>

        {/* Filters */}
        <Card>
          <CardBody>
            <Flex direction={{ base: 'column', md: 'row' }} gap={4} align="end">
              <FormControl maxW="200px">
                <FormLabel>Search Tasks</FormLabel>
                <Input
                  placeholder="Search by title or description..."
                  value={filters.search}
                  onChange={(e) => setFilters({...filters, search: e.target.value})}
                />
              </FormControl>
              
              <FormControl maxW="150px">
                <FormLabel>Status</FormLabel>
                <Select
                  value={filters.status}
                  onChange={(e) => setFilters({...filters, status: e.target.value})}
                >
                  <option value="all">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormControl>
              
              <FormControl maxW="150px">
                <FormLabel>Priority</FormLabel>
                <Select
                  value={filters.priority}
                  onChange={(e) => setFilters({...filters, priority: e.target.value})}
                >
                  <option value="all">All Priority</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
            </Flex>
          </CardBody>
        </Card>

        {/* Tasks Table */}
        <Box>
          <Flex align="center" mb={4}>
            <Heading as="h3" size="md" color="teal.600">
              Your Tasks ({filteredTasks.length})
            </Heading>
          </Flex>
          
          <TableContainer>
            <Table variant="simple">
              <Thead>
                <Tr>
                  <Th>Title</Th>
                  <Th>Description</Th>
                  <Th>Status</Th>
                  <Th>Priority</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTasks.map(task => (
                  <Tr key={task.id}>
                    <Td fontWeight="semibold">{task.title}</Td>
                    <Td maxW="300px" isTruncated>{task.description}</Td>
                    <Td>
                      <Badge colorScheme={getStatusColor(task.status)}>
                        {task.status.replace('-', ' ')}
                      </Badge>
                    </Td>
                    <Td>
                      <Badge colorScheme={getPriorityColor(task.priority)}>
                        {task.priority}
                      </Badge>
                    </Td>
                    <Td>
                      {task.status !== 'completed' && (
                        <IconButton
                          icon={<CheckIcon />}
                          size="sm"
                          colorScheme="green"
                          onClick={() => handleCompleteTask(task.id)}
                          aria-label="Complete task"
                        />
                      )}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
          
          {filteredTasks.length === 0 && (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">No tasks found matching your filters.</Text>
            </Box>
          )}
        </Box>
      </VStack>
      </Box>

      {/* Add Task Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add New Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={newTask.title}
                  onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={newTask.description}
                  onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                  placeholder="Enter task description..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={newTask.priority}
                  onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleAddTask}>
              Add Task
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

export default Dashboard
