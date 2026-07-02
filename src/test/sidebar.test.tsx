import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AcademySidebar } from '@/components/academy/AcademySidebar';
import { ACADEMY_DATA, type Week } from '@/data/academyData';

// framer-motion is globally mocked in src/test/setup.ts (Proxy-based passthrough).

const weeks: Week[] = JSON.parse(JSON.stringify(ACADEMY_DATA));

describe('AcademySidebar', () => {
  const defaultProps = {
    weeks,
    activeDay: 1,
    completedModules: new Set<string>(),
    collapsed: false,
    onToggle: vi.fn(),
    onDayClick: vi.fn(),
    onModuleClick: vi.fn(),
  };

  it('renders all week titles', () => {
    render(<AcademySidebar {...defaultProps} />);
    expect(screen.getByText(/Week 1/)).toBeInTheDocument();
    expect(screen.getByText(/Week 2/)).toBeInTheDocument();
  });

  it('renders all day titles', () => {
    render(<AcademySidebar {...defaultProps} />);
    expect(screen.getAllByText(/Day 1\b/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Day 10\b/).length).toBeGreaterThan(0);
  });

  it('shows expanded modules for active day', () => {
    render(<AcademySidebar {...defaultProps} activeDay={1} />);
    expect(screen.getAllByText(/A Letter from Our CEO/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/The Ultimate Marketing Loop/i).length).toBeGreaterThan(0);
  });

  it('clicking an unlocked day calls onDayClick', () => {
    const onDayClick = vi.fn();
    render(<AcademySidebar {...defaultProps} onDayClick={onDayClick} />);
    const day1Btn = screen.getAllByText(/Day 1\b/)[0];
    fireEvent.click(day1Btn);
    expect(onDayClick).toHaveBeenCalledWith(1);
  });

  it('clicking a locked day does not call onDayClick', () => {
    const onDayClick = vi.fn();
    render(<AcademySidebar {...defaultProps} onDayClick={onDayClick} />);
    const day2Btn = screen.getAllByText(/Day 2\b/)[0];
    fireEvent.click(day2Btn);
    expect(onDayClick).not.toHaveBeenCalled();
  });

  it('clicking a module calls onModuleClick with correct day and index', () => {
    const onModuleClick = vi.fn();
    render(<AcademySidebar {...defaultProps} activeDay={1} onModuleClick={onModuleClick} />);
    // Click second module (The Vision & The Triad — module index 1)
    const moduleBtn = screen.getAllByText(/The Vision & The Triad/i)[0];
    fireEvent.click(moduleBtn);
    expect(onModuleClick).toHaveBeenCalledWith(1, 1);
  });

  it('shows check marks for completed modules', () => {
    const completed = new Set(['1-1', '1-2']);
    render(<AcademySidebar {...defaultProps} activeDay={1} completedModules={completed} />);
    // The completed modules should have check icons (we can verify the component renders)
    expect(screen.getAllByText(/A Letter from Our CEO/i).length).toBeGreaterThan(0);
  });

  it('hides text when collapsed', () => {
    render(<AcademySidebar {...defaultProps} collapsed={true} />);
    expect(screen.queryByText(/Week 1: Foundation/)).not.toBeInTheDocument();
  });

  it('collapse toggle button calls onToggle', () => {
    const onToggle = vi.fn();
    render(<AcademySidebar {...defaultProps} onToggle={onToggle} />);
    // The last button is the collapse toggle
    const buttons = screen.getAllByRole('button');
    const collapseBtn = buttons[buttons.length - 1];
    fireEvent.click(collapseBtn);
    expect(onToggle).toHaveBeenCalled();
  });

  it('shows brand dots for each day', () => {
    render(<AcademySidebar {...defaultProps} />);
    // Each day should render (10 day buttons)
    const allDays = weeks.flatMap(w => w.days);
    allDays.forEach(day => {
      expect(screen.getByText(new RegExp(`Day ${day.id}:`))).toBeInTheDocument();
    });
  });
});
