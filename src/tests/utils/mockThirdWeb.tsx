import { createContext, useContext } from 'react';

export interface MockWallet {
  connect: jest.Mock;
  disconnect: jest.Mock;
  getAddress: jest.Mock;
}

export const createMockWallet = (): MockWallet => ({
  connect: jest.fn(),
  disconnect: jest.fn(),
  getAddress: jest.fn(),
});

export const MockThirdWebContext = createContext<{
  wallet: MockWallet | null;
}>({
  wallet: null,
});

export const useWallet = () => {
  return useContext(MockThirdWebContext).wallet;
};

export function withMockThirdWeb(Component: React.ComponentType, wallet: MockWallet | null = null) {
  return function WrappedComponent(props: any) {
    return (
      <MockThirdWebContext.Provider value={{ wallet }}>
        <Component {...props} />
      </MockThirdWebContext.Provider>
    );
  };
}
