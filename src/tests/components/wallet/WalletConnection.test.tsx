import { render, screen, fireEvent, waitFor } from '../../utils/test-helpers';
import '@testing-library/jest-dom';
import WalletConnection from '@/components/wallet/WalletConnection';

describe('WalletConnection', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Rendering', () => {
    it('should show nothing when user is not authenticated', () => {
      render(<WalletConnection />);
      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('should show connect button when user has no wallet', () => {
      render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: '' }
      });
      expect(screen.getByText('Connect Wallet')).toBeInTheDocument();
    });

    it('should show wallet address when connected', () => {
      const address = '0x1234567890123456789012345678901234567890';
      render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: address }
      });
      expect(screen.getByText('0x1234...7890')).toBeInTheDocument();
      expect(screen.getByText('Disconnect')).toBeInTheDocument();
    });
  });

  describe('Wallet Connection', () => {
    const setup = () => {
      const address = '0x1234567890123456789012345678901234567890';
      const result = render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: '' },
        wallet: { connected: true, address }
      });

      return { ...result, address };
    };

    it('should show loading state while connecting', async () => {
      const { mockWallet } = setup();
      mockWallet?.connect.mockImplementation(() => new Promise(resolve => setTimeout(resolve, 100)));

      fireEvent.click(screen.getByText('Connect Wallet'));
      
      expect(screen.getByText('Connecting...')).toBeInTheDocument();
      expect(screen.getByRole('button')).toBeDisabled();
    });

    it('should update wallet address on successful connection', async () => {
      const { mockWallet, address } = setup();

      fireEvent.click(screen.getByText('Connect Wallet'));

      await waitFor(() => {
        expect(mockWallet?.connect).toHaveBeenCalled();
      });
    });

    it('should show error message on connection failure', async () => {
      const { mockWallet } = setup();
      const errorMessage = 'Failed to connect wallet';
      mockWallet?.connect.mockRejectedValueOnce(new Error(errorMessage));

      fireEvent.click(screen.getByText('Connect Wallet'));

      await waitFor(() => {
        expect(screen.getByText(errorMessage)).toBeInTheDocument();
      });
    });
  });

  describe('Wallet Disconnection', () => {
    it('should handle disconnection', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const { mockWallet } = render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: address },
        wallet: { connected: true, address }
      });

      fireEvent.click(screen.getByText('Disconnect'));

      await waitFor(() => {
        expect(mockWallet?.disconnect).toHaveBeenCalled();
      });
    });
  });

  describe('Auto Connection', () => {
    it('should check wallet connection on mount', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const { mockWallet } = render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: '' },
        wallet: { connected: true, address }
      });

      await waitFor(() => {
        expect(mockWallet?.getAddress).toHaveBeenCalled();
      });
    });

    it('should not update if wallet is already connected', async () => {
      const address = '0x1234567890123456789012345678901234567890';
      const { mockWallet } = render(<WalletConnection />, {
        user: { id: 'test-user', walletAddress: address },
        wallet: { connected: true, address }
      });

      await waitFor(() => {
        expect(mockWallet?.getAddress).toHaveBeenCalled();
      });
    });
  });
});