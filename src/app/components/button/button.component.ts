import {ChangeDetectionStrategy, ChangeDetectorRef, Component, EventEmitter, Input, OnInit} from '@angular/core';

export enum ButtonThemes {
  primary = 'primary',
  secondary = 'secondary',
  alert = 'alert',
}

export enum ButtonSize {
  sm = 'sm',
  lg = 'lg',
}

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() theme = ButtonThemes.primary;
  @Input() disabled = false;
  @Input() buttonSize: ButtonSize = ButtonSize.lg;
  @Input() index = 0;

  constructor(private cdr: ChangeDetectorRef) {}

  public readonly click: EventEmitter<void> = new EventEmitter();

  public emitClick(event: Event): void {
    if (this.disabled) {
      return;
    }

    this.click.emit();
  }

  public setTheme(theme: ButtonThemes): void {
    this.theme = theme;
    this.cdr.detectChanges();
  }
}

