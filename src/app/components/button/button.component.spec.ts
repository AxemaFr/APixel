import { TestBed } from '@angular/core/testing';
import { ButtonComponent } from './button.component';

describe('ButtonComponent', () => {
  async function setup(disabled: boolean) {
    const fixture = TestBed.createComponent(ButtonComponent);
    fixture.componentRef.setInput('disabled', disabled);
    await fixture.whenStable();

    const pressed = vi.fn();
    fixture.componentInstance.pressed.subscribe(pressed);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');
    return { button, pressed };
  }

  it('emits `pressed` on click', async () => {
    const { button, pressed } = await setup(false);
    button.click();
    expect(pressed).toHaveBeenCalledTimes(1);
  });

  it('does not emit while disabled', async () => {
    const { button, pressed } = await setup(true);
    button.click();
    expect(button.disabled).toBe(true);
    expect(pressed).not.toHaveBeenCalled();
  });
});
