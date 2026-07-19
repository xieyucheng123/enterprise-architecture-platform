import { ApolloProvider } from '@apollo/client/react'
import { RouterProvider } from 'react-router-dom'
import { apolloClient } from '@/lib/apollo'
import { router } from '@/router'

export default function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <RouterProvider router={router} />
    </ApolloProvider>
  )
}
