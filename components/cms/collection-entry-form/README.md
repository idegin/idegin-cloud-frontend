# Collection Entry Form System

A comprehensive, reusable form system for creating and editing CMS collection entries with full field type support.

## Components

### 1. CollectionEntryForm
The main form component that handles the entire entry creation/editing flow.

**Location:** `components/collection-entry-form/CollectionEntryForm.tsx`

**Props:**
- `collection: CMSCollection` - The collection metadata
- `fields: CMSCollectionField[]` - Array of field definitions
- `currentUser: User` - Current user information
- `onSubmit: (data: Record<string, any>) => Promise<void>` - Submit handler
- `onCancel?: () => void` - Cancel handler (optional)
- `initialData?: Record<string, any>` - Pre-filled data for edit mode
- `isEdit?: boolean` - Whether in edit mode
- `isSubmitting?: boolean` - Loading state

**Features:**
- Automatic field sorting by `indexOrder`
- Built-in validation based on `validationRules`
- Error handling and display
- Responsive layout with ScrollArea
- Loading states

### 2. CMSCollectionFieldRenderer
A smart field renderer that uses a switch statement to render the appropriate input based on field type.

**Location:** `components/collection-entry-form/CMSCollectionFieldRenderer.tsx`

**Props:**
- `field: CMSCollectionField` - Field definition
- `value: any` - Current field value
- `onChange: (value: any) => void` - Change handler
- `error?: string` - Error message

**Supported Field Types:**
- `string` - Text input
- `number` - Number input with min/max/step support
- `boolean` - Checkbox
- `dropdown` - Select with options from `dropdownOptions`
- `rich_text` - Textarea for long-form content
- `date` - Date picker with calendar
- `time` - Time input
- `timestamp` - Datetime-local input
- `file` - File upload
- `json` - JSON editor with syntax validation
- `relationship` - Related entity selector (placeholder)
- `slug` - Text input for URL slugs
- `url` - URL input with validation
- `email` - Email input with validation

### 3. CMSFieldContainer
A consistent wrapper for all fields providing label, help text, and error display.

**Location:** `components/collection-entry-form/CMSFieldContainer.tsx`

**Props:**
- `label: string` - Field label
- `htmlFor?: string` - ID for label association
- `helpText?: string` - Tooltip help text
- `required?: boolean` - Shows required indicator
- `error?: string` - Error message
- `children: React.ReactNode` - Field input
- `className?: string` - Additional classes

**Features:**
- Info icon with tooltip for `helpText`
- Required indicator (red asterisk)
- Error message display
- Consistent spacing and layout

## Usage Examples

### Basic Create Form
```tsx
import { CollectionEntryForm } from "@/components/collection-entry-form"

function CreateEntryPage() {
  const { cmsCollectionData } = useCMSCollection()
  const { data: session } = useSession()

  const handleSubmit = async (data: Record<string, any>) => {
    await cmsApi.entries.create(projectId, collectionId, { data })
  }

  return (
    <CollectionEntryForm
      collection={cmsCollectionData.collection}
      fields={cmsCollectionData.fields}
      currentUser={session.user}
      onSubmit={handleSubmit}
    />
  )
}
```

### Edit Form with Initial Data
```tsx
function EditEntryPage() {
  const { entry } = useEntry()
  
  return (
    <CollectionEntryForm
      collection={collection}
      fields={fields}
      currentUser={user}
      initialData={entry.data}
      isEdit={true}
      onSubmit={handleUpdate}
      onCancel={() => router.back()}
    />
  )
}
```

### Custom Field Renderer
```tsx
import { CMSCollectionFieldRenderer } from "@/components/collection-entry-form"

function CustomForm() {
  const [value, setValue] = useState("")

  return (
    <CMSCollectionFieldRenderer
      field={field}
      value={value}
      onChange={setValue}
      error={error}
    />
  )
}
```

## Field Configuration

### Field Config Object
```typescript
{
  label: string          // Display label
  key: string           // Data key
  type: string          // Field type (see supported types)
  placeholder?: string  // Placeholder text
  helpText?: string     // Tooltip help text
  readonly?: boolean    // Disable editing
  hidden?: boolean      // Hide field
}
```

### Validation Rules Object
```typescript
{
  required?: boolean    // Field is required
  minLength?: number   // Min string length
  maxLength?: number   // Max string length
  min?: number         // Min numeric value
  max?: number         // Max numeric value
  pattern?: string     // Regex pattern (for email/url)
}
```

### Config Options Object
```typescript
{
  step?: number        // Number input step
  min?: number         // Number input min
  max?: number         // Number input max
  rows?: number        // Textarea rows
  accept?: string      // File input accept types
}
```

## Client/Organization Side Usage

The form system is designed to be reusable on both admin and client sides:

```tsx
// Client-side implementation
import { CollectionEntryForm } from "@/components/collection-entry-form"

function ClientCreateEntry() {
  const { collection, fields } = useCMSCollection()
  const { user } = useAuth()

  return (
    <CollectionEntryForm
      collection={collection}
      fields={fields}
      currentUser={user}
      onSubmit={handleClientSubmit}
    />
  )
}
```

## Validation

The form performs automatic validation based on:
- `validationRules.required` - Required fields
- `validationRules.minLength` / `maxLength` - String length
- `validationRules.min` / `max` - Numeric bounds
- Field type (email, url) - Format validation
- Custom patterns (future enhancement)

## Accessibility

- Proper label associations with `htmlFor`
- ARIA attributes on inputs
- Keyboard navigation support
- Screen reader friendly error messages
- Focus management

## Future Enhancements

- [ ] Rich text editor integration (TipTap/Slate)
- [ ] Image preview for file uploads
- [ ] Relationship field with search
- [ ] Array/repeater fields
- [ ] Conditional field visibility
- [ ] Custom validation rules
- [ ] Draft autosave
- [ ] Field groups/sections
- [ ] Multi-language support

## Dependencies

- shadcn/ui components (Input, Textarea, Select, etc.)
- date-fns (date formatting)
- Lucide icons
- React Hook Form (future consideration)
- Zod schema validation (future consideration)
