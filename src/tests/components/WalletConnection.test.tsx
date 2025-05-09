import { render, screen, fireEvent, waitFor } from '../utils/test-helpers';
import '@testing-library/jest-dom';
import WalletConnection from '@/components/wallet/WalletConnection';

describe('WalletConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock useAuth hook implementation
    (useAuth as jest.Mock).mockReturnValue({
      user: { walletAddress: '' },
      updateWallet: mockUpdateWallet,
    });

    // Mock useWallet hook implementation
    (useWallet as jest.Mock).mockReturnValue({
      connect: mockWalletConnect,
      disconnect: mockWalletDisconnect,
      getAddress: mockGetAddress,
    });
  });

  it('renders connect button when wallet is not connected', () => {
    render(<WalletConnection />);
    expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
  });

  it('shows connecting state while connecting wallet', async () => {
    mockWalletConnect.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

    render(<WalletConnection />);
    
    fireEvent.click(screen.getByText('Connect Wallet'));
    
    expect(screen.getByText('Connecting...')).toBeInTheDocument();
    expect(screen.getByRole('button')).toBeDisabled();
  });

  it('shows disconnect button when wallet is connected', () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { walletAddress: '0x1234567890123456789012345678901234567890' },
      updateWallet: mockUpdateWallet,
    });

    render(<WalletConnection />);
    expect(screen.getByText('Disconnect')).toBeInTheDocument();
  });

  it('handles successful wallet connection', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    mockWalletConnect.mockResolvedValue(address);

    render(<WalletConnection />);
    
    fireEvent.click(screen.getByText('Connect Wallet'));

    await waitFor(() => {
      expect(mockUpdateWallet).toHaveBeenCalledWith(address);
    });
  });

  it('handles wallet connection error', async () => {
    const errorMessage = 'Failed to connect wallet';
    mockWalletConnect.mockRejectedValue(new Error(errorMessage));

    render(<WalletConnection />);
    
    fireEvent.click(screen.getByText('Connect Wallet'));

    await waitFor(() => {
      expect(screen.getByText(errorMessage)).toBeInTheDocument();
    });
  });

  it('handles wallet disconnection', async () => {
    (useAuth as jest.Mock).mockReturnValue({
      user: { walletAddress: '0x1234567890123456789012345678901234567890' },
      updateWallet: mockUpdateWallet,
    });

    render(<WalletConnection />);
    
    fireEvent.click(screen.getByText('Disconnect'));

    await waitFor(() => {
      expect(mockWalletDisconnect).toHaveBeenCalled();
      expect(mockUpdateWallet).toHaveBeenCalledWith('');
    });
  });

  it('checks wallet connection on mount', async () => {
    const address = '0x1234567890123456789012345678901234567890';
    mockGetAddress.mockResolvedValue(address);
    
    (useAuth as jest.Mock).mockReturnValue({
      user: { walletAddress: '' },
      updateWallet: mockUpdateWallet,
    });

    render(<WalletConnection />);

    await waitFor(() => {
      expect(mockGetAddress).toHaveBeenCalled();
      expect(mockUpdateWallet).toHaveBeenCalledWith(address);
    });
  });
});
