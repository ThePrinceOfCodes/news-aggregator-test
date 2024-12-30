// CustomToast.tsx
import { Box, HStack, Text, useToast } from "@chakra-ui/react"
import { FaInfo } from 'react-icons/fa'
import { FiCheckCircle } from 'react-icons/fi'
import { BiSolidError } from "react-icons/bi"
import { IoWarning } from "react-icons/io5"

interface ToastOptions {
  title: string
  status: "info" | "warning" | "success" | "error"
  position?: "top-right" | "top-left" | "top" | "bottom" | "bottom-right" | "bottom-left"
  duration?: number
  isClosable?: boolean
  description?: string
}

const iconMap = {
  info: <FaInfo className='text-xl' />,
  success: <FiCheckCircle className='text-xl' />,
  warning: <IoWarning className='text-xl' />,
  error: <BiSolidError className='text-xl' />,
}

export const useCustomToast = () => {
  const toast = useToast()

  const showToast = ({ title, status, duration = 5000, isClosable = true, position = "bottom-right", description }: ToastOptions) => {
    toast({
      duration,
      isClosable,
      position,
      render: () => (
        <Box
          px={5}
          py={3}
          bg={"#fff"}
          boxShadow="md"
          borderRadius="md"
          borderBottomColor={"#018A16"}
          borderBottomWidth={8}
        >
          <HStack color={"#018A16"} spacing={3}>
            {iconMap[status]}
            <Box color={"#018A16"}>
              <Text className='font-semibold text-sm'>{title}</Text>
              {description && <Text className='text-sm'>{description}</Text>}
            </Box>
          </HStack>
        </Box>
      ),
    })
  }

  return showToast
}
