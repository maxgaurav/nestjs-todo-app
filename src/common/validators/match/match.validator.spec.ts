import { MatchValidator } from './match.validator';

describe('MatchValidator', () => {
  let validator: MatchValidator;

  beforeEach(() => {
    validator = new MatchValidator();
  });

  it('should be defined', () => {
    expect(validator).toBeDefined();
  });

  it('should return true when value and comparison value are equal', () => {
    const data = 'sample';
    expect(
      validator.validate(data, {
        constraints: ['property'],
        object: { property: data },
      } as any),
    ).toEqual(true);
  });

  it('should return false when value and comparison value are not equal', () => {
    const data = 'sample';
    expect(
      validator.validate(data, {
        constraints: ['property'],
        object: { property: 'fail' },
      } as any),
    ).toEqual(false);
  });

  it('should return false when value and comparison value are not equal', () => {
    const data = 'sample';
    expect(
      validator.validate(data, {
        constraints: ['property'],
        object: { property: 'fail' },
      } as any),
    ).toEqual(false);
  });

  it('should return false if the comparison property is not provided as input', () => {
    const data = 'sample';
    expect(
      validator.validate(data, {
        constraints: ['property'],
        object: { fail: 'fail' },
      } as any),
    ).toEqual(false);
  });

  it('should return default error message', () => {
    expect(
      validator.defaultMessage({
        constraints: ['prop'],
        property: 'test',
      } as any),
    ).toEqual('test must match prop');
  });
});
