import application from 'lighty';

import { fixture, clear } from './fixtures';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  afterEach(clear);

  describe('node alias', () => {
    it('adds `this.node` alias for node', done => {
      fixture('<div class="bind"></div>');

      application.component('.bind', {
        init() {
          expect(this.node).toEqual(document.querySelector('.bind'));

          done();
        },
      }).vitalize();
    });
  });
});
