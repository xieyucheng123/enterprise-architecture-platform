# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: value-stream/crud.spec.ts >> Value Stream Management - CRUD Operations >> Happy Path - Delete Value Stream
- Location: tests/value-stream/crud.spec.ts:107:3

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.click: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByRole('button', { name: '新建价值流' })

```

# Page snapshot

```yaml
- generic [ref=e3]:
  - complementary [ref=e4]:
    - generic [ref=e5]:
      - link "所有空间" [ref=e6] [cursor=pointer]:
        - /url: /spaces
        - img [ref=e7]
        - text: 所有空间
      - heading "空间" [level=1] [ref=e9]
      - paragraph [ref=e10]: Enterprise Architecture
      - paragraph [ref=e11]: 只读模式（非成员）
    - navigation [ref=e12]:
      - link "价值流" [ref=e13] [cursor=pointer]:
        - /url: /spaces/00000000-0000-0000-0000-000000000010/architectures/value-streams
        - img [ref=e14]
        - text: 价值流
      - link "业务能力" [ref=e19] [cursor=pointer]:
        - /url: /spaces/00000000-0000-0000-0000-000000000010/architectures/capabilities
        - img [ref=e20]
        - text: 业务能力
      - link "业务流程" [ref=e30] [cursor=pointer]:
        - /url: /spaces/00000000-0000-0000-0000-000000000010/architectures/processes
        - img [ref=e31]
        - text: 业务流程
    - generic [ref=e35]:
      - generic [ref=e36]:
        - generic [ref=e37]: T
        - generic [ref=e38]:
          - paragraph [ref=e39]: Test User
          - paragraph [ref=e40]: test@example.com
      - button "退出登录" [ref=e41]:
        - img [ref=e42]
        - text: 退出登录
  - main [ref=e45]:
    - generic [ref=e47]:
      - heading "价值流" [level=1] [ref=e49]
      - generic [ref=e50]:
        - heading "价值流列表" [level=3] [ref=e52]
        - generic [ref=e53]:
          - table [ref=e55]:
            - rowgroup [ref=e56]:
              - row "名称 版本 状态 操作" [ref=e57]:
                - columnheader "名称" [ref=e58]
                - columnheader "版本" [ref=e59]
                - columnheader "状态" [ref=e60]
                - columnheader "操作" [ref=e61]
            - rowgroup
          - paragraph [ref=e63]: 共 0 条
    - generic [ref=e64]: © 2025 企业架构平台
```

# Test source

```ts
  9   |     await page.getByRole('textbox', { name: '密码' }).fill('testpassword123');
  10  |     await page.getByRole('button', { name: '登录' }).click();
  11  |     await expect(page).toHaveURL('/spaces/00000000-0000-0000-0000-000000000010/architectures/value-streams');
  12  |   });
  13  | 
  14  |   test('Happy Path - Create Value Stream', async ({ page }) => {
  15  |     // Click "新建价值流" button
  16  |     await page.getByRole('button', { name: '新建价值流' }).click();
  17  |     
  18  |     // Verify create dialog opens
  19  |     await expect(page.getByRole('dialog')).toBeVisible();
  20  |     await expect(page.getByRole('heading', { name: /新建价值流|创建价值流/ })).toBeVisible();
  21  |     
  22  |     // Fill in form
  23  |     await page.getByRole('textbox', { name: /名称|Name/ }).fill('测试价值流');
  24  |     await page.getByRole('textbox', { name: /描述|Description/ }).fill('这是一个测试价值流');
  25  |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('v1.0');
  26  |     
  27  |     // Select status (assuming it's a select/dropdown)
  28  |     const statusField = page.getByRole('combobox', { name: /状态|Status/ }).or(page.getByRole('textbox', { name: /状态|Status/ }));
  29  |     await statusField.fill('active');
  30  |     
  31  |     // Select importance (assuming it's a select/dropdown)
  32  |     const importanceField = page.getByRole('combobox', { name: /重要性|Importance/ }).or(page.getByRole('textbox', { name: /重要性|Importance/ }));
  33  |     await importanceField.fill('high');
  34  |     
  35  |     // Click "保存" button
  36  |     await page.getByRole('button', { name: /保存|Save/ }).click();
  37  |     
  38  |     // Verify dialog closes
  39  |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  40  |     
  41  |     // Verify new value stream appears in table
  42  |     await expect(page.getByText('测试价值流')).toBeVisible({ timeout: 10000 });
  43  |     
  44  |     // Verify table shows correct data
  45  |     const row = page.locator('tr').filter({ hasText: '测试价值流' });
  46  |     await expect(row).toBeVisible();
  47  |     await expect(row.getByText('v1.0')).toBeVisible();
  48  |     await expect(row.getByText('active')).toBeVisible();
  49  |     
  50  |     // Note: Pagination count verification would require checking the table structure
  51  |     // For now, we verify the item appears in the table
  52  |   });
  53  | 
  54  |   test('Happy Path - Edit Value Stream', async ({ page }) => {
  55  |     // First, create a value stream to edit
  56  |     await page.getByRole('button', { name: '新建价值流' }).click();
  57  |     await page.getByRole('textbox', { name: /名称|Name/ }).fill('原始名称');
  58  |     await page.getByRole('textbox', { name: /描述|Description/ }).fill('原始描述');
  59  |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('v1.0');
  60  |     
  61  |     const statusField = page.getByRole('combobox', { name: /状态|Status/ }).or(page.getByRole('textbox', { name: /状态|Status/ }));
  62  |     await statusField.fill('active');
  63  |     
  64  |     const importanceField = page.getByRole('combobox', { name: /重要性|Importance/ }).or(page.getByRole('textbox', { name: /重要性|Importance/ }));
  65  |     await importanceField.fill('medium');
  66  |     
  67  |     await page.getByRole('button', { name: /保存|Save/ }).click();
  68  |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  69  |     
  70  |     // Find the created value stream and click edit button
  71  |     const row = page.locator('tr').filter({ hasText: '原始名称' });
  72  |     await expect(row).toBeVisible();
  73  |     
  74  |     // Click edit (pencil) button
  75  |     await row.getByRole('button').filter({ has: page.locator('svg[data-icon="pencil"]') }).click();
  76  |     
  77  |     // Verify edit dialog opens with pre-filled data
  78  |     await expect(page.getByRole('dialog')).toBeVisible();
  79  |     await expect(page.getByRole('heading', { name: /编辑|Edit/ })).toBeVisible();
  80  |     
  81  |     // Verify form fields have existing data
  82  |     const nameField = page.getByRole('textbox', { name: /名称|Name/ });
  83  |     await expect(nameField).toHaveValue('原始名称');
  84  |     
  85  |     const descField = page.getByRole('textbox', { name: /描述|Description/ });
  86  |     await expect(descField).toHaveValue('原始描述');
  87  |     
  88  |     // Modify fields
  89  |     await nameField.fill('Updated Name');
  90  |     await descField.fill('Updated Description');
  91  |     
  92  |     // Click "保存" button
  93  |     await page.getByRole('button', { name: /保存|Save/ }).click();
  94  |     
  95  |     // Verify dialog closes
  96  |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  97  |     
  98  |     // Verify table shows updated data
  99  |     await expect(page.getByText('Updated Name')).toBeVisible({ timeout: 10000 });
  100 |     await expect(page.getByText('Updated Description')).toBeVisible();
  101 |     
  102 |     // Verify other fields unchanged
  103 |     await expect(page.getByText('v1.0')).toBeVisible();
  104 |     await expect(page.getByText('active')).toBeVisible();
  105 |   });
  106 | 
  107 |   test('Happy Path - Delete Value Stream', async ({ page }) => {
  108 |     // First, create a value stream to delete
> 109 |     await page.getByRole('button', { name: '新建价值流' }).click();
      |                                                       ^ Error: locator.click: Test timeout of 30000ms exceeded.
  110 |     await page.getByRole('textbox', { name: /名称|Name/ }).fill('待删除价值流');
  111 |     await page.getByRole('textbox', { name: /描述|Description/ }).fill('这个将被删除');
  112 |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('v1.0');
  113 |     
  114 |     const statusField = page.getByRole('combobox', { name: /状态|Status/ }).or(page.getByRole('textbox', { name: /状态|Status/ }));
  115 |     await statusField.fill('active');
  116 |     
  117 |     const importanceField = page.getByRole('combobox', { name: /重要性|Importance/ }).or(page.getByRole('textbox', { name: /重要性|Importance/ }));
  118 |     await importanceField.fill('low');
  119 |     
  120 |     await page.getByRole('button', { name: /保存|Save/ }).click();
  121 |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  122 |     
  123 |     // Find the created value stream
  124 |     const row = page.locator('tr').filter({ hasText: '待删除价值流' });
  125 |     await expect(row).toBeVisible();
  126 |     
  127 |     // Click delete (trash) button
  128 |     await row.getByRole('button').filter({ has: page.locator('svg[data-icon="trash-2"]') }).click();
  129 |     
  130 |     // Verify delete confirmation dialog opens
  131 |     await expect(page.getByRole('dialog')).toBeVisible();
  132 |     await expect(page.getByText(/确认删除|Confirm delete/)).toBeVisible();
  133 |     
  134 |     // Click "确认" button
  135 |     await page.getByRole('button', { name: /确认|Confirm/ }).click();
  136 |     
  137 |     // Verify dialog closes
  138 |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  139 |     
  140 |     // Verify value stream removed from table
  141 |     await expect(page.getByText('待删除价值流')).not.toBeVisible({ timeout: 10000 });
  142 |   });
  143 | 
  144 |   test('Edge Case - Create Value Stream Validation', async ({ page }) => {
  145 |     await page.getByRole('button', { name: '新建价值流' }).click();
  146 |     await expect(page.getByRole('dialog')).toBeVisible();
  147 |     
  148 |     // Test Case 1: Empty name field
  149 |     await page.getByRole('textbox', { name: /名称|Name/ }).clear();
  150 |     await page.getByRole('textbox', { name: /描述|Description/ }).fill('描述');
  151 |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('v1.0');
  152 |     
  153 |     // Try to submit with empty name
  154 |     await page.getByRole('button', { name: /保存|Save/ }).click();
  155 |     
  156 |     // Should show validation error or prevent submission
  157 |     // Check for validation message or that dialog is still open
  158 |     await expect(page.getByRole('dialog')).toBeVisible();
  159 |     
  160 |     // Test Case 2: Invalid version format (if validation exists)
  161 |     await page.getByRole('textbox', { name: /名称|Name/ }).fill('测试名称');
  162 |     await page.getByRole('textbox', { name: /版本|Version/ }).clear();
  163 |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('invalid version');
  164 |     
  165 |     await page.getByRole('button', { name: /保存|Save/ }).click();
  166 |     
  167 |     // Should show validation error
  168 |     await expect(page.getByRole('dialog')).toBeVisible();
  169 |     
  170 |     // Close dialog
  171 |     await page.getByRole('button', { name: /取消|Cancel/ }).or(page.locator('button[aria-label="Close"]')).click();
  172 |     await expect(page.getByRole('dialog')).not.toBeVisible();
  173 |   });
  174 | 
  175 |   test('Edge Case - Delete Confirmation Cancel', async ({ page }) => {
  176 |     // Create a value stream
  177 |     await page.getByRole('button', { name: '新建价值流' }).click();
  178 |     await page.getByRole('textbox', { name: /名称|Name/ }).fill('测试取消删除');
  179 |     await page.getByRole('textbox', { name: /描述|Description/ }).fill('测试取消删除描述');
  180 |     await page.getByRole('textbox', { name: /版本|Version/ }).fill('v1.0');
  181 |     
  182 |     const statusField = page.getByRole('combobox', { name: /状态|Status/ }).or(page.getByRole('textbox', { name: /状态|Status/ }));
  183 |     await statusField.fill('active');
  184 |     
  185 |     await page.getByRole('button', { name: /保存|Save/ }).click();
  186 |     await expect(page.getByRole('dialog')).not.toBeVisible({ timeout: 10000 });
  187 |     
  188 |     // Find the created value stream
  189 |     const row = page.locator('tr').filter({ hasText: '测试取消删除' });
  190 |     await expect(row).toBeVisible();
  191 |     
  192 |     // Click delete (trash) button
  193 |     await row.getByRole('button').filter({ has: page.locator('svg[data-icon="trash-2"]') }).click();
  194 |     
  195 |     // Verify delete confirmation dialog opens
  196 |     await expect(page.getByRole('dialog')).toBeVisible();
  197 |     
  198 |     // Click "取消" or close dialog
  199 |     const cancelButton = page.getByRole('button', { name: /取消|Cancel/ });
  200 |     if (await cancelButton.isVisible()) {
  201 |       await cancelButton.click();
  202 |     } else {
  203 |       // If no cancel button, close the dialog
  204 |       await page.locator('button[aria-label="Close"]').click();
  205 |     }
  206 |     
  207 |     // Verify dialog closes
  208 |     await expect(page.getByRole('dialog')).not.toBeVisible();
  209 |     
```