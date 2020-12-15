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
  selector: 'ui-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.styl'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ButtonComponent {
  @Input() theme = ButtonThemes.primary;
  @Input() disabled: boolean;
  @Input() buttonSize: ButtonSize = ButtonSize.lg;
  @Input() index: number;

  constructor(private cdr: ChangeDetectorRef) {}

  public readonly click: EventEmitter<void> = new EventEmitter();

  emitClick() {
    this.click.emit();
  }

  setTheme(theme: ButtonThemes) {
    this.theme = theme;
    this.cdr.detectChanges();
  }
}

