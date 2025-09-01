import { render, screen } from '@testing-library/react'
import Home from '@/app/page'

// Mock next/image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    return <img {...props} />
  },
}))

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => {
    return <a href={href} {...props}>{children}</a>
  },
}))

// Mock the AuthContext
jest.mock('../../src/contexts/AuthContext', () => ({
  useAuth: () => ({
    user: null,
    loading: false,
    signInWithGoogle: jest.fn(),
    logout: jest.fn(),
  }),
  AuthProvider: ({ children }: { children: React.ReactNode }) => children,
}))

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />)
    expect(screen.getAllByText(/Sprite Sheet Generator/i)[0]).toBeInTheDocument()
  })

  it('renders the generate button', () => {
    render(<Home />)
    expect(screen.getByRole('button', { name: /generate/i })).toBeInTheDocument()
  })

  it('renders frame count selector', () => {
    render(<Home />)
    expect(screen.getByText(/Frame Count/i)).toBeInTheDocument()
  })

  it('renders the prompt input', () => {
    render(<Home />)
    expect(screen.getByPlaceholderText(/Generate a sprite sheet about/i)).toBeInTheDocument()
  })
})
