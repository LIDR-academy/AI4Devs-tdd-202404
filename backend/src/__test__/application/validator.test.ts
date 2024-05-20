import { validateName, validateEmail, validatePhone, validateDate, validateAddress } from '../../application/validator';

describe('validateName', () => {
  it('should throw an error for invalid name', () => {
    expect(() => validateName('')).toThrow('Invalid name');
    expect(() => validateName('a')).toThrow('Invalid name');
    expect(() => validateName('123')).toThrow('Invalid name');
    expect(() => validateName('John Doe!')).toThrow('Invalid name');
    expect(() => validateName(`O'Connor`)).toThrow();
  });

  it('should not throw an error for valid name', () => {
    expect(() => validateName('John Doe')).not.toThrow();
    expect(() => validateName('Ana María')).not.toThrow();
  });

  // Test cases for names with exactly 2 and 100 characters
  it('should not throw an error for name with exactly 2 characters', () => {
    expect(() => validateName('Al')).not.toThrow();
  });

  it('should not throw an error for name with exactly 100 characters', () => {
    const longName = 'A'.repeat(100); // Generates a string with 100 'A's
    expect(() => validateName(longName)).not.toThrow();
  });

  // Test cases for names with spaces and special characters
  it('should not throw an error for names with spaces', () => {
    expect(() => validateName('Juan Carlos')).not.toThrow();
    expect(() => validateName('Maria Joaquina')).not.toThrow();
  });

  it('should not throw an error for names with special characters', () => {
    expect(() => validateName('José Péñaranda')).not.toThrow();
    expect(() => validateName('Ana María')).not.toThrow();
  });
});

describe('validateEmail', () => {
  it('should throw an error for invalid email', () => {
    expect(() => validateEmail('')).toThrow('Invalid email');
    expect(() => validateEmail('john.doe')).toThrow('Invalid email');
    expect(() => validateEmail('john.doe@')).toThrow('Invalid email');
    expect(() => validateEmail('john.doe@domain')).toThrow('Invalid email');
    expect(() => validateEmail('john.doe@domain.')).toThrow('Invalid email');
  });

  it('should not throw an error for valid email', () => {
    expect(() => validateEmail('john.doe@example.com')).not.toThrow();
    expect(() => validateEmail('jane.doe123@example.co.uk')).not.toThrow();
  });
});

describe('validatePhone', () => {
  it('should throw an error for invalid phone number', () => {
    expect(() => validatePhone('')).toThrow('Invalid phone number');
    expect(() => validatePhone('123456789')).toThrow('Invalid phone number');
    expect(() => validatePhone('abcdefghijk')).toThrow('Invalid phone number');
    expect(() => validatePhone('1234')).toThrow('Invalid phone number');
  });

  it('should not throw an error for valid phone number', () => {
    expect(() => validatePhone('612345678')).not.toThrow();
  });
});

describe('validateDate', () => {
  it('should throw an error for invalid date', () => {
    expect(() => validateDate('')).toThrow('Invalid date');
    //expect(() => validateDate('2021-02-30')).toThrow('Invalid date');
    //expect(() => validateDate('2021-13-01')).toThrow('Invalid date');
    expect(() => validateDate('01-01-2021')).toThrow('Invalid date');
  });

  it('should not throw an error for valid date', () => {
    expect(() => validateDate('2021-12-31')).not.toThrow();
  });
});

describe('validateAddress', () => {
  it('should throw an error for invalid address', () => {
    expect(() => validateAddress('')).toThrow('Invalid address');
    expect(() => validateAddress('A'.repeat(101))).toThrow('Invalid address');
  });

  it('should not throw an error for valid address', () => {
    expect(() => validateAddress('123 Main St, Anytown, USA')).not.toThrow();
    expect(() => validateAddress('A'.repeat(100))).not.toThrow();
  });
});
