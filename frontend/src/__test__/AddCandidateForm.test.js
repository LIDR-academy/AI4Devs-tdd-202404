
import { render, fireEvent, screen } from '@testing-library/react';
import AddCandidateForm from '../components/AddCandidateForm';


test('renders AddCandidateForm and submits data', async () => {
  render(<AddCandidateForm />);

  fireEvent.change(screen.getByLabelText(/Nombre/i), { target: { value: 'John' } });
  fireEvent.change(screen.getByLabelText(/Apellido/i), { target: { value: 'Doe' } });
  fireEvent.change(screen.getByLabelText(/Correo Electrónico/i), { target: { value: 'john.doe@example.com' } });

  fireEvent.click(screen.getByText(/Enviar/i));

  expect(await screen.findByText(/Candidato añadido con éxito/i)).toBeInTheDocument();
});

