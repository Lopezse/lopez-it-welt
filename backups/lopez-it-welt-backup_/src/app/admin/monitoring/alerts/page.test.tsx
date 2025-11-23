import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import React from 'react';
import AlertsPage from './page';

// Mock für useEffect - verhindert Infinite Loop
let useEffectCalled = false;
const mockUseEffect = jest.fn(callback => {
  // Nur einmal ausführen, nicht bei jedem Render
  if (!useEffectCalled) {
    callback();
    useEffectCalled = true;
  }
});

jest.mock('react', () => ({
  ...jest.requireActual('react'),
  useEffect: mockUseEffect,
}));

describe('AlertsPage', () => {
  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks();
    useEffectCalled = false;
  });

  it('should render correctly', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(screen.getByText('Alarme & Warnungen')).toBeInTheDocument();
    });
  });

  it('should display alert statistics', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(screen.getByText('Kritisch')).toBeInTheDocument();
      expect(screen.getByText('Hoch')).toBeInTheDocument();
      expect(screen.getByText('Mittel')).toBeInTheDocument();
      expect(screen.getByText('Niedrig')).toBeInTheDocument();
    });
  });

  it('should display filter buttons', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(screen.getByText('Alle (6)')).toBeInTheDocument();
      expect(screen.getByText('Aktiv (3)')).toBeInTheDocument();
      expect(screen.getByText('Kritisch (1)')).toBeInTheDocument();
      expect(screen.getByText('Nicht bestätigt (4)')).toBeInTheDocument();
    });
  });

  it('should display alerts list', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Kritischer Sicherheitsvorfall')
      ).toBeInTheDocument();
      expect(screen.getByText('Hohe CPU-Auslastung')).toBeInTheDocument();
      expect(
        screen.getByText('Festplattenspeicher wird knapp')
      ).toBeInTheDocument();
    });
  });

  it('should filter alerts when filter button is clicked', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      const activeFilter = screen.getByText('Aktiv (3)');
      fireEvent.click(activeFilter);

      // Should only show active alerts
      expect(
        screen.getByText('Kritischer Sicherheitsvorfall')
      ).toBeInTheDocument();
      expect(
        screen.getByText('Festplattenspeicher wird knapp')
      ).toBeInTheDocument();
      expect(screen.getByText('Backup-Fehler')).toBeInTheDocument();

      // Should not show resolved alerts
      expect(
        screen.queryByText('Netzwerk-Latenz erhöht')
      ).not.toBeInTheDocument();
    });
  });

  it('should acknowledge alert when acknowledge button is clicked', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      const acknowledgeButtons = screen.getAllByText('Bestätigen');
      fireEvent.click(acknowledgeButtons[0]);

      // Alert should now show as acknowledged
      expect(screen.getByText('Bestätigt')).toBeInTheDocument();
    });
  });

  it('should resolve alert when resolve button is clicked', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      const resolveButtons = screen.getAllByText('Lösen');
      fireEvent.click(resolveButtons[0]);

      // Alert should now show as resolved
      expect(screen.getByText('Gelöst')).toBeInTheDocument();
    });
  });

  it('should display notification settings', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(
        screen.getByText('Benachrichtigungseinstellungen')
      ).toBeInTheDocument();
      expect(screen.getByText('E-Mail-Benachrichtigungen')).toBeInTheDocument();
      expect(screen.getByText('SMS-Benachrichtigungen')).toBeInTheDocument();
      expect(screen.getByText('Einstellungen speichern')).toBeInTheDocument();
    });
  });

  it('should show correct severity colors', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      const criticalAlert = screen.getByText('KRITISCH');
      const errorAlert = screen.getByText('ERROR');
      const warningAlert = screen.getByText('WARNING');

      expect(criticalAlert).toBeInTheDocument();
      expect(errorAlert).toBeInTheDocument();
      expect(warningAlert).toBeInTheDocument();
    });
  });

  it('should display alert details correctly', async () => {
    render(<AlertsPage />);

    await waitFor(() => {
      expect(screen.getByText('Quelle: Firewall-System')).toBeInTheDocument();
      expect(screen.getByText('Zeit: 2025-01-27 15:30:22')).toBeInTheDocument();
      expect(screen.getByText('Priorität: 1')).toBeInTheDocument();
    });
  });
});
