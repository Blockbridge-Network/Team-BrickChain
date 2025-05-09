import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';
import { MockAuthContext, mockAuthContext } from './mockAuth';
import { MockThirdWebContext, createMockWallet } from './mockThirdWeb';

export interface WrapperOptions {
  user?: {
    id?: string;
    walletAddress?: string;
    role?: 'PROPERTY_OWNER' | 'INVESTOR';
  };
  wallet?: {
    connected?: boolean;
    address?: string;
  };
}

export function renderWithProviders(
  ui: ReactElement,
  options: WrapperOptions = {},
  renderOptions: Omit<RenderOptions, 'wrapper'> = {}
) {
  const defaultWallet = createMockWallet();
  const wallet = options.wallet?.connected ? defaultWallet : null;

  if (wallet) {
    wallet.getAddress.mockResolvedValue(options.wallet.address);
  }

  const authContextValue = {
    ...mockAuthContext,
    user: options.user ? {
      id: options.user.id || 'test-user-id',
      walletAddress: options.user.walletAddress || '',
      role: options.user.role || 'INVESTOR',
    } : null,
  };

  function Wrapper({ children }: { children: React.ReactNode }) {
    return (
      <MockAuthContext.Provider value={authContextValue}>
        <MockThirdWebContext.Provider value={{ wallet }}>
          {children}
        </MockThirdWebContext.Provider>
      </MockAuthContext.Provider>
    );
  }

  return {
    ...render(ui, { wrapper: Wrapper, ...renderOptions }),
    mockWallet: wallet,
    authContext: authContextValue,
  };
}

export * from '@testing-library/react';
export { renderWithProviders as render };
