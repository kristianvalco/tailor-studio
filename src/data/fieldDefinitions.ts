/**
 * Registry of all supported Tailor field types.
 *
 * This is the single source of truth for: the "Add field" menu, the field
 * inspector controls, and the defaults applied on creation. Adding a new field
 * type is (mostly) a matter of adding an entry here.
 */
import type { FieldDefinition, FieldOptionControl, FieldType } from '@/types'

/** Controls shared by virtually every field. */
const commonControls: FieldOptionControl[] = [
  {
    key: 'required',
    label: 'Required',
    control: 'switch',
    help: 'Mark the field as mandatory in the backend form.',
    default: false,
  },
  {
    key: 'comment',
    label: 'Comment',
    control: 'text',
    placeholder: 'Helper text shown under the field',
  },
  {
    key: 'span',
    label: 'Span',
    control: 'select',
    choices: [
      { value: 'full', label: 'Full' },
      { value: 'left', label: 'Left' },
      { value: 'right', label: 'Right' },
      { value: 'auto', label: 'Auto' },
    ],
    default: 'full',
  },
  { key: 'tab', label: 'Tab', control: 'text', placeholder: 'Optional tab name' },
]

const defaultControl: FieldOptionControl = {
  key: 'default',
  label: 'Default value',
  control: 'text',
}

export const fieldDefinitions: FieldDefinition[] = [
  {
    type: 'text',
    label: 'Text',
    icon: 'type',
    description: 'Single-line text input',
    category: 'basic',
    options: [
      { key: 'placeholder', label: 'Placeholder', control: 'text' },
      defaultControl,
      ...commonControls,
    ],
  },
  {
    type: 'textarea',
    label: 'Textarea',
    icon: 'text',
    description: 'Multi-line plain text',
    category: 'basic',
    options: [
      { key: 'placeholder', label: 'Placeholder', control: 'text' },
      { key: 'size', label: 'Size', control: 'select', choices: [
        { value: 'small', label: 'Small' },
        { value: 'large', label: 'Large' },
        { value: 'huge', label: 'Huge' },
      ], default: 'large' },
      ...commonControls,
    ],
  },
  {
    type: 'markdown',
    label: 'Markdown',
    icon: 'hash',
    description: 'Markdown editor with preview',
    category: 'rich',
    options: [...commonControls],
  },
  {
    type: 'richeditor',
    label: 'Rich Editor',
    icon: 'pilcrow',
    description: 'WYSIWYG HTML editor',
    category: 'rich',
    options: [
      { key: 'toolbarButtons', label: 'Toolbar buttons', control: 'text',
        placeholder: 'bold|italic|insertLink' },
      ...commonControls,
    ],
  },
  {
    type: 'number',
    label: 'Number',
    icon: 'hash',
    description: 'Numeric input',
    category: 'basic',
    options: [
      { key: 'min', label: 'Min', control: 'number' },
      { key: 'max', label: 'Max', control: 'number' },
      { key: 'step', label: 'Step', control: 'number', default: 1 },
      defaultControl,
      ...commonControls,
    ],
  },
  {
    type: 'datepicker',
    label: 'Date',
    icon: 'calendar',
    description: 'Date / time picker',
    category: 'basic',
    options: [
      { key: 'mode', label: 'Mode', control: 'select', choices: [
        { value: 'date', label: 'Date' },
        { value: 'datetime', label: 'Date & time' },
        { value: 'time', label: 'Time' },
      ], default: 'date' },
      ...commonControls,
    ],
  },
  {
    type: 'switch',
    label: 'Switch',
    icon: 'toggle-right',
    description: 'Boolean toggle',
    category: 'choice',
    options: [
      { key: 'default', label: 'Default on', control: 'switch', default: false },
      ...commonControls,
    ],
  },
  {
    type: 'checkbox',
    label: 'Checkbox',
    icon: 'check-square',
    description: 'Single checkbox',
    category: 'choice',
    options: [
      { key: 'default', label: 'Checked by default', control: 'switch', default: false },
      ...commonControls,
    ],
  },
  {
    type: 'dropdown',
    label: 'Dropdown',
    icon: 'chevron-down',
    description: 'Select from a list of options',
    category: 'choice',
    options: [
      { key: 'options', label: 'Options', control: 'options' },
      defaultControl,
      ...commonControls,
    ],
  },
  {
    type: 'colorpicker',
    label: 'Color Picker',
    icon: 'palette',
    description: 'Hex color value',
    category: 'choice',
    options: [defaultControl, ...commonControls],
  },
  {
    type: 'mediafinder',
    label: 'Media Finder',
    icon: 'image',
    description: 'Pick from the media library',
    category: 'media',
    options: [
      { key: 'mode', label: 'Mode', control: 'select', choices: [
        { value: 'image', label: 'Image' },
        { value: 'file', label: 'File' },
      ], default: 'image' },
      { key: 'maxItems', label: 'Max items', control: 'number', default: 1 },
      ...commonControls,
    ],
  },
  {
    type: 'fileupload',
    label: 'File Upload',
    icon: 'upload',
    description: 'Direct file attachment',
    category: 'media',
    options: [
      { key: 'mode', label: 'Mode', control: 'select', choices: [
        { value: 'image', label: 'Image' },
        { value: 'file', label: 'File' },
      ], default: 'file' },
      { key: 'maxItems', label: 'Max items', control: 'number', default: 1 },
      ...commonControls,
    ],
  },
  {
    type: 'codeeditor',
    label: 'Code Editor',
    icon: 'code',
    description: 'Syntax-highlighted code field',
    category: 'rich',
    options: [
      { key: 'language', label: 'Language', control: 'select', choices: [
        { value: 'html', label: 'HTML' },
        { value: 'css', label: 'CSS' },
        { value: 'javascript', label: 'JavaScript' },
        { value: 'php', label: 'PHP' },
        { value: 'twig', label: 'Twig' },
        { value: 'json', label: 'JSON' },
      ], default: 'html' },
      ...commonControls,
    ],
  },
  {
    type: 'repeater',
    label: 'Repeater',
    icon: 'layers',
    description: 'Repeatable group of nested fields',
    category: 'relational',
    nestable: true,
    options: [
      { key: 'maxItems', label: 'Max items', control: 'number' },
      { key: 'prompt', label: 'Add prompt', control: 'text', placeholder: 'Add new item' },
      ...commonControls,
    ],
  },
  {
    type: 'entries',
    label: 'Entries',
    icon: 'link',
    description: 'Relation to another blueprint',
    category: 'relational',
    options: [
      { key: 'source', label: 'Source blueprint', control: 'blueprint' },
      { key: 'relationType', label: 'Relation', control: 'select', choices: [
        { value: 'hasMany', label: 'Has many' },
        { value: 'hasOne', label: 'Has one' },
        { value: 'belongsTo', label: 'Belongs to' },
        { value: 'belongsToMany', label: 'Belongs to many' },
      ], default: 'hasMany' },
      { key: 'displayMode', label: 'Display mode', control: 'select', choices: [
        { value: 'recordfinder', label: 'Record finder' },
        { value: 'taglist', label: 'Tag list' },
        { value: 'controller', label: 'Controller' },
        { value: 'relation', label: 'Relation' },
      ], default: 'recordfinder' },
      { key: 'maxItems', label: 'Max items', control: 'number' },
      ...commonControls,
    ],
  },
  {
    type: 'section',
    label: 'Section',
    icon: 'minus',
    description: 'Visual divider in the form',
    category: 'layout',
    options: [
      { key: 'comment', label: 'Comment', control: 'text' },
      { key: 'tab', label: 'Tab', control: 'text' },
    ],
  },
  {
    type: 'partial',
    label: 'Partial',
    icon: 'puzzle',
    description: 'Render a custom backend partial',
    category: 'layout',
    options: [
      { key: 'path', label: 'Partial path', control: 'text', placeholder: '$/author/plugin/partials/_field.htm' },
      ...commonControls,
    ],
  },
]

/** Fast lookup by type. */
export const fieldDefinitionMap: Record<FieldType, FieldDefinition> =
  fieldDefinitions.reduce((acc, def) => {
    acc[def.type] = def
    return acc
  }, {} as Record<FieldType, FieldDefinition>)

export function getFieldDefinition(type: FieldType): FieldDefinition {
  return fieldDefinitionMap[type]
}
