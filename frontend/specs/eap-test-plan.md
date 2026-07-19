# EAP Frontend Test Plan

## Application Overview

**EAP (Enterprise Architecture Platform)** is a React-based enterprise application for managing business architecture components. The application provides:

### Core Features
1. **Authentication System**
   - Login with email/password
   - Registration with name, email, password
   - Protected routes requiring authentication
   - User profile display in sidebar
   - Logout functionality

2. **Main Navigation & Layout**
   - Sidebar navigation with 3 main sections
   - Responsive layout
   - Active route highlighting
   - User profile section

3. **Value Stream Management**
   - List view with table display
   - Create new value streams
   - Edit existing value streams
   - Delete value streams
   - View value stream details
   - Version control (create new versions)
   - Version history viewing
   - Archive/restore functionality
   - Status management (active/archived)

4. **Business Capabilities Management**
   - List view with table display
   - Create new capabilities
   - Edit existing capabilities
   - Delete capabilities
   - Status and maturity tracking

5. **Business Processes Management**
   - List view with table display
   - Create new processes
   - Edit existing processes
   - Delete processes
   - SLA, cycle time, and cost tracking

### Technical Stack
- **Frontend**: React + Vite + TypeScript
- **UI Components**: Radix UI + Tailwind CSS
- **State Management**: Zustand + Apollo Client
- **API**: GraphQL (Apollo Client) + REST for auth
- **Routing**: React Router v7
- **Build Tool**: Vite

### Application Structure
- `/login` - Authentication page (public)
- `/architectures/value-streams` - Value streams list (protected)
- `/architectures/value-streams/:id` - Value stream detail (protected)
- `/architectures/capabilities` - Business capabilities (protected)
- `/architectures/processes` - Business processes (protected)

---

## Test Scenarios

### 1. Authentication & Authorization Tests

#### 1.1 Happy Path - User Registration
**Scenario**: New user successfully registers and gains access
**Preconditions**: No existing session
**Steps**:
1. Navigate to http://localhost:3000/login
2. Verify login page loads with "企业架构平台" title
3. Click on "注册" tab
4. Fill in:
   - 姓名: "测试用户"
   - 邮箱: "test@example.com"
   - 密码: "Password123!"
5. Click "注册" button
6. Verify registration succeeds
7. Verify redirected to `/architectures/value-streams`
8. Verify sidebar shows user name "测试用户"
9. Verify user is authenticated (localStorage contains tokens)

**Expected Outcomes**:
- Registration form submits successfully
- User redirected to main application
- Authentication tokens stored
- User info displayed in sidebar

#### 1.2 Happy Path - User Login
**Scenario**: Existing user successfully logs in
**Preconditions**: User account exists, no active session
**Steps**:
1. Navigate to http://localhost:3000/login
2. Verify login tab is active by default
3. Fill in:
   - 邮箱: "admin@example.com"
   - 密码: "password123"
4. Click "登录" button
5. Verify login succeeds
6. Verify redirected to `/architectures/value-streams`
7. Verify user is authenticated

**Expected Outcomes**:
- Login form submits successfully
- User redirected to main application
- Authentication tokens stored

#### 1.3 Happy Path - User Logout
**Scenario**: Authenticated user logs out
**Preconditions**: User is logged in
**Steps**:
1. Navigate to any protected page
2. Verify sidebar shows user info
3. Click "退出登录" button in sidebar
4. Verify user is logged out
5. Verify redirected to `/login` page
6. Verify authentication tokens removed from localStorage

**Expected Outcomes**:
- User session terminated
- Redirected to login page
- Tokens cleared from storage

#### 1.4 Edge Case - Invalid Login Credentials
**Scenario**: User enters incorrect login credentials
**Preconditions**: No active session
**Steps**:
1. Navigate to http://localhost:3000/login
2. Enter invalid credentials:
   - 邮箱: "wrong@example.com"
   - 密码: "wrongpassword"
3. Click "登录" button
4. Verify error message displayed
5. Verify user remains on login page
6. Verify no authentication tokens stored

**Expected Outcomes**:
- Error message shown (e.g., "Login failed")
- User not authenticated
- Page not redirected

#### 1.5 Edge Case - Registration Validation
**Scenario**: User attempts registration with invalid data
**Preconditions**: No active session
**Steps**:
1. Navigate to http://localhost:3000/login
2. Click "注册" tab
3. Attempt submission with:
   - Case 1: Empty fields
   - Case 2: Invalid email format
   - Case 3: Password too short
4. Verify appropriate validation/error messages
5. Verify registration not successful

**Expected Outcomes**:
- Form validation prevents submission
- Clear error messages displayed
- No API call made for invalid data

#### 1.6 Edge Case - Protected Route Access
**Scenario**: Unauthenticated user attempts to access protected route
**Preconditions**: No active session
**Steps**:
1. Clear localStorage (remove tokens)
2. Navigate directly to http://localhost:3000/architectures/value-streams
3. Verify redirected to `/login` page
4. Verify cannot access protected content

**Expected Outcomes**:
- Automatic redirect to login page
- Protected content not accessible

### 2. Navigation & Layout Tests

#### 2.1 Happy Path - Sidebar Navigation
**Scenario**: User navigates between main sections
**Preconditions**: User is logged in
**Steps**:
1. Verify sidebar contains 3 main items:
   - 价值流 (Value Streams)
   - 业务能力 (Business Capabilities)
   - 业务流程 (Business Processes)
2. Click "价值流"
3. Verify URL changes to `/architectures/value-streams`
4. Verify "价值流" menu item is highlighted
5. Click "业务能力"
6. Verify URL changes to `/architectures/capabilities`
7. Verify "业务能力" menu item is highlighted
8. Click "业务流程"
9. Verify URL changes to `/architectures/processes`
10. Verify "业务流程" menu item is highlighted

**Expected Outcomes**:
- Navigation works correctly
- Active menu item highlighted
- Content updates appropriately

#### 2.2 Happy Path - Breadcrumb/Back Navigation
**Scenario**: User navigates to detail page and back
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Navigate to `/architectures/value-streams`
2. Click "查看" button on any value stream
3. Verify URL changes to `/architectures/value-streams/:id`
4. Verify detail page shows value stream information
5. Click "返回列表" button
6. Verify returned to `/architectures/value-streams`

**Expected Outcomes**:
- Detail page loads correct data
- Back navigation works correctly

### 3. Value Stream Management Tests

#### 3.1 Happy Path - Create Value Stream
**Scenario**: User creates a new value stream
**Preconditions**: User is logged in, on value streams page
**Steps**:
1. Click "新建价值流" button
2. Verify create dialog opens
3. Fill in form:
   - 名称: "测试价值流"
   - 描述: "这是一个测试价值流"
   - 版本: "v1.0"
   - 状态: "active"
   - 重要性: "high"
4. Click "保存" button
5. Verify dialog closes
6. Verify new value stream appears in table
7. Verify table shows correct data
8. Verify pagination count updates

**Expected Outcomes**:
- Create dialog functions correctly
- New value stream added to table
- Form data preserved correctly

#### 3.2 Happy Path - Edit Value Stream
**Scenario**: User edits an existing value stream
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Click edit (pencil) button on any value stream
2. Verify edit dialog opens with pre-filled data
3. Modify fields:
   - 名称: "Updated Name"
   - 描述: "Updated Description"
4. Click "保存" button
5. Verify dialog closes
6. Verify table shows updated data
7. Verify other fields unchanged

**Expected Outcomes**:
- Edit dialog pre-fills existing data
- Updates persist correctly
- Only modified fields change

#### 3.3 Happy Path - Delete Value Stream
**Scenario**: User deletes a value stream
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Click delete (trash) button on any value stream
2. Verify delete confirmation dialog opens
3. Click "确认" button
4. Verify dialog closes
5. Verify value stream removed from table
6. Verify pagination count updates

**Expected Outcomes**:
- Delete confirmation appears
- Item removed from table after confirmation
- Pagination updates correctly

#### 3.4 Happy Path - View Value Stream Details
**Scenario**: User views value stream details
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Click "查看" button on any value stream
2. Verify detail page loads
3. Verify URL contains correct ID
4. Verify all value stream data displayed:
   - Name
   - Description
   - Status badge
   - Created/updated timestamps
5. Verify "返回列表" button works

**Expected Outcomes**:
- Detail page loads correct data
- All fields displayed properly
- Back navigation works

#### 3.5 Happy Path - Version Control Operations
**Scenario**: User creates new version of value stream
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Click version control (GitBranch) button on any value stream
2. Verify create version dialog opens
3. Enter new version name: "v2.0"
4. Click "创建" button
5. Verify dialog closes
6. Verify new version appears in version history
7. Click history (History) button on same value stream
8. Verify version history dialog opens
9. Verify both versions (v1.0 and v2.0) listed

**Expected Outcomes**:
- Version creation works
- History shows all versions
- Dialogs function correctly

#### 3.6 Happy Path - Archive Value Stream
**Scenario**: User archives a value stream
**Preconditions**: User is logged in, at least one active value stream exists
**Steps**:
1. Find an active value stream (status: "active")
2. Click archive button (if available)
3. Verify archive confirmation appears
4. Confirm archive action
5. Verify value stream status changes to "archived"
6. Verify badge color changes (destructive variant)
7. Verify archive button disappears

**Expected Outcomes**:
- Archive functionality works
- Status updates correctly
- UI reflects archived state

#### 3.7 Edge Case - Create Value Stream Validation
**Scenario**: User attempts to create value stream with invalid data
**Preconditions**: User is logged in
**Steps**:
1. Click "新建价值流" button
2. Attempt submission with:
   - Case 1: Empty name field
   - Case 2: Name too long (if validation exists)
   - Case 3: Invalid version format
3. Verify appropriate validation messages
4. Verify form not submitted

**Expected Outcomes**:
- Form validation prevents invalid submissions
- Clear error messages shown

#### 3.8 Edge Case - Delete Confirmation Cancel
**Scenario**: User cancels delete operation
**Preconditions**: User is logged in, at least one value stream exists
**Steps**:
1. Click delete (trash) button on any value stream
2. Verify delete confirmation dialog opens
3. Click "取消" or close dialog
4. Verify dialog closes
5. Verify value stream still in table

**Expected Outcomes**:
- Delete operation cancelled
- No data deleted
- UI returns to normal state

#### 3.9 Edge Case - Concurrent Operations
**Scenario**: Multiple users performing operations simultaneously
**Preconditions**: User is logged in
**Steps**:
1. Open two browser windows/tabs with same user session
2. In window 1: Start editing a value stream
3. In window 2: Delete the same value stream
4. Verify appropriate error handling
5. Test with other concurrent operations:
   - Edit while another user edits
   - Create while another user deletes
   - Archive while another user edits

**Expected Outcomes**:
- System handles concurrent operations gracefully
- Clear error messages for conflicts
- Data integrity maintained

#### 3.10 Edge Case - Session Expiry During Operation
**Scenario**: User session expires during long operation
**Preconditions**: User is logged in
**Steps**:
1. Start a create/edit operation
2. Simulate session expiry (clear tokens)
3. Attempt to complete operation
4. Verify user redirected to login
5. Verify unsaved data handled appropriately

**Expected Outcomes**:
- Graceful handling of expired sessions
- User redirected to login
- Clear messaging about session expiry

#### 3.11 Edge Case - Network Interruption
**Scenario**: Network connection lost during operation
**Preconditions**: User is logged in
**Steps**:
1. Start a data-intensive operation (create with large data)
2. Simulate network disconnection
3. Verify operation fails gracefully
4. Verify retry mechanism (if implemented)
5. Verify user can recover or cancel

**Expected Outcomes**:
- Operation fails gracefully
- User notified of network issue
- Option to retry or cancel

#### 3.12 Edge Case - Browser Back/Forward Navigation
**Scenario**: User uses browser navigation during operations
**Preconditions**: User is logged in
**Steps**:
1. Open create/edit dialog
2. Click browser back button
3. Verify dialog closes gracefully
4. Verify no data loss (if partially filled)
5. Test with browser forward navigation
6. Test with refresh during operation

**Expected Outcomes**:
- Browser navigation handled gracefully
- Dialogs close properly
- User data preserved where appropriate

### 4. Business Capabilities Tests

#### 4.1 Happy Path - CRUD Operations
**Scenario**: Full CRUD cycle for business capabilities
**Preconditions**: User is logged in, on capabilities page
**Steps**:
1. **Create**:
   - Click "新建业务能力" button
   - Fill form with test data
   - Verify creation successful
2. **Read**:
   - Verify new capability appears in table
   - Verify all fields displayed correctly
3. **Update**:
   - Click edit button on new capability
   - Modify name/description
   - Verify update successful
4. **Delete**:
   - Click delete button
   - Confirm deletion
   - Verify removal from table

**Expected Outcomes**:
- All CRUD operations function correctly
- Data persists between operations
- UI updates reflect changes

#### 4.2 Edge Case - Form Validation
**Scenario**: Invalid capability data entry
**Preconditions**: User is logged in, on capabilities page
**Steps**:
1. Attempt to create capability with:
   - Empty required fields
   - Invalid maturity level (if dropdown)
   - Invalid business value
2. Verify validation prevents submission
3. Verify clear error messages

**Expected Outcomes**:
- Form validation works
- User receives helpful error messages

### 5. Business Processes Tests

#### 5.1 Happy Path - CRUD Operations
**Scenario**: Full CRUD cycle for business processes
**Preconditions**: User is logged in, on processes page
**Steps**:
1. **Create**:
   - Click "新建业务流程" button
   - Fill form with test data including SLA, cycle time, cost
   - Verify creation successful
2. **Read**:
   - Verify new process appears in table
   - Verify numeric fields formatted correctly
3. **Update**:
   - Click edit button
   - Modify SLA/cycle time/cost
   - Verify update successful
4. **Delete**:
   - Click delete button
   - Confirm deletion
   - Verify removal from table

**Expected Outcomes**:
- All CRUD operations function
- Numeric fields handled correctly
- Data persists

#### 5.2 Edge Case - Numeric Input Validation
**Scenario**: Invalid numeric inputs for processes
**Preconditions**: User is logged in, on processes page
**Steps**:
1. Attempt to create process with:
   - Negative cycle time
   - Negative cost
   - Non-numeric values in numeric fields
2. Verify validation prevents submission
3. Verify appropriate error messages

**Expected Outcomes**:
- Numeric validation works
- Negative values rejected (if applicable)
- Non-numeric inputs rejected

### 6. Data Loading & Error Handling Tests

#### 6.1 Happy Path - Data Loading States
**Scenario**: Verify loading states during data fetch
**Preconditions**: User is logged in
**Steps**:
1. Navigate to each main page (value streams, capabilities, processes)
2. Observe loading state (if implemented)
3. Verify data loads successfully
4. Verify empty states (if no data)

**Expected Outcomes**:
- Loading indicators shown during fetch
- Data displays when loaded
- Empty states handled gracefully

#### 6.2 Edge Case - Network Errors
**Scenario**: Handle API failures gracefully
**Preconditions**: User is logged in
**Steps**:
1. Simulate network failure (if possible)
2. Navigate to data-intensive pages
3. Verify error messages displayed
4. Verify UI doesn't crash
5. Verify retry mechanisms (if implemented)

**Expected Outcomes**:
- Error states handled gracefully
- User-friendly error messages
- UI remains functional

#### 6.3 Edge Case - Empty States
**Scenario**: Handle empty data sets
**Preconditions**: User is logged in, no data in system
**Steps**:
1. Ensure system has no value streams/capabilities/processes
2. Navigate to each page
3. Verify empty state messaging
4. Verify "create new" buttons still available

**Expected Outcomes**:
- Empty states display helpful messages
- Create functionality still accessible

#### 6.4 Edge Case - GraphQL Query Errors
**Scenario**: Handle GraphQL query failures
**Preconditions**: User is logged in
**Steps**:
1. Simulate GraphQL query errors (malformed queries, schema errors)
2. Verify error boundaries catch and display errors
3. Verify UI doesn't crash
4. Verify user can retry or navigate away

**Expected Outcomes**:
- Error boundaries prevent UI crashes
- User-friendly error messages
- Recovery options available

#### 6.5 Edge Case - GraphQL Mutation Errors
**Scenario**: Handle GraphQL mutation failures
**Preconditions**: User is logged in
**Steps**:
1. Simulate mutation errors (validation errors, permission denied)
2. Verify error messages displayed to user
3. Verify form state preserved for correction
4. Verify user can retry or cancel

**Expected Outcomes**:
- Mutation errors handled gracefully
- Form data preserved for correction
- Clear error messages

#### 6.6 Edge Case - Apollo Client Cache Issues
**Scenario**: Handle cache inconsistencies
**Preconditions**: User is logged in
**Steps**:
1. Perform create/update/delete operations
2. Verify cache updates correctly
3. Test with multiple tabs/windows
4. Verify cache consistency across views
5. Test cache invalidation scenarios

**Expected Outcomes**:
- Cache updates correctly after mutations
- Consistent data across views
- Proper cache invalidation

#### 6.7 Edge Case - LocalStorage Issues
**Scenario**: Handle localStorage problems
**Preconditions**: User is logged in
**Steps**:
1. Simulate localStorage full or inaccessible
2. Verify graceful degradation
3. Verify user can still use app (read-only mode)
4. Verify appropriate error messages

**Expected Outcomes**:
- App doesn't crash on localStorage issues
- Graceful degradation
- Clear error messaging

### 7. Responsive & Accessibility Tests

#### 7.1 Happy Path - Responsive Design
**Scenario**: Verify responsive behavior
**Preconditions**: User is logged in
**Steps**:
1. Test on different viewport sizes:
   - Desktop (≥1024px)
   - Tablet (768px)
   - Mobile (375px)
2. Verify:
   - Sidebar collapses/responsively (if implemented)
   - Tables remain usable
   - Forms remain accessible
   - Text remains readable

**Expected Outcomes**:
- Application usable on all screen sizes
- No horizontal scrolling on mobile
- Touch targets appropriate size

#### 7.2 Happy Path - Keyboard Navigation
**Scenario**: Verify keyboard accessibility
**Preconditions**: User is logged in
**Steps**:
1. Navigate using Tab key only
2. Verify:
   - All interactive elements reachable
   - Focus indicators visible
   - Logical tab order
   - Forms navigable by keyboard
   - Dialogs trap focus
   - Escape key closes dialogs

**Expected Outcomes**:
- Full keyboard accessibility
- Clear focus indicators
- Logical navigation flow

#### 7.3 Edge Case - Screen Reader Compatibility
**Scenario**: Basic screen reader compatibility
**Preconditions**: User is logged in
**Steps**:
1. Verify semantic HTML structure
2. Check for:
   - Appropriate ARIA labels
   - Form field labels
   - Button descriptions
   - Table headers
   - Dialog roles and labels

**Expected Outcomes**:
- Semantic HTML used
- ARIA attributes where needed
- Screen reader friendly

### 8. Performance & UX Tests

#### 8.1 Happy Path - Page Load Performance
**Scenario**: Verify acceptable load times
**Preconditions**: User is logged in
**Steps**:
1. Measure initial page load time
2. Measure navigation between pages
3. Measure dialog open/close times
4. Verify no excessive re-renders

**Expected Outcomes**:
- Pages load within 2 seconds
- Navigation feels responsive
- Dialogs open quickly

#### 8.2 Edge Case - Large Data Sets
**Scenario**: Handle tables with many items
**Preconditions**: User is logged in, many items in system
**Steps**:
1. Add 50+ items to each category
2. Verify:
   - Table renders without freezing
   - Pagination works (if implemented)
   - Virtual scrolling (if implemented)
   - Search/filter performance

**Expected Outcomes**:
- Performance remains acceptable
- UI remains responsive
- Memory usage controlled

#### 8.3 Edge Case - Memory Leaks
**Scenario**: Verify no memory leaks during navigation
**Preconditions**: User is logged in
**Steps**:
1. Navigate between pages rapidly (10+ times)
2. Open/close dialogs repeatedly
3. Perform multiple create/edit/delete operations
4. Monitor memory usage
5. Verify no increasing memory consumption

**Expected Outcomes**:
- No memory leaks detected
- Stable memory usage over time
- Proper cleanup of event listeners

#### 8.4 Edge Case - Slow Network Conditions
**Scenario**: Application behavior on slow networks
**Preconditions**: User is logged in
**Steps**:
1. Simulate slow network (3G speeds)
2. Test page loads
3. Test data fetching
4. Test form submissions
5. Verify loading states display correctly
6. Verify timeout handling

**Expected Outcomes**:
- Loading indicators shown appropriately
- Timeouts handled gracefully
- User can cancel long-running operations

### 9. Security & Data Integrity Tests

#### 9.1 Edge Case - XSS Protection
**Scenario**: Verify XSS protection in user inputs
**Preconditions**: User is logged in
**Steps**:
1. Attempt to enter script tags in form fields
2. Attempt to enter HTML entities
3. Attempt to enter JavaScript URIs
4. Verify inputs are sanitized
5. Verify no script execution in output

**Expected Outcomes**:
- Input sanitization prevents XSS
- No script execution in rendered content

#### 9.2 Edge Case - CSRF Protection
**Scenario**: Verify CSRF protection
**Preconditions**: User is logged in
**Steps**:
1. Check for CSRF tokens in requests
2. Verify token validation
3. Test with invalid/missing tokens
4. Verify requests rejected appropriately

**Expected Outcomes**:
- CSRF protection implemented
- Invalid tokens rejected
- Secure by default

#### 9.3 Edge Case - Authentication Token Handling
**Scenario**: Verify secure token handling
**Preconditions**: User is logged in
**Steps**:
1. Check token storage (localStorage vs httpOnly cookies)
2. Verify token refresh mechanism
3. Test with expired tokens
4. Verify proper logout on token invalidation
5. Test token leakage scenarios

**Expected Outcomes**:
- Secure token storage
- Proper token refresh
- Graceful handling of expired tokens

#### 9.4 Edge Case - Authorization Bypass Attempts
**Scenario**: Attempt to bypass authorization
**Preconditions**: User is logged in
**Steps**:
1. Attempt to access other users' data by modifying IDs
2. Attempt to perform actions without proper permissions
3. Test URL manipulation for unauthorized access
4. Verify proper authorization checks

**Expected Outcomes**:
- Authorization checks prevent unauthorized access
- Proper error messages for denied requests
- No data leakage between users

---

## Test Environment Setup

### Prerequisites
1. Backend server running on http://localhost:8080
2. Frontend development server running on http://localhost:3000
3. Clean database state for consistent tests

### Test Data Requirements
1. **Authentication**:
   - Test user credentials
   - Invalid credentials for negative testing

2. **Value Streams**:
   - Sample value streams with different statuses
   - Multiple versions for testing history

3. **Business Capabilities**:
   - Sample capabilities with various maturity levels
   - Different business values

4. **Business Processes**:
   - Sample processes with SLA, cycle time, cost data

### Test Execution Strategy

#### Phase 1: Authentication & Navigation
- Test login/logout flows
- Verify protected route access
- Test navigation between sections

#### Phase 2: CRUD Operations
- Test create, read, update, delete for each entity type
- Verify data persistence
- Test form validation

#### Phase 3: Advanced Features
- Test version control operations
- Test archive functionality
- Test detail views

#### Phase 4: Edge Cases & Error Handling
- Test invalid inputs
- Test network failures
- Test empty states

#### Phase 5: UX & Accessibility
- Test responsive design
- Test keyboard navigation
- Test loading states

### Success Criteria
1. All happy path scenarios pass
2. Edge cases handled gracefully
3. No JavaScript errors in console
4. No broken UI elements
5. All interactive elements functional
6. Data persists correctly
7. Error messages user-friendly
8. Performance acceptable

### Risk Areas
1. **GraphQL API Integration**: Mutation/query failures
2. **Authentication State**: Token expiration, refresh handling
3. **Form Validation**: Client-side vs server-side validation mismatch
4. **Concurrent Operations**: Race conditions in CRUD operations
5. **Data Consistency**: Version control data integrity

### Notes
- Backend must be running for full integration testing
- Consider mocking API for unit/component tests
- Pay attention to Chinese language content in assertions
- Test both authenticated and unauthenticated states
- Verify localStorage token management

---

## Test Automation Considerations

### Playwright Test Structure
```typescript
describe('EAP Frontend', () => {
  describe('Authentication', () => {
    test('user can login', async () => { /* ... */ });
    test('user can logout', async () => { /* ... */ });
    test('protected routes redirect unauthenticated', async () => { /* ... */ });
  });

  describe('Value Streams', () => {
    test('create value stream', async () => { /* ... */ });
    test('edit value stream', async () => { /* ... */ });
    test('delete value stream', async () => { /* ... */ });
    test('view value stream details', async () => { /* ... */ });
    test('version control operations', async () => { /* ... */ });
  });

  describe('Business Capabilities', () => { /* ... */ });
  describe('Business Processes', () => { /* ... */ });
  describe('Navigation', () => { /* ... */ });
  describe('Error Handling', () => { /* ... */ });
});
```

### Test Data Management
- Use test-specific user accounts
- Clean up test data after each test
- Isolate tests to prevent interference
- Consider using API to setup/teardown test data

### Continuous Integration
- Run tests on PR creation
- Run tests on main branch merges
- Include performance budgets
- Include accessibility checks