"use client"
import {
    QueryClient,
    QueryClientProvider,
} from '@tanstack/react-query'
import { ReactNode } from 'react'
import { Provider } from 'react-redux'
import { PersistGate } from 'redux-persist/integration/react'
import { store, persistor } from '../store'
import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
import Navigation from '@/components/Navigation'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
        }
    }
})

interface ReactQueryClientProps {
    children: ReactNode
}

function ReactQueryClient ({ children }: ReactQueryClientProps) {
    return (
        <QueryClientProvider client={queryClient}>
            <Provider store={store}>
                <PersistGate loading={<div>Loading...</div>} persistor={persistor}>
                    <CacheProvider>
                        <ChakraProvider>
                            <div className='flex h-full flex-col w-screen'>
                                <Navigation />
                                <div className='lg:px-10 px-4 w-sreen flex-1 overflow-scroll'>
                                    {children}
                                </div>
                            </div>
                        </ChakraProvider>
                    </CacheProvider>
                </PersistGate>
            </Provider>
        </QueryClientProvider>
    )
}

export default ReactQueryClient