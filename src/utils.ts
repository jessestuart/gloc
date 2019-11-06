import { APP_NAME } from './constants'
import {
  GithubError,
  CodeFrequency,
  WeeklyAggregate,
} from './types'

/**
 * Logger
 * @param {string} type - info, warn, err
 * @param {string} str - info for output
 */
export const log = (type: string, str: any) => {
  switch (type) {
  case 'i':
    console.info(APP_NAME + ': ' + str)
    break
  case 'w':
    console.warn(APP_NAME + ': ' + str)
    break
  case 'e':
    console.error(APP_NAME + ': ' + str)
    break
  default:
    console.info(str)
  }
}

export const translateElements = (ids: string[]) => {
  ids.map(id => {
    const element = document.getElementById(id)
    element.innerHTML = chrome.i18n.getMessage(id)
  })
}

export const isEmpty = (obj: object) => {
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false
    }
  }
  return true
}

/**
 * @param {string} reponame /user/repo
 * @param {number} tries
 * @return {Promise<number>}
 */
export const getLoc = (reponame: string, tries: number, githubToken: string): Promise<number | void> => {
  if (tries === 0) {
    return Promise.reject('Repo: ' + reponame + '; Too many requests to API !')
  }

  const url = tokenizeUrl(getApiUrl(reponame), githubToken)

  return fetch(url)
    .then(response => response.json())
    .then(stat => {
      const isEmptyResponse = isEmpty(stat)
      if (stat && !isEmptyResponse) {
        return calculate(stat)
      }
      console.error(`Error by getting stat for ${reponame}. Response -->`, stat)
      return null
    })
    .catch((err: GithubError) => {
      if (err.message) {
        console.error('\t err', err)
      } else {
        getLoc(reponame, tries - 1, githubToken)
      }
    })
}

/**
 * Adds token to URL
 * @param {string} url
 * @return {string}
 */
export const tokenizeUrl = (url: string, githubToken: string) => {
  if (githubToken !== null && typeof githubToken === 'string') {
    return `${url}?access_token=${githubToken}`
  }
  log('e', 'Error by tokenizing URL')

  return ''
}

/**
 * @param {string} repo - /user/repo
 * @return {string}
 */
export const getApiUrl = (repoName: string) =>
  `https://api.github.com/repos${repoName}/stats/code_frequency`

export const calculate = (stat: CodeFrequency): number => {
  return stat.reduce(
    (total: number, changes: WeeklyAggregate) =>
      total + changes[1] + changes[2],
    0,
  )
}
