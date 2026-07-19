# EAP Frontend Playwright Tests

This directory contains end-to-end tests for the Enterprise Architecture Platform (EAP) frontend application using Playwright.

## Test Structure

The tests are organized by feature area following the structure in `specs/eap-test-plan.md`:

### Authentication Tests (`/auth/`)
- `login.spec.ts` - Login flow, invalid credentials, logout
- `register.spec.ts` - Registration flow, validation
- `protected-routes.spec.ts` - Unauthenticated redirect

### Navigation Tests (`/navigation/`)
- `sidebar.spec.ts` - Sidebar navigation, active states

### Value Stream Management Tests (`/value-stream/`)
- `crud.spec.ts` - Create, read, update, delete value streams
- `versions.spec.ts` - Version control operations

### Business Capabilities Tests (`/business-capabilities/`)
- `crud.spec.ts` - CRUD operations for business capabilities

### Business Processes Tests (`/business-processes/`)
- `crud.spec.ts` - CRUD operations for business processes

### Error Handling Tests (`/error-handling/`)
- `network-errors.spec.ts` - Network error handling, GraphQL errors, session expiry

## Test Best Practices

All tests follow Playwright best practices:

1. **Role-based locators**: Using `page.getByRole()` instead of CSS selectors
2. **Web-first assertions**: Using `await expect(el).toBeVisible()` pattern
3. **Test isolation**: Each test independent with proper setup/teardown
4. **User-visible behavior**: Testing what users see, not implementation details

## Running Tests

### Prerequisites
1. Backend server running at `http://localhost:8080`
2. Frontend production build served at `http://localhost:4173`

### Commands
```bash
# Run all tests
npm test

# Run tests with UI mode
npm run test:ui

# Run tests in headed mode (visible browser)
npm run test:headed

# Run specific test file
npx playwright test tests/auth/login.spec.ts

# Run tests with specific reporter
npx playwright test --reporter=html
```

### Test Data Requirements
Tests assume certain test data exists:
- User credentials: `admin@example.com` / `password123`
- Clean database state for consistent tests

## Test Coverage

The tests cover the following scenarios from the test plan:

### Authentication & Authorization
- ✅ User registration (happy path)
- ✅ User login (happy path)  
- ✅ User logout
- ✅ Invalid login credentials
- ✅ Registration validation
- ✅ Protected route access

### Navigation & Layout
- ✅ Sidebar navigation between sections
- ✅ Breadcrumb/back navigation
- ✅ Sidebar user profile display
- ✅ Responsive sidebar behavior
- ✅ Keyboard navigation

### Value Stream Management
- ✅ Create value stream
- ✅ Edit value stream
- ✅ Delete value stream
- ✅ View value stream details
- ✅ Version control operations
- ✅ Archive value stream
- ✅ Create validation
- ✅ Delete confirmation cancel

### Business Capabilities
- ✅ Full CRUD cycle
- ✅ Form validation

### Business Processes
- ✅ Full CRUD cycle with numeric fields
- ✅ Numeric input validation

### Error Handling
- ✅ Data loading states
- ✅ API failure handling
- ✅ Empty states handling
- ✅ GraphQL query errors
- ✅ GraphQL mutation errors
- ✅ Session expiry during operations
- ✅ Network interruption during operations
- ✅ Browser back/forward navigation

## Configuration

Tests are configured in `playwright.config.ts`:
- Base URL: `http://localhost:4173` (Vite preview server)
- Browser: System Chromium at `/usr/bin/chromium`
- Timeout: 30 seconds per test
- Workers: 1 (tests run sequentially to avoid conflicts)

## Test Development Guidelines

When adding new tests:

1. Follow the existing pattern of using role-based locators
2. Add appropriate timeouts for async operations
3. Handle both success and error cases
4. Include proper cleanup if test creates data
5. Add comments referencing the test plan section
6. Use descriptive test names that match the test plan

## Notes

- Tests use real backend interactions (no mocking)
- Tests assume Chinese language content in the UI
- Some tests may need adjustment based on actual UI implementation
- Network error tests use Playwright's route interception
- Form validation tests check both client and server-side validation