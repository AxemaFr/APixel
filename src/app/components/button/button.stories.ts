import {moduleMetadata} from '@storybook/angular';
import {boolean, select, text} from '@storybook/addon-knobs';
import {ButtonModule} from './button.module';

export default {
  title: 'Elements/Button',
  decorators: [moduleMetadata({
    imports: [ButtonModule],
  })],
};

export const lg = () => ({
  template: `<ui-button [disabled]="disabled" [theme]="theme">{{ text }}</ui-button>`,
  props: {
    text: text('text', 'Сохранить изменения'),
    disabled: boolean('disabled', false),
    theme: select('theme', { primary: 'primary', secondary: 'secondary', alert: 'alert' }, 'primary'),
  }
});

export const small = () => ({
  template: `<ui-button [buttonSize]="'sm'" [disabled]="disabled" [theme]="theme">{{ text }}</ui-button>`,
  props: {
    text: text('text', 'Сохранить изменения'),
    disabled: boolean('disabled', false),
    theme: select('theme', { primary: 'primary', secondary: 'secondary', alert: 'alert' }, 'primary'),
  }
});
