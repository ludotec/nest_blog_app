import { BlogEntryEntity } from './blog-entry.entity';

describe('BlogEntry', () => {
  it('should be defined', () => {
    expect(new BlogEntryEntity()).toBeDefined();
  });
});
