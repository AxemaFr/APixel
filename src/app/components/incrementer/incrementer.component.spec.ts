import { ComponentFixture, TestBed } from '@angular/core/testing';
import { IncrementerComponent } from './incrementer.component';

describe('IncrementerComponent', () => {
  let fixture: ComponentFixture<IncrementerComponent>;
  let component: IncrementerComponent;

  function setup(inputs: { value: number; step?: number; min?: number; max?: number }): void {
    fixture = TestBed.createComponent(IncrementerComponent);
    component = fixture.componentInstance;
    for (const [name, value] of Object.entries(inputs)) {
      fixture.componentRef.setInput(name, value);
    }
    fixture.detectChanges();
  }

  const buttons = () => fixture.nativeElement.querySelectorAll('button') as NodeListOf<HTMLButtonElement>;

  it('increases and decreases the value by the step', () => {
    setup({ value: 5, step: 2 });

    component.increase();
    expect(component.value()).toBe(7);

    component.decrease();
    component.decrease();
    expect(component.value()).toBe(3);
  });

  it('does not accumulate floating point noise', () => {
    setup({ value: 0.1, step: 0.1, min: 0, max: 2 });

    component.increase();
    component.increase();
    expect(component.value()).toBe(0.3);
  });

  it('clamps to the bounds, so they are always reachable', () => {
    setup({ value: 9, step: 3, min: 1, max: 10 });

    component.increase();
    expect(component.value()).toBe(10);

    component.value.set(2);
    component.decrease();
    expect(component.value()).toBe(1);
  });

  it('disables the buttons at the bounds and shows the value', async () => {
    setup({ value: 10, min: 0, max: 10 });
    await fixture.whenStable();

    const [minus, plus] = buttons();
    expect(minus.disabled).toBe(false);
    expect(plus.disabled).toBe(true);
    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('10');
  });

  it('reacts to clicks', async () => {
    setup({ value: 1, max: 10 });
    buttons()[1].click();
    await fixture.whenStable();

    expect(component.value()).toBe(2);
    expect(fixture.nativeElement.querySelector('output').textContent.trim()).toBe('2');
  });
});
