import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom/extend-expect';
import fetchMock from 'jest-fetch-mock';
import Notes from './Notes';

// Set up the fetch mock
fetchMock.enableMocks();

describe('Notes Component', () => {
  test('renders the component', () => {
    render(<Notes />);
  
    // Test component rendering
    expect(screen.getByText('Notes')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('create a note for patient')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument();
    expect(screen.getByText('Cost:')).toBeInTheDocument();
    expect(screen.getByTestId('cost-textfield')).toBeInTheDocument();
  });

  test('saves a note when Save button is clicked', async () => {
    render(<Notes />);
  
    // Mock fetch response
    fetchMock.mockIf('http://localhost:8086/notes/add', (req) => {
      expect(req.method).toBe('POST');
      expect(req.headers.get('Content-Type')).toBe('application/json');
      expect(JSON.parse(req.body)).toEqual({
        appointment_id: 2,
        patientId: 2,
        created: expect.any(String),
        updated: expect.any(String),
        content: 'Sample note content',
      });
      return Promise.resolve(JSON.stringify({}), { status: 200 });
    });

    // Type some content in the textarea
    const textarea = screen.getByPlaceholderText('create a note for patient');
    userEvent.type(textarea, 'Sample note content');

    // Click the Save button
    const saveButton = screen.getByRole('button', { name: 'Save' });
    userEvent.click(saveButton);

    // Verify that the note is saved successfully
    await waitFor(() => {
      expect(fetchMock).toHaveBeenCalledTimes(1);
    });
  });
});
