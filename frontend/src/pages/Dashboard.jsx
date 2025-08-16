import { useState, useMemo, useEffect } from 'react'
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
import { CheckIcon, AddIcon, DeleteIcon } from '@chakra-ui/icons'
import Layout from '../components/Layout'
import { useAuth } from '../contexts/AuthContext';
import { taskApi } from '../utils/taskApi';

function Dashboard() {
  const { token } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  const [newTask, setNewTask] = useState({
  title: '',
  description: '',
  priority: 'medium',
  status: 'pending'
  })

  const [editTask, setEditTask] = useState({
    _id: '',
    title: '',
    description: '',
    priority: 'medium',
    status: 'pending'
  })

  const [filters, setFilters] = useState({
    status: 'all',
    priority: 'all',
    search: ''
  })

  const { isOpen, onOpen, onClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()

  const toast = useToast()

  // Fetch tasks from backend (with filter)
  const fetchTasks = async (filter = {}) => {
    setLoading(true);
    try {
      const data = await taskApi.getFilteredTasks(filter, token);
      setTasks(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      setTasks([]);
      toast({
        title: "Error",
        description: "Failed to fetch tasks",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
    setLoading(false);
  };

  // Initial fetch and refetch on filter change
  useEffect(() => {
    if (token) fetchTasks(filters);
  }, [token, filters]);

  // Tasks are already filtered from backend
  const filteredTasks = tasks;

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

  const handleCompleteTask = async (taskId) => {
    try {
      await taskApi.updateTask(taskId, { status: 'completed' }, token);
      
      toast({
        title: "Task completed!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchTasks(filters); // Refresh tasks from backend
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const handleDeleteTask = async (taskId) => {
    try {
      await taskApi.deleteTask(taskId, token);
      
      toast({
        title: "Task deleted!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchTasks(filters); // Refresh tasks from backend
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const handleEditTask = (task) => {
    setEditTask({
      _id: task._id || task.id,
      title: task.title,
      description: task.description,
      priority: task.priority,
      status: task.status
    })
    onEditOpen()
  }

  const handleUpdateTask = async () => {
    if (!editTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await taskApi.updateTask(editTask._id, {
        title: editTask.title,
        description: editTask.description,
        priority: editTask.priority,
        status: editTask.status
      }, token);
      
      onEditClose();
      toast({
        title: "Task updated!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchTasks(filters); // Refresh tasks from backend
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
  }

  const handleAddTask = async () => {
    if (!newTask.title.trim()) {
      toast({
        title: "Error",
        description: "Please enter a task title",
        status: "error",
        duration: 2000,
        isClosable: true,
      });
      return;
    }

    try {
      await taskApi.createTask(newTask, token);
      
      setNewTask({ title: '', description: '', priority: 'medium', status: 'pending' });
      onClose();
      toast({
        title: "Task added!",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
      fetchTasks(filters); // Refresh tasks
    } catch (error) {
      toast({
        title: "Error",
        description: error.message,
        status: "error",
        duration: 2000,
        isClosable: true,
      });
    }
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
                  <Tr 
                    key={task._id || task.id} 
                    cursor="pointer" 
                    _hover={{ bg: "gray.50" }}
                    onClick={() => handleEditTask(task)}
                  >
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
                      <HStack spacing={2}>
                        {task.status !== 'completed' && (
                          <IconButton
                            icon={<CheckIcon />}
                            size="sm"
                            colorScheme="green"
                            onClick={(e) => {
                              e.stopPropagation(); // Prevent row click
                              handleCompleteTask(task._id || task.id);
                            }}
                            aria-label="Complete task"
                          />
                        )}
                        <IconButton
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent row click
                            handleDeleteTask(task._id || task.id);
                          }}
                          aria-label="Delete task"
                        />
                      </HStack>
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
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={newTask.status}
                  onChange={(e) => setNewTask({...newTask, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
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

      {/* Edit Task Modal */}
      <Modal isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Task</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Title</FormLabel>
                <Input
                  value={editTask.title}
                  onChange={(e) => setEditTask({...editTask, title: e.target.value})}
                  placeholder="Enter task title..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={editTask.description}
                  onChange={(e) => setEditTask({...editTask, description: e.target.value})}
                  placeholder="Enter task description..."
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Priority</FormLabel>
                <Select
                  value={editTask.priority}
                  onChange={(e) => setEditTask({...editTask, priority: e.target.value})}
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                </Select>
              </FormControl>
              
              <FormControl>
                <FormLabel>Status</FormLabel>
                <Select
                  value={editTask.status}
                  onChange={(e) => setEditTask({...editTask, status: e.target.value})}
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </Select>
              </FormControl>
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="teal" mr={3} onClick={handleUpdateTask}>
              Update Task
            </Button>
            <Button variant="ghost" onClick={onEditClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Layout>
  )
}

export default Dashboard
