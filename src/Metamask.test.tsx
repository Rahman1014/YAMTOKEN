import { render, fireEvent, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import WalletMenu from './components/navigation/wallet.menu'
import { MemoryRouter } from 'react-router-dom'; // Ensure we wrap the component in a router

beforeAll(() => {
  // Mocking MetaMask window.ethereum functionality
  global.window.ethereum = {
    request: jest.fn().mockResolvedValue(['0x123456789abcdef']), // Mock a valid response with one account
    on: jest.fn(),
  };
});

describe('WalletMenu', () => {
  test('connects to MetaMask and handles UI interactions', async () => {
    // Act wrapper for rendering the WalletMenu component
    await act(async () => {
      render(
        <MemoryRouter>
          <WalletMenu />
        </MemoryRouter>
      );
    });

    // 1. Check if the "Connect Wallet" button is visible
    const connectButton = screen.getByText(/connect wallet/i);
    expect(connectButton).toBeInTheDocument();

    // 2. Simulate a click to connect MetaMask
    fireEvent.click(connectButton);

    // 3. Ensure the "Connecting..." text is shown while connecting
    expect(screen.getByText(/connecting/i)).toBeInTheDocument();

    // 4. Wait for the wallet to connect and display the account avatar
    await waitFor(() => {
      expect(screen.getByText(/0x12...ef/i)).toBeInTheDocument();
    });

    // 5. Ensure the account is displayed in the shortened format in the avatar
    const accountText = screen.getByText(/0x12...ef/i); // Example: shortened account format
    expect(accountText).toBeInTheDocument();

    // 6. Simulate clicking the Avatar to open the dropdown menu
    fireEvent.click(accountText);

    // 7. Check that the account details and logout option are displayed
    expect(screen.getByText(/account/i)).toBeInTheDocument();
    expect(screen.getByText(/logout/i)).toBeInTheDocument();

    // 8. Simulate clicking the logout button
    fireEvent.click(screen.getByText(/logout/i));

    // 9. Ensure the wallet is disconnected and the "Connect Wallet" button is visible again
    await waitFor(() => {
      expect(screen.getByText(/connect wallet/i)).toBeInTheDocument();
    });
  });
});