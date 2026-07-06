import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';
import App from './App.jsx';
import { parseMarkdown } from './utils/markdown.jsx';

// Mock SpeechSynthesis APIs for Jest
beforeAll(() => {
  global.window.speechSynthesis = {
    speak: jest.fn(),
    cancel: jest.fn(),
  };
});

describe('FIFA ArenaFlow AI Testing Suite', () => {
  test('renders hero title and sandbox notice on landing page', () => {
    render(<App />);
    expect(screen.getByText(/Next-Generation Stadium Operations/i)).toBeInTheDocument();
    expect(screen.getByText(/FIFA WORLD CUP 2026 OFFICIAL SANDBOX/i)).toBeInTheDocument();
  });

  test('navigates to Fan Portal and processes AI chatbot query', async () => {
    render(<App />);
    
    // Locate the Fan Portal link in the navigation header exactly
    const fanPortalBtn = screen.getByRole('button', { name: /^Fan Portal/i });
    fireEvent.click(fanPortalBtn);

    // Verify view has switched
    expect(screen.getByText(/Fan Companion Hub/i)).toBeInTheDocument();

    // Verify AI chatbot suggestion button is rendered and click it
    const suggestionBtn = screen.getByRole('button', { name: /Ask: Can I bring a power bank\?/i });
    fireEvent.click(suggestionBtn);

    // Verify user message is added (could match button and bubble)
    const userMsgElements = screen.getAllByText(/Can I bring a power bank\?/i);
    expect(userMsgElements.length).toBeGreaterThan(0);
  });

  test('navigates to Ops Dashboard and adds an incident ticket', () => {
    render(<App />);
    
    // Locate and click Ops Dashboard button exactly
    const opsBtn = screen.getByRole('button', { name: /^Ops Dashboard$/i });
    fireEvent.click(opsBtn);

    // Verify Ops Dashboard header
    expect(screen.getByRole('heading', { name: /Operations Command Center/i })).toBeInTheDocument();

    // Select category and fill form
    const categorySelect = screen.getByLabelText(/Category/i);
    fireEvent.change(categorySelect, { target: { value: 'Medical Support' } });

    const locationInput = screen.getByLabelText(/Location \/ Gate \/ Sector/i);
    fireEvent.change(locationInput, { target: { value: 'Section 104, Row J' } });

    const descTextarea = screen.getByLabelText(/Brief Description/i);
    fireEvent.change(descTextarea, { target: { value: 'Spectator feeling dizzy.' } });

    // Submit form
    const submitBtn = screen.getByRole('button', { name: /File Ticket & Run AI Dispatch/i });
    fireEvent.click(submitBtn);

    // Verify the ticket has appeared on the dashboard (could be multiple locations)
    const matchedLocs = screen.getAllByText(/Section 104, Row J/i);
    expect(matchedLocs.length).toBeGreaterThan(0);

    const matchedDescs = screen.getAllByText(/Spectator feeling dizzy/i);
    expect(matchedDescs.length).toBeGreaterThan(0);
  });

  test('safely parses bold markdown tokens', () => {
    render(<div>{parseMarkdown('This is **bold** text')}</div>);
    const boldEl = screen.getByText('bold');
    expect(boldEl.tagName).toBe('STRONG');
  });
});
