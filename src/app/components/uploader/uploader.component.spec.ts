import { TestBed } from '@angular/core/testing';
import { UploaderComponent } from './uploader.component';

describe('UploaderComponent', () => {
  it('emits the picked file', async () => {
    const fixture = TestBed.createComponent(UploaderComponent);
    await fixture.whenStable();

    const selected = vi.fn();
    fixture.componentInstance.fileSelect.subscribe(selected);

    const file = new File(['png'], 'cat.png', { type: 'image/png' });
    const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
    Object.defineProperty(input, 'files', { value: [file] });
    input.dispatchEvent(new Event('change'));

    expect(selected).toHaveBeenCalledWith(file);
  });

  it('accepts only images', () => {
    const fixture = TestBed.createComponent(UploaderComponent);
    expect(fixture.nativeElement.querySelector('input').accept).toBe('image/*');
  });
});
