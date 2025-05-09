import { render, act, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { useAddress } from 'thirdweb/react';

jest.mock('thirdweb/react', () => ({
  ...jest.requireActual('thirdweb/react'),
  useAddress: jest.fn(),
}));

const TestComponent = () => {
  const { user, isLoading, updateWallet } = useAuth();
  return (
    <div>
      <div data-testid="loading">{isLoading.toString()}</div>
      <div data-testid="user">{JSON.stringify(user)}</div>
      <button onClick={() => updateWallet('0x123')}>Update Wallet</button>
    </div>
  );
};

describe('AuthContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('provides initial user state', () => {
    const { getByTestId } = render(
      <AuthProvider initialUser={{ id: 'test', walletAddress: '' }}>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('user')).toHaveTextContent('{"id":"test","walletAddress":""}');
  });

  it('updates wallet address when connected', async () => {
    (useAddress as jest.Mock).mockReturnValue('0x123');

    const { getByTestId, getByRole } = render(
      <AuthProvider initialUser={{ id: 'test', walletAddress: '' }}>
        <TestComponent />
      </AuthProvider>
    );

    await act(async () => {
      getByRole('button').click();
    });

    await waitFor(() => {
      expect(getByTestId('user')).toHaveTextContent('"walletAddress":"0x123"');
    });
  });

  it('handles wallet disconnection', async () => {
    (useAddress as jest.Mock).mockReturnValue(null);

    const { getByTestId } = render(
      <AuthProvider initialUser={{ id: 'test', walletAddress: '0x123' }}>
        <TestComponent />
      </AuthProvider>
    );

    await waitFor(() => {
      expect(getByTestId('user')).toHaveTextContent('"walletAddress":""');
    });
  });

  it('preserves loading state during auth operations', async () => {
    const { getByTestId } = render(
      <AuthProvider initialUser={null}>
        <TestComponent />
      </AuthProvider>
    );

    expect(getByTestId('loading')).toHaveTextContent('true');

    await waitFor(() => {
      expect(getByTestId('loading')).toHaveTextContent('false');
    });
  });
});