/**
 * https://github.com/artem-solovev/gloc
 *
 * Licensed GPL-2.0 © Artem Solovev
 */
import * as $ from 'jquery'
import * as React from 'react'
import { renderToString } from 'react-dom/server'

import { APP_CLASSNAME, TRIES_DEFAULT } from './constants'
import { LOCATION, InitialData } from './types'
import { log, getLoc } from './utils'
import { BadgeWithLines } from './components/BadgeWithLines'

/**
 * Accepted abbreviations
 * - LOC - lines of code
 */

let githubToken: string = null

const gloc = (): void => {
    init()
      .then(res => {
        appendLoc(res)
        log('info', res)
      })
      .catch(err => log('err', err))
  }

  /**
   * Main
   */
;(() => {
  chrome.storage.sync.get({ 'x-github-token': '' }, result => {
    if (result && result['x-github-token'] !== null) {
      githubToken = result['x-github-token']
    }

    gloc()

    $(document).on('pjax:complete', () => {
      gloc()
    })
  })
})()

/**
 * REFACTORED
 */
const init = (): Promise<InitialData> => {
  /**
   * Current user's location
   */
  const current: InitialData = {
    location: null,
    link: null,
  }

  // User's repos
  const user = document.querySelectorAll('#user-repositories-list h3 a')
  const isUser = user.length > 0 ? LOCATION.USER : false

  // Organisation's repos
  const organisation = document.querySelectorAll('.repo-list h3 a')
  const isOrganisation = organisation.length > 0 ? LOCATION.ORGANIZATION : false

  // Recommended repos
  const recommended = document.querySelectorAll(
    '#recommended-repositories-container h3 a',
  )
  const isRecommended = recommended.length > 0 ? LOCATION.RECOMMENDED : false

  // Single repo
  const single: HTMLAnchorElement = document.querySelector(
    '.repohead-details-container h1 strong a',
  )
  const isSingle = single ? LOCATION.SINGLE : false

  if (isUser) {
    current.location = LOCATION.USER
    current.link = Array.prototype.slice.call(user)
  } else if (isOrganisation) {
    current.location = LOCATION.ORGANIZATION
    current.link = Array.prototype.slice.call(organisation)
  } else if (isRecommended) {
    current.location = LOCATION.RECOMMENDED
    current.link = Array.prototype.slice.call(recommended)
  } else if (isSingle) {
    current.location = LOCATION.SINGLE
    current.link = [single]
  } else {
    current.location = LOCATION.UNKNOWN
  }

  if (current.location !== LOCATION.UNKNOWN && current.link.length > 0) {
    return Promise.resolve(current)
  } else {
    return Promise.reject(
      'Error: unknown location for counting LOC (lines of code)',
    )
  }
}

const appendLoc = (config: InitialData) => {
  config.link.map(anchor => {
    const reponame = anchor.getAttribute('href')

    if (reponame) {
      getLoc(reponame, TRIES_DEFAULT, githubToken)
        .then(loc => setLoc(anchor, format(loc)))
        .catch(err =>
          console.error(`Error by setting LOC for ${reponame}`, err),
        )
    }
  })
}

export const setLoc = (anchor: HTMLAnchorElement, loc: string) => {
  anchor.innerHTML += renderToString(<BadgeWithLines lines={loc} />)
}

/**
 * Convert number into human-readable string
 * @param {number} num
 * @return {string}
 */
const readable = (num: number): string => {
  if (num < 1_000) {
    return String(num)
  } else if (num < 10_000) {
    return String(Math.round(num / 100) / 10) + 'K'
  } else if (num < 1_000_000) {
    return String(Math.round(num / 1_000)) + 'K'
  } else if (num < 10_000_000) {
    return String(Math.round(num / 100_000) / 10) + 'M'
  } else if (num < 1_000_000_000) {
    return String(Math.round(num / 1_000_000)) + 'M'
  } else if (num < 10_000_000_000) {
    return String(Math.round(num / 100_000_000) / 10) + 'G'
  } else {
    return String(num)
  }
}

/**
 * Format rawline counts into string to show
 * @param {number | void} rawlines - LOC | null
 * @return {string}
 */
const format = (rawlines: number | void): string => {
  if (typeof rawlines == 'number') {
    return readable(rawlines)
  }
  if (rawlines == null) {
    return 'Stat is unavailable'
  }
}
