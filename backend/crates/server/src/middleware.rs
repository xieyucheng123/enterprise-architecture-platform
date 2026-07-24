#[derive(Debug, Clone, serde::Serialize, serde::Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: usize,
    pub iat: usize,
    pub user_id: uuid::Uuid,
    pub role: String,
}

impl Claims {
    pub fn user_role(&self) -> shared_common::enums::UserRole {
        shared_common::enums::UserRole::from_str(&self.role)
            .unwrap_or(shared_common::enums::UserRole::Viewer)
    }
}
