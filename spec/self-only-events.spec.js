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

  describe('self only events', () => {
    let eventSpy;
    let clickEvent;
    let customEvent;
    let node;

    beforeEach(() => {
      fixture(`
        <div class="self-only-events">
          <div class="children"></div>
        </div>
      `);

      eventSpy = jasmine.createSpy('event');

      clickEvent = document.createEvent('HTMLEvents');
      clickEvent.initEvent('click', true, true);

      customEvent = document.createEvent('CustomEvent');
      customEvent.initEvent('custom-event', true, true);

      node = document.querySelector('.self-only-events');
    });

    afterEach(clear);

    it('adds support for `<event> on self only` pattern', () => {
      application.component('.self-only-events', {
        'click on self only': eventSpy,
        'custom-event on self only': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[, <event>] on self only` pattern', () => {
      application.component('.self-only-events', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a node is event's target", () => {
      application.component('.self-only-events', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("doesn't call handler when a node's children is event's target", () => {
      application.component('.self-only-events', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      node = node.querySelector('.children');
      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(customEvent);
      expect(eventSpy).not.toHaveBeenCalled();
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.self-only-events', {
        init() {
          component = this;
        },

        'click, custom-event on self only': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();
      expect(component).toBeTruthy();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);

      expect(eventSpy).toHaveBeenCalledOn(component);
    });

    it('passes an event to a handler', () => {
      application.component('.self-only-events', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);
      expect(eventSpy.calls.argsFor(0)[0]).toBeInstanceOf(Event);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
      expect(eventSpy.calls.argsFor(1)[0]).toBeInstanceOf(Event);
    });
  });
});
