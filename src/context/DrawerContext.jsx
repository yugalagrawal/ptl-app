import { createContext, useContext, useState } from 'react'

const DrawerContext = createContext(null)

export function DrawerProvider({ children }) {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <DrawerContext.Provider value={{ isOpen, open: () => setIsOpen(true), close: () => setIsOpen(false) }}>
      {children}
    </DrawerContext.Provider>
  )
}

export function useDrawer() {
  return useContext(DrawerContext)
}
