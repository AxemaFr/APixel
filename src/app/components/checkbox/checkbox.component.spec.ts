import { TestBed } from '@angular/core/testing';
import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  it('syncs its value with the native checkbox', async () => {
    const fixture = TestBed.createComponent(CheckboxComponent);
    await fixture.whenStable();
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');

    input.click();
    await fixture.whenStable();
    expect(fixture.componentInstance.value()).toBe(true);

    fixture.componentInstance.value.set(false);
    await fixture.whenStable();
    expect(input.checked).toBe(false);
  });
});
