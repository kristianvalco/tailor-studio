/**
 * Seed data so the app is fully navigable before any persistence exists.
 */
import type { Blueprint } from '@/types'
import { createBlueprint, createField } from '@/utils/factory'

export function createMockBlueprints(): Blueprint[] {
  const home = createBlueprint('single', {
    handle: 'Pages\\Home',
    name: 'Home',
    navigation: { label: 'Home', icon: 'icon-home', order: 100 },
    fields: [
      createField('text', { handle: 'heading', label: 'Heading', config: { required: true } }),
      createField('textarea', { handle: 'subheading', label: 'Subheading' }),
      createField('mediafinder', { handle: 'hero_image', label: 'Hero Image', config: { mode: 'image', maxItems: 1 } }),
    ],
  })

  const about = createBlueprint('single', {
    handle: 'Pages\\About',
    name: 'About',
    navigation: { label: 'About', icon: 'icon-info', order: 110 },
    fields: [
      createField('text', { handle: 'title', label: 'Title' }),
      createField('richeditor', { handle: 'body', label: 'Body' }),
    ],
  })

  const services = createBlueprint('structure', {
    handle: 'Content\\Services',
    name: 'Services',
    navigation: { label: 'Services', icon: 'icon-cogs', order: 120 },
    fields: [
      createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
      createField('text', { handle: 'slug', label: 'Slug' }),
      createField('repeater', {
        handle: 'benefits',
        label: 'Benefits',
        config: { prompt: 'Add benefit' },
        fields: [
          createField('text', { handle: 'title', label: 'Title' }),
          createField('textarea', { handle: 'description', label: 'Description' }),
          createField('mediafinder', { handle: 'icon', label: 'Icon', config: { mode: 'image' } }),
          createField('text', { handle: 'button_text', label: 'Button Text' }),
          createField('text', { handle: 'button_url', label: 'Button URL' }),
        ],
      }),
    ],
  })

  const products = createBlueprint('structure', {
    handle: 'Shop\\Products',
    name: 'Products',
    navigation: { label: 'Products', icon: 'icon-shopping-cart', order: 130 },
    fields: [
      createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
      createField('text', { handle: 'slug', label: 'Slug' }),
      createField('number', { handle: 'price', label: 'Price', config: { step: 0.01, min: 0 } }),
      createField('mediafinder', { handle: 'image', label: 'Image', config: { mode: 'image' } }),
      createField('switch', { handle: 'is_featured', label: 'Featured' }),
    ],
  })

  const blog = createBlueprint('stream', {
    handle: 'Blog\\Post',
    name: 'Blog',
    navigation: { label: 'Blog', icon: 'icon-pencil', order: 140 },
    fields: [
      createField('text', { handle: 'title', label: 'Title', config: { required: true } }),
      createField('text', { handle: 'slug', label: 'Slug' }),
      createField('richeditor', { handle: 'content', label: 'Content' }),
      createField('entries', {
        handle: 'categories',
        label: 'Categories',
        config: { source: 'Blog\\Category', relationType: 'belongsToMany', displayMode: 'relation', maxItems: 5 },
      }),
    ],
  })

  const settings = createBlueprint('global', {
    handle: 'Settings\\General',
    name: 'Global Settings',
    navigation: { label: 'Global Settings', icon: 'icon-sliders' },
    fields: [
      createField('text', { handle: 'site_name', label: 'Site Name' }),
      createField('mediafinder', { handle: 'logo', label: 'Logo', config: { mode: 'image' } }),
      createField('colorpicker', { handle: 'brand_color', label: 'Brand Color' }),
    ],
  })

  return [home, about, services, products, blog, settings]
}
