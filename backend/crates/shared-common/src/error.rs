use thiserror::Error;

#[derive(Debug, Error)]
pub enum AppError {
    #[error("resource not found: {0}")]
    NotFound(String),

    #[error("bad request: {0}")]
    BadRequest(String),

    #[error("unauthorized: {0}")]
    Unauthorized(String),

    #[error("forbidden: {0}")]
    Forbidden(String),

    #[error("conflict: {0}")]
    Conflict(String),

    #[error("database error: {0}")]
    Database(String),

    #[error("internal error: {0}")]
    Internal(String),
}

impl From<sea_orm::DbErr> for AppError {
    fn from(e: sea_orm::DbErr) -> Self {
        match e {
            sea_orm::DbErr::RecordNotFound(msg) => AppError::NotFound(msg),
            other => {
                // A UNIQUE/PK constraint violation is the DB backstop for
                // check-then-act races (e.g. duplicate email on concurrent
                // register). Surface it as a 409 Conflict instead of a 500 so
                // callers get a meaningful status. sea-orm does not expose a
                // structured constraint kind, so we match on the driver's
                // message text (SQLite: "UNIQUE constraint failed: ...").
                let msg = other.to_string();
                if msg.contains("UNIQUE constraint") || msg.contains("unique constraint") {
                    AppError::Conflict(msg)
                } else {
                    AppError::Database(msg)
                }
            }
        }
    }
}

impl From<serde_json::Error> for AppError {
    fn from(e: serde_json::Error) -> Self {
        AppError::Internal(format!("json error: {e}"))
    }
}

pub type AppResult<T> = Result<T, AppError>;
