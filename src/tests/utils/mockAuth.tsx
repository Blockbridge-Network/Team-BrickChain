import { createContext, useContext } from 'react';
import type { AuthContextType } from '@/contexts/AuthContext';

export const mockAuthContext: AuthContextType = {
  user: null,
  loading: false,
  signIn: jest.fn(),
  signUp: jest.fn(),
  signOut: jest.fn(),
  updateRole: jest.fn(),
  updateWallet: jest.fn(),
};

export const MockAuthContext = createContext<AuthContextType>(mockAuthContext);

export function useMockAuth() {
  return useContext(MockAuthContext);
}

export function withMockAuth(Component: React.ComponentType, contextValue: Partial<AuthContextType> = {}) {
  return function WrappedComponent(props: any) {
    return (
      <MockAuthContext.Provider value={{ ...mockAuthContext, ...contextValue }}>
        <Component {...props} />
      </MockAuthContext.Provider>
    );
  };
}
