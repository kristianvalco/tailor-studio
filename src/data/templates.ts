/**
 * Ready-made blueprint templates. Each `build()` returns a fresh set of fields
 * (new client ids) so a template can be inserted repeatedly without id clashes.
 */
import type { BlueprintType, Field, FieldOption } from '@/types'
import { createField } from '@/utils/factory'
import { createId } from '@/utils/id'

export interface BlueprintTemplate {
  id: string
  name: string
  description: string
  icon: string
  category: 'content' | 'commerce' | 'settings'
  build: () => {
    type: BlueprintType
    name: string
    handle: string
    navigation: { label: string; icon: string }
    fields: Field[]
  }
}

/** Build dropdown options with fresh ids. */
function opts(pairs: [string, string][]): FieldOption[] {
  return pairs.map(([value, label]) => ({ id: createId('opt'), value, label }))
}

export const blueprintTemplates: BlueprintTemplate[] = [
  {
    id: 'blog-post',
    name: 'Blog Post',
    description: 'Article with content, image, categories and publish date',
    icon: 'pencil',
    category: 'content',
    build: () => ({
      type: 'stream',
      name: 'Blog Posts',
      handle: 'Blog\\Post',
      navigation: { label: 'Blog', icon: 'icon-pencil' },
      fields: [
        createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
        createField('text', { handle: 'slug', label: 'Slug' }),
        createField('textarea', { handle: 'excerpt', label: 'Excerpt' }),
        createField('mediafinder', { handle: 'featured_image', label: 'Featured Image', config: { mode: 'image' } }),
        createField('richeditor', { handle: 'content', label: 'Content', config: { required: true } }),
        createField('entries', { handle: 'categories', label: 'Categories', config: { source: 'Blog\\Category', relationType: 'belongsToMany', displayMode: 'relation' } }),
        createField('datepicker', { handle: 'published_at', label: 'Published at', config: { mode: 'datetime' } }),
        createField('switch', { handle: 'is_featured', label: 'Featured' }),
      ],
    }),
  },
  {
    id: 'blog-category',
    name: 'Blog Category',
    description: 'Simple category with title, slug and description',
    icon: 'folder',
    category: 'content',
    build: () => ({
      type: 'structure',
      name: 'Categories',
      handle: 'Blog\\Category',
      navigation: { label: 'Categories', icon: 'icon-folder' },
      fields: [
        createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
        createField('text', { handle: 'slug', label: 'Slug' }),
        createField('textarea', { handle: 'description', label: 'Description' }),
      ],
    }),
  },
  {
    id: 'page',
    name: 'Page',
    description: 'Generic content page with body and SEO meta',
    icon: 'file-text',
    category: 'content',
    build: () => ({
      type: 'structure',
      name: 'Pages',
      handle: 'Content\\Page',
      navigation: { label: 'Pages', icon: 'icon-file-text-o' },
      fields: [
        createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
        createField('text', { handle: 'slug', label: 'Slug' }),
        createField('richeditor', { handle: 'body', label: 'Body' }),
        createField('text', { handle: 'meta_title', label: 'Meta Title', config: { tab: 'SEO' } }),
        createField('textarea', { handle: 'meta_description', label: 'Meta Description', config: { tab: 'SEO' } }),
      ],
    }),
  },
  {
    id: 'faq',
    name: 'FAQ Item',
    description: 'Question and answer pair',
    icon: 'message',
    category: 'content',
    build: () => ({
      type: 'structure',
      name: 'FAQ',
      handle: 'Content\\Faq',
      navigation: { label: 'FAQ', icon: 'icon-question-circle' },
      fields: [
        createField('text', { handle: 'question', label: 'Question', config: { required: true } }),
        createField('richeditor', { handle: 'answer', label: 'Answer' }),
      ],
    }),
  },
  {
    id: 'team-member',
    name: 'Team Member',
    description: 'Person with photo, role, bio and social links',
    icon: 'users',
    category: 'content',
    build: () => ({
      type: 'structure',
      name: 'Team',
      handle: 'Content\\TeamMember',
      navigation: { label: 'Team', icon: 'icon-users' },
      fields: [
        createField('text', { handle: 'name', label: 'Name', config: { required: true } }),
        createField('text', { handle: 'role', label: 'Role' }),
        createField('mediafinder', { handle: 'photo', label: 'Photo', config: { mode: 'image' } }),
        createField('textarea', { handle: 'bio', label: 'Bio' }),
        createField('repeater', {
          handle: 'socials',
          label: 'Social Links',
          config: { prompt: 'Add link' },
          fields: [
            createField('dropdown', { handle: 'platform', label: 'Platform', config: { options: opts([['facebook', 'Facebook'], ['instagram', 'Instagram'], ['x', 'X / Twitter'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube']]) } }),
            createField('text', { handle: 'url', label: 'URL' }),
          ],
        }),
      ],
    }),
  },
  {
    id: 'testimonial',
    name: 'Testimonial',
    description: 'Customer quote with author and rating',
    icon: 'star',
    category: 'content',
    build: () => ({
      type: 'structure',
      name: 'Testimonials',
      handle: 'Content\\Testimonial',
      navigation: { label: 'Testimonials', icon: 'icon-star' },
      fields: [
        createField('text', { handle: 'author', label: 'Author', config: { required: true } }),
        createField('text', { handle: 'author_role', label: 'Author Role' }),
        createField('mediafinder', { handle: 'avatar', label: 'Avatar', config: { mode: 'image' } }),
        createField('textarea', { handle: 'quote', label: 'Quote', config: { required: true } }),
        createField('number', { handle: 'rating', label: 'Rating', config: { min: 1, max: 5, step: 1 } }),
      ],
    }),
  },
  {
    id: 'product',
    name: 'Product',
    description: 'Shop product with price, gallery and categories',
    icon: 'box',
    category: 'commerce',
    build: () => ({
      type: 'structure',
      name: 'Products',
      handle: 'Shop\\Product',
      navigation: { label: 'Products', icon: 'icon-shopping-cart' },
      fields: [
        createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
        createField('text', { handle: 'slug', label: 'Slug' }),
        createField('text', { handle: 'sku', label: 'SKU' }),
        createField('number', { handle: 'price', label: 'Price', config: { min: 0, step: 0.01 } }),
        createField('richeditor', { handle: 'description', label: 'Description' }),
        createField('mediafinder', { handle: 'gallery', label: 'Gallery', config: { mode: 'image', maxItems: 10 } }),
        createField('switch', { handle: 'in_stock', label: 'In stock', config: { default: true } }),
      ],
    }),
  },
  {
    id: 'site-settings',
    name: 'Site Settings',
    description: 'Global site name, logo, colors and description',
    icon: 'settings',
    category: 'settings',
    build: () => ({
      type: 'global',
      name: 'Site Settings',
      handle: 'Settings\\Site',
      navigation: { label: 'Site Settings', icon: 'icon-cog' },
      fields: [
        createField('text', { handle: 'site_name', label: 'Site Name', config: { required: true } }),
        createField('textarea', { handle: 'description', label: 'Description' }),
        createField('mediafinder', { handle: 'logo', label: 'Logo', config: { mode: 'image' } }),
        createField('mediafinder', { handle: 'favicon', label: 'Favicon', config: { mode: 'image' } }),
        createField('colorpicker', { handle: 'primary_color', label: 'Primary Color' }),
      ],
    }),
  },
  {
    id: 'social-networks',
    name: 'Social Networks',
    description: 'Global list of social network profiles',
    icon: 'link',
    category: 'settings',
    build: () => ({
      type: 'global',
      name: 'Social Networks',
      handle: 'Settings\\Social',
      navigation: { label: 'Social Networks', icon: 'icon-globe' },
      fields: [
        createField('repeater', {
          handle: 'networks',
          label: 'Networks',
          config: { prompt: 'Add network' },
          fields: [
            createField('dropdown', { handle: 'platform', label: 'Platform', config: { options: opts([['facebook', 'Facebook'], ['instagram', 'Instagram'], ['x', 'X / Twitter'], ['linkedin', 'LinkedIn'], ['youtube', 'YouTube'], ['tiktok', 'TikTok'], ['github', 'GitHub']]) } }),
            createField('text', { handle: 'url', label: 'URL' }),
          ],
        }),
      ],
    }),
  },
  {
    id: 'contact-info',
    name: 'Contact Info',
    description: 'Global contact email, phone and address',
    icon: 'phone',
    category: 'settings',
    build: () => ({
      type: 'global',
      name: 'Contact Info',
      handle: 'Settings\\Contact',
      navigation: { label: 'Contact Info', icon: 'icon-phone' },
      fields: [
        createField('text', { handle: 'email', label: 'Email' }),
        createField('text', { handle: 'phone', label: 'Phone' }),
        createField('textarea', { handle: 'address', label: 'Address' }),
        createField('text', { handle: 'map_url', label: 'Map URL' }),
      ],
    }),
  },
  {
    id: 'seo-defaults',
    name: 'SEO Defaults',
    description: 'Global default meta title, description and OG image',
    icon: 'search',
    category: 'settings',
    build: () => ({
      type: 'global',
      name: 'SEO Defaults',
      handle: 'Settings\\Seo',
      navigation: { label: 'SEO Defaults', icon: 'icon-search' },
      fields: [
        createField('text', { handle: 'meta_title', label: 'Default Meta Title' }),
        createField('textarea', { handle: 'meta_description', label: 'Default Meta Description' }),
        createField('mediafinder', { handle: 'og_image', label: 'Default OG Image', config: { mode: 'image' } }),
      ],
    }),
  },
]
