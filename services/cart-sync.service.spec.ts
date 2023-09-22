import { TestBed } from '@angular/core/testing';

import { CartSyncService } from './cart-sync.service';

describe('CartSyncService', () => {
  let service: CartSyncService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartSyncService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
