use chrono::Utc;
use shared_common::enums::{SpaceRole, UserRole};
use uuid::Uuid;

use crate::domain::error::DomainError;
use crate::domain::space::entity::{Space, SpaceMember};
use crate::domain::space::repository::{MembershipRepository, SpaceRepository};

/// Application Service for Space: orchestrates space CRUD, membership, and
/// space-level access control (quota + member ACL).
pub struct SpaceService<S: SpaceRepository, M: MembershipRepository> {
    spaces: S,
    members: M,
}

impl<S: SpaceRepository, M: MembershipRepository> SpaceService<S, M> {
    pub fn new(spaces: S, members: M) -> Self {
        Self { spaces, members }
    }

    /// Create a space. The creator becomes its owner. Non-admin users may own
    /// at most one space (quota); admins are unlimited.
    pub async fn create_space(
        &self,
        creator_id: Uuid,
        creator_role: UserRole,
        name: String,
        description: Option<String>,
    ) -> Result<Space, DomainError> {
        if !creator_role.is_admin() {
            let owned = self.spaces.count_owned_by(creator_id).await?;
            if owned >= 1 {
                return Err(DomainError::SpaceQuotaExceeded);
            }
        }

        let now = Utc::now();
        let id = Uuid::now_v7();
        let space = Space::create(id, name, description, now)?;
        let saved = self.spaces.save(&space).await?;

        // Creator becomes owner.
        let member = SpaceMember {
            space_id: saved.id,
            user_id: creator_id,
            role: SpaceRole::Owner,
            created_at: now,
            updated_at: now,
        };
        self.members.add(&member).await?;
        Ok(saved)
    }

    /// Update a space's name/description. Requires owner or admin.
    pub async fn update_space(
        &self,
        space_id: Uuid,
        actor_id: Uuid,
        actor_role: UserRole,
        name: Option<String>,
        description: Option<Option<String>>,
    ) -> Result<Space, DomainError> {
        self.ensure_can_manage(space_id, actor_id, actor_role).await?;
        let mut space = self.spaces.find_by_id(space_id).await?.ok_or(DomainError::SpaceNotFound)?;
        let now = Utc::now();
        if let Some(n) = name {
            space.rename(n, now)?;
        }
        if let Some(d) = description {
            space.set_description(d, now);
        }
        self.spaces.save(&space).await
    }

    /// Soft-delete (archive) a space. Requires owner or admin.
    pub async fn archive_space(
        &self,
        space_id: Uuid,
        actor_id: Uuid,
        actor_role: UserRole,
    ) -> Result<(), DomainError> {
        self.ensure_can_manage(space_id, actor_id, actor_role).await?;
        self.spaces.soft_delete(space_id).await
    }

    /// List all public (non-deleted) spaces.
    pub async fn list_public(&self) -> Result<Vec<Space>, DomainError> {
        self.spaces.find_all_public().await
    }

    /// Add a member to a space. Requires owner or admin. Prevents duplicates.
    pub async fn add_member(
        &self,
        space_id: Uuid,
        actor_id: Uuid,
        actor_role: UserRole,
        user_id: Uuid,
        role: SpaceRole,
    ) -> Result<SpaceMember, DomainError> {
        self.ensure_can_manage(space_id, actor_id, actor_role).await?;
        if self.members.find_membership(space_id, user_id).await?.is_some() {
            return Err(DomainError::AlreadyMember);
        }
        let now = Utc::now();
        let member = SpaceMember {
            space_id,
            user_id,
            role,
            created_at: now,
            updated_at: now,
        };
        self.members.add(&member).await
    }

    /// Remove a member. Requires owner or admin. Prevents removing the last owner.
    pub async fn remove_member(
        &self,
        space_id: Uuid,
        actor_id: Uuid,
        actor_role: UserRole,
        user_id: Uuid,
    ) -> Result<(), DomainError> {
        self.ensure_can_manage(space_id, actor_id, actor_role).await?;
        let target = self.members.find_membership(space_id, user_id).await?;
        if let Some(m) = &target {
            if m.role.is_owner() {
                let owners = self.members.count_owners(space_id).await?;
                if owners <= 1 {
                    return Err(DomainError::CannotRemoveLastOwner);
                }
            }
        } else {
            return Err(DomainError::NotSpaceMember);
        }
        self.members.remove(space_id, user_id).await
    }

    pub async fn list_members(&self, space_id: Uuid) -> Result<Vec<SpaceMember>, DomainError> {
        self.members.list_members(space_id).await
    }

    /// Membership of a specific user in a space (for frontend edit-permission checks).
    pub async fn my_membership(&self, space_id: Uuid, user_id: Uuid) -> Result<Option<SpaceMember>, DomainError> {
        self.members.find_membership(space_id, user_id).await
    }

    /// Ensure the actor may edit content in the space (editor or owner, or admin).
    pub async fn ensure_can_edit(&self, space_id: Uuid, actor_id: Uuid, actor_role: UserRole) -> Result<(), DomainError> {
        if actor_role.is_admin() {
            return Ok(());
        }
        let m = self.members.find_membership(space_id, actor_id).await?
            .ok_or(DomainError::NotSpaceMember)?;
        if !m.role.is_editor() {
            return Err(DomainError::NotSpaceEditor);
        }
        Ok(())
    }

    /// Ensure the actor may manage the space (owner or admin).
    pub async fn ensure_can_manage(&self, space_id: Uuid, actor_id: Uuid, actor_role: UserRole) -> Result<(), DomainError> {
        if actor_role.is_admin() {
            return Ok(());
        }
        let m = self.members.find_membership(space_id, actor_id).await?
            .ok_or(DomainError::NotSpaceOwner)?;
        if !m.role.is_owner() {
            return Err(DomainError::NotSpaceOwner);
        }
        Ok(())
    }
}