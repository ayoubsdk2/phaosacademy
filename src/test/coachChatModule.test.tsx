import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { CoachChatModule } from '@/components/academy/modules/CoachChatModule';
import { streamChat } from '@/lib/streamChat';
import { COACHING_ANSWER_KEYS } from '@/data/coachingAnswerKeys';

vi.mock('react-markdown', () => ({
  default: ({ children }: any) => <div>{children}</div>,
}));

vi.mock('@/hooks/use-toast', () => ({
  toast: vi.fn(),
}));

vi.mock('@/lib/streamChat', () => ({
  streamChat: vi.fn(),
}));

vi.mock('@/integrations/supabase/client', () => ({
  supabase: {
    auth: { getUser: () => Promise.resolve({ data: { user: null } }) },
    from: () => ({ insert: () => Promise.resolve({ error: null }) }),
    functions: { invoke: () => Promise.resolve({ data: null, error: new Error('mocked: judge offline') }) },
  },
}));

const mockedStreamChat = vi.mocked(streamChat);

describe('CoachChatModule', () => {
  beforeEach(() => {
    mockedStreamChat.mockReset();
    mockedStreamChat.mockImplementation(async ({ onDelta, onDone }: any) => {
      onDelta('Premature verdict. [SCORE:1/10] [EXERCISE_COMPLETE]');
      onDone();
    });
  });

  it('does not end the coaching session before four trainee responses', async () => {
    const onComplete = vi.fn();
    const onScore = vi.fn();

    render(
      <CoachChatModule
        title="Coach Chat: Test"
        prompt="Practice four responses."
        onComplete={onComplete}
        onScore={onScore}
      />
    );

    await waitFor(() => expect(screen.getByPlaceholderText('Type your response...')).not.toBeDisabled());

    for (let i = 1; i <= 3; i += 1) {
      fireEvent.change(screen.getByPlaceholderText('Type your response...'), { target: { value: `Weak answer ${i}` } });
      fireEvent.click(screen.getByRole('button'));
      await screen.findByText(new RegExp(`Give me response ${i + 1} of 4 before I score`, 'i'));
      expect(screen.queryByText(/Continue to next module/i)).not.toBeInTheDocument();
    }

    expect(onScore).not.toHaveBeenCalled();
    expect(onComplete).not.toHaveBeenCalled();
  });

  it('shows perfect four responses and requires the save button after the fourth response', async () => {
    const onComplete = vi.fn();
    const onScore = vi.fn().mockResolvedValue(undefined);

    render(
      <CoachChatModule
        title="Coach Chat: Test"
        prompt="Practice four responses."
        onComplete={onComplete}
        onScore={onScore}
      />
    );

    await waitFor(() => expect(screen.getByPlaceholderText('Type your response...')).not.toBeDisabled());

    for (let i = 1; i <= 4; i += 1) {
      fireEvent.change(screen.getByPlaceholderText('Type your response...'), { target: { value: `Strong practice answer ${i}` } });
      fireEvent.click(screen.getByRole('button'));
      if (i < 4) {
        await screen.findByText(new RegExp(`Give me response ${i + 1} of 4 before I score`, 'i'));
      }
    }

    await screen.findByText(/Perfect 4 Responses to Score 10\/10/i);
    expect(screen.getByText(/Coaching complete — Final score: 1\/10/i)).toBeInTheDocument();
    expect(onComplete).not.toHaveBeenCalled();

    await waitFor(() => expect(onScore).toHaveBeenCalledWith({ correct: 1, total: 10 }, false));
    fireEvent.click(screen.getByText('Continue to next module'));
    await waitFor(() => expect(onScore).toHaveBeenCalledWith({ correct: 1, total: 10 }, true));
    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('scores a module answer key as 10/10 even when the coach stream says 7/10', async () => {
    mockedStreamChat.mockImplementation(async ({ onDelta, onDone }: any) => {
      onDelta('Generic final feedback. [SCORE:7/10] [EXERCISE_COMPLETE]');
      onDone();
    });
    const onScore = vi.fn().mockResolvedValue(undefined);
    const answerKey = COACHING_ANSWER_KEYS['6-p3-chat'];

    render(
      <CoachChatModule
        moduleId="6-p3-chat"
        title="Coach Chat: Price Justification"
        prompt="Provide David with ROI logic regarding lead conversion and review growth."
        onComplete={vi.fn()}
        onScore={onScore}
      />
    );

    await waitFor(() => expect(screen.getByPlaceholderText('Type your response...')).not.toBeDisabled());
    for (let index = 0; index < answerKey.length; index += 1) {
      const answer = answerKey[index];
      fireEvent.change(screen.getByPlaceholderText('Type your response...'), { target: { value: answer } });
      fireEvent.click(screen.getByRole('button'));
      if (index < answerKey.length - 1) {
        await waitFor(() => expect(screen.getByPlaceholderText('Type your response...')).not.toBeDisabled());
      }
    }

    await screen.findByText(/Coaching complete — Final score: 10\/10/i);
    await waitFor(() => expect(onScore).toHaveBeenCalledWith({ correct: 10, total: 10 }, false));
  });
});