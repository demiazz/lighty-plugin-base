import application from 'lighty';

import { fixture, clear, matchers } from './helpers';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  beforeEach(() => {
    window.jasmine.addMatchers(matchers);
  });

  describe('load events', () => {
    let eventSpy;

    beforeEach(() => {
      fixture('<div class="load-events"></div>');

      eventSpy = jasmine.createSpy('event');
    });

    afterEach(clear);

    it('adds support for `load on window` pattern', (done) => {
      application.component('.load-events', {
        'load on window': eventSpy,
      });

      expect(eventSpy).not.toHaveBeenCalled();

      setTimeout(() => {
        expect(eventSpy).toHaveBeenCalledTimes(1);

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
        expect(eventSpy).toHaveBeenCalledOn(component);

        done();
      });
    });

    it('passes an event to a handler', (done) => {
      application.component('.load-events', {
        'load on window': eventSpy,
      });

      setTimeout(() => {
        expect(eventSpy.calls.argsFor(0)[0]).toBeInstanceOf(Event);

        done();
      }, 10);
    });
  });
});
