import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Palette } from '../../core/palettes';
import { PaletteComponent } from './palette.component';

describe('PaletteComponent', () => {
  const palettes: Palette[] = [
    { name: 'Original', colors: null },
    {
      name: 'Mono',
      colors: [
        [0, 0, 0],
        [255, 255, 255],
      ],
    },
    { name: 'Red', colors: [[255, 0, 0]] },
  ];

  let fixture: ComponentFixture<PaletteComponent>;
  let component: PaletteComponent;

  beforeEach(async () => {
    fixture = TestBed.createComponent(PaletteComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('palettes', palettes);
    await fixture.whenStable();
  });

  const text = (selector: string) => fixture.nativeElement.querySelector(selector)?.textContent.trim();

  it('cycles forward and wraps around', () => {
    component.next();
    component.next();
    expect(component.index()).toBe(2);

    component.next();
    expect(component.index()).toBe(0);
  });

  it('cycles backward and wraps around', () => {
    component.prev();
    expect(component.index()).toBe(2);
  });

  it('renders the swatches of the current palette', async () => {
    expect(text('.ui-palette__name')).toBe('Original');
    expect(text('.ui-palette__hint')).toBe('Keeps the image colors');

    component.next();
    await fixture.whenStable();

    const swatches = fixture.nativeElement.querySelectorAll('.ui-palette__color') as NodeListOf<HTMLElement>;
    expect(text('.ui-palette__name')).toBe('Mono');
    expect(Array.from(swatches, (swatch) => swatch.style.backgroundColor)).toEqual([
      'rgb(0, 0, 0)',
      'rgb(255, 255, 255)',
    ]);
  });
});
