import { skipDueOnValidation, StoreTaskDto } from './store-task.dto';

describe('StoreTaskDto', () => {
  it('should be defined', () => {
    expect(new StoreTaskDto()).toBeDefined();
  });

  it('should return true when due on is not empty', () => {
    expect(skipDueOnValidation({ due_on: 'true' })).toEqual(true);
  });

  it('should return false when due on is empty', () => {
    expect(skipDueOnValidation({ due_on: null })).toEqual(false);
    expect(skipDueOnValidation({ due_on: undefined })).toEqual(false);
    expect(skipDueOnValidation({ due_on: '' })).toEqual(false);
  });
});
