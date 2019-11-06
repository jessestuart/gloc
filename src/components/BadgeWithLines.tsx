import * as React from 'react'
import { APP_CLASSNAME } from '../constants'

export const BadgeWithLines = ({ lines }: { lines?: string | number }) => {
  return (
    <div
      style={{
        display: 'inline',
        fontFamily: '-apple-system,BlinkMacSystemFont,Segoe UI,Helvetica,Arial,sans-serif,Apple Color Emoji,Segoe UI Emoji',
        fontSize: 0,
        marginLeft: '12px',
      }}
    >
      <span
        style={{
          backgroundColor: '#555',
          borderRadius: '3px 0 0 3px',
          color: 'white',
          fontSize: '10px',
          padding: '2px 4px',
        }}
      >
        {chrome.i18n.getMessage('lines')}
      </span>
      <span
        className={APP_CLASSNAME}
        style={{
          backgroundColor: '#44CC11',
          color: 'white',
          padding: '2px 4px',
          fontSize: '10px',
          borderRadius: '0 3px 3px 0',
        }}
      >
        {lines}
      </span>
    </div>
  )
}
