import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
  async function setup() {
    const fixture = TestBed.createComponent(AppComponent);
    await fixture.whenStable();
    return { fixture, element: fixture.nativeElement as HTMLElement };
  }

  it('renders the title and the empty state', async () => {
    const { element } = await setup();

    expect(element.querySelector('h1')?.textContent).toContain('APixel');
    expect(element.querySelector('.playground__empty')?.textContent).toContain('Drop an image here');
  });

  it('disables downloading until an image is loaded', async () => {
    const { element } = await setup();
    const download = Array.from(element.querySelectorAll('button')).find((b) => b.textContent?.includes('Download'));

    expect(download?.disabled).toBe(true);
  });

  it('shows an error for files that are not images', async () => {
    const { fixture, element } = await setup();

    await fixture.componentInstance.loadFile(new File(['hello'], 'notes.txt', { type: 'text/plain' }));
    await fixture.whenStable();

    expect(element.querySelector('[role="alert"]')?.textContent).toContain('not an image');
  });
});
