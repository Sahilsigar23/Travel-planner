import React, { PureComponent } from 'react'
import { Button } from '../ui/button'

export class Header extends PureComponent {
  render() {
    return (
      <div className='p-3 shadow-sm flex justify-between items-center px-5'>
        <img src='/logo.svg' alt='logo' />
      <Button>Sign in</Button>  
      </div>
    )
  }
}

export default Header
