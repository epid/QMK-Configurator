import React from 'react'
import Key from './key'

export default ({ keymap, activeKeyType, setKey }) => {
  return (
    <div className='keyboard'>
      {keymap.map((r, i) => {
        return (
          <div className='row' key={`r${i}`}>
            {keymap[i].map(k => {
              return k.type !== 'nodisplay' && (
                <Key
                  key={k.id}
                  activeKeyType={activeKeyType}
                  setKey={setKey}
                  {...k} />
              )
            })}
          </div>
        )
      })}
    </div>
  )
}