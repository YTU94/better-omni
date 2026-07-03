import { afterEach, describe, expect, it, vi } from 'vitest'
import { chromeService } from './chromeService'

const originalChrome = globalThis.chrome

afterEach(() => {
  globalThis.chrome = originalChrome
  vi.restoreAllMocks()
})

describe('chromeService bookmark mutations', () => {
  it('creates a bookmark from a tab title and URL', async () => {
    const create = vi.fn().mockResolvedValue({ id: 'bookmark-1' })
    globalThis.chrome = {
      bookmarks: { create },
    } as unknown as typeof chrome

    await chromeService.addBookmark('Iteration detail', 'https://example.com/iteration')

    expect(create).toHaveBeenCalledWith({
      title: 'Iteration detail',
      url: 'https://example.com/iteration',
    })
  })

  it('removes a bookmark by id', async () => {
    const remove = vi.fn().mockResolvedValue(undefined)
    globalThis.chrome = {
      bookmarks: { remove },
    } as unknown as typeof chrome

    await chromeService.removeBookmark('bookmark-1')

    expect(remove).toHaveBeenCalledWith('bookmark-1')
  })
})
