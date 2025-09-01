import React from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { AuthProvider } from '@/contexts/AuthContext'

// Mock AuthContext for testing
const MockAuthProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <div data-testid="mock-auth-provider">
      {children}
    </div>
  )
}

// Mock useAuth hook
const mockUseAuth = () => ({
  user: null,
  loading: false,
  signInWithGoogle: jest.fn(),
  logout: jest.fn(),
})

// Custom render function that includes providers
const customRender = (
  ui: React.ReactElement,
  options?: Omit<RenderOptions, 'wrapper'>
) => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return <MockAuthProvider>{children}</MockAuthProvider>
  }

  return render(ui, { wrapper: Wrapper, ...options })
}

export * from '@testing-library/react'
export { customRender as render }

// Add a dummy test to prevent "no tests found" error
describe('Test Utils', () => {
  it('should export render function', () => {
    expect(customRender).toBeDefined()
  })
})
