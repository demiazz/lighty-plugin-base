import application from 'lighty';

import { fixture, clear } from './helpers';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  afterEach(clear);

  describe('query selector alias', () => {
    // eslint-disable-next-line
    it('adds `this.querySelector(<selector>)` alias for `this.node.querySelector(<selector>)`', (done) => {
      fixture(`
        <div class="outside element">
        <div class="query-selector">
          <div class="inside element" />
          <div>
            <div class="inside element" />
          </div>
        </div>
      `);

      application.component('.query-selector', {
        init() {
          expect(this.querySelector('.element'))
            .toEqual(document.querySelector('.query-selector .element'));

          done();
        },
      }).vitalize();
    });

    it('adds `this.querySelectorAll(<selector>)` alias for `this.node.querySelectorAll(<selector>)`', (done) => {
      fixture(`
        <div class="outside element">
        <div class="query-selector-all">
          <div class="inside element" />
          <div>
            <div class="inside element" />
          </div>
        </div>
      `);

      application.component('.query-selector-all', {
        init() {
          expect(this.querySelectorAll('.element'))
            .toEqual(document.querySelectorAll('.query-selector-all .element'));

          done();
        },
      }).vitalize();
    });
  });
});
