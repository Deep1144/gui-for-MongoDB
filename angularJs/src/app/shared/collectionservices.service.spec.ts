import { TestBed } from '@angular/core/testing';

import { CollectionservicesService } from './collectionservices.service';

describe('CollectionservicesService', () => {
  let service: CollectionservicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CollectionservicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
