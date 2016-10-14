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

  describe('self events', () => {
    let eventSpy;
    let clickEvent;
    let customEvent;
    let node;

    beforeEach(() => {
      fixture(`
        <div class="self-events">
          <div class="children"></div>
        </div>
      `);

      eventSpy = jasmine.createSpy('event');

      clickEvent = document.createEvent('HTMLEvents');
      clickEvent.initEvent('click', true, true);

      customEvent = document.createEvent('CustomEvent');
      customEvent.initEvent('custom-event', true, true);

      node = document.querySelector('.self-events');
    });

    afterEach(clear);

    it('adds support for `<event> on self` pattern', () => {
      application.component('.self-events', {
        'click on self': eventSpy,
        'custom-event on self': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[, <event>] on self` pattern', () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a node is event's target", () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a node's children is event's target", () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      node = node.querySelector('.children');

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.self-events', {
        init() {
          component = this;
        },

        'click, custom-event on self': eventSpy,
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
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
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
