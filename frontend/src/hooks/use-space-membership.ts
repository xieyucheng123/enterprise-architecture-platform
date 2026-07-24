import { useQuery } from '@apollo/client/react'
import { gql } from '@apollo/client'
import { useAuthStore } from '@/stores/auth'

const GET_MY_MEMBERSHIP = gql`
  query GetMyMembership($spaceId: String!, $userId: String!) {
    spaceMembers(filters: { spaceId: { eq: $spaceId }, userId: { eq: $userId } }) {
      nodes {
        role
      }
    }
  }
`

interface MembershipData {
  spaceMembers: {
    nodes: { role: string }[]
  }
}

// Returns the current user's role in the given space (`owner` | `editor` |
// null) plus a `canEdit` convenience flag. Anonymous users and non-members
// resolve to `null` / `false`.
export function useSpaceMembership(spaceId: string | undefined) {
  const user = useAuthStore((s) => s.user)
  const { data, loading } = useQuery<MembershipData>(GET_MY_MEMBERSHIP, {
    variables: { spaceId, userId: user?.id },
    skip: !spaceId || !user?.id,
  })

  const role = data?.spaceMembers?.nodes?.[0]?.role ?? null
  const canEdit = role === 'owner' || role === 'editor'

  return { role, canEdit, loading }
}