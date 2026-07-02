import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AcademyNavbar } from '@/components/academy/AcademyNavbar';
import { BrowserRouter } from 'react-router-dom';

const renderNavbar = (props: Partial<Parameters<typeof AcademyNavbar>[0]> = {}) => {
  const defaultProps = {
    view: 'dashboard' as const,
    setView: vi.fn(),
    xp: 500,
    level: 3,
    onMenuClick: vi.fn(),
    ...props,
  };
  return render(
    <BrowserRouter>
      <AcademyNavbar {...defaultProps} />
    </BrowserRouter>
  );
};

describe('AcademyNavbar', () => {
  it('renders Dashboard and Learning Path buttons', () => {
    renderNavbar();
    expect(screen.getByText('Dashboard')).toBeInTheDocument();
    expect(screen.getByText('Learning Path')).toBeInTheDocument();
  });

  it('displays XP correctly', () => {
    renderNavbar({ xp: 1250 });
    expect(screen.getByText('1,250')).toBeInTheDocument();
  });

  it('displays level and title', () => {
    renderNavbar({ level: 3, userName: 'John Doe' });
    expect(screen.getByText('Level 3 Rookie')).toBeInTheDocument();
  });

  it('shows Junior title for level 4-6', () => {
    renderNavbar({ level: 5 });
    expect(screen.getByText('Level 5 Junior')).toBeInTheDocument();
  });

  it('shows Pro title for level 7-9', () => {
    renderNavbar({ level: 8 });
    expect(screen.getByText('Level 8 Pro')).toBeInTheDocument();
  });

  it('shows Legend title for level 10+', () => {
    renderNavbar({ level: 10 });
    expect(screen.getByText('Level 10 Legend')).toBeInTheDocument();
  });

  it('displays user name', () => {
    renderNavbar({ userName: 'Andre Cvijovic' });
    expect(screen.getByText('Andre Cvijovic')).toBeInTheDocument();
  });

  it('displays initials from user name', () => {
    renderNavbar({ userName: 'Andre Cvijovic' });
    expect(screen.getByText('AC')).toBeInTheDocument();
  });

  it('shows "New Hire" when no name provided', () => {
    renderNavbar();
    expect(screen.getByText('New Hire')).toBeInTheDocument();
  });

  it('shows Manager button when isManager', () => {
    renderNavbar({ isManager: true });
    expect(screen.getByText('Manager')).toBeInTheDocument();
  });

  it('hides Manager button when not manager', () => {
    renderNavbar({ isManager: false });
    expect(screen.queryByText('Manager')).not.toBeInTheDocument();
  });

  it('clicking Dashboard calls setView', () => {
    const setView = vi.fn();
    renderNavbar({ setView, view: 'module' as any });
    fireEvent.click(screen.getByText('Dashboard'));
    expect(setView).toHaveBeenCalledWith('dashboard');
  });

  it('clicking Learning Path calls setView', () => {
    const setView = vi.fn();
    renderNavbar({ setView });
    fireEvent.click(screen.getByText('Learning Path'));
    expect(setView).toHaveBeenCalledWith('module');
  });

  it('sign out button calls onSignOut', () => {
    const onSignOut = vi.fn();
    renderNavbar({ onSignOut });
    // Sign out button has LogOut icon
    const buttons = screen.getAllByRole('button');
    const signOutBtn = buttons.find(b => b.getAttribute('title') === 'Sign Out');
    expect(signOutBtn).toBeTruthy();
    fireEvent.click(signOutBtn!);
    expect(onSignOut).toHaveBeenCalled();
  });

  it('shows brand name in module view', () => {
    renderNavbar({ view: 'module' as any, activeBrand: 'wrh' });
    expect(screen.getByText('We Rank Higher')).toBeInTheDocument();
  });
});
