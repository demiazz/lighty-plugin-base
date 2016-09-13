import application from 'lighty';

import { fixture, clear } from './fixtures';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  describe('load events', () => {
    let eventSpy;

    beforeEach(() => {
      fixture('<div class="load-events"></div>');

      eventSpy = sinon.spy();
    });

    afterEach(clear);

    it('adds support for `load on window` pattern', (done) => {
      application.component('.load-events', {
        'load on window': eventSpy,
      });

      expect(eventSpy.callCount).toEqual(0);

      setTimeout(() => {
        expect(eventSpy.callCount).toEqual(1);

        done();
      }, 10);
    });

    it('calls handler on a component instance', (done) => {
      let component;

      application.component('.load-events', {
        init() {
          component = this;
        },

        'load on window': eventSpy,
      });

      setTimeout(() => {
        expect(eventSpy.calledOn(component)).toBe(true);

        done();
      });
    });

    it('passes an event to a handler', (done) => {
      application.component('.load-events', {
        'load on window': eventSpy,
      });

      setTimeout(() => {
        expect(eventSpy.getCall(0).args[0] instanceof Event).toBe(true);

        done();
      }, 10);
    });
  });
});
