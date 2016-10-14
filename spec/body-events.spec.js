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

  describe('body events', () => {
    let eventSpy;
    let clickEvent;
    let customEvent;
    let node;

    beforeEach(() => {
      fixture(`
        <div class="outside"></div>
        <div class="parent">
          <div class="body-events">
            <div class="children"></div>
          </div>
        </div>
      `);

      eventSpy = jasmine.createSpy('event');

      clickEvent = document.createEvent('HTMLEvents');
      clickEvent.initEvent('click', true, true);

      customEvent = document.createEvent('CustomEvent');
      customEvent.initEvent('custom-event', true, true);

      node = document.querySelector('.body-events');
    });

    afterEach(clear);

    it('adds support for `<event> on body` pattern', () => {
      application.component('.body-events', {
        'click on body': eventSpy,
        'custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it('adds support for `<event>[, <event>] on body` pattern', () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a body is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy).not.toHaveBeenCalled();

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);
    });

    it("calls handler when a component nodes is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      const children = node.querySelector('.children');

      expect(eventSpy).not.toHaveBeenCalled();

      node.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      children.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);

      node.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(3);

      children.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(4);
    });

    it("calls handler when a not component nodes is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      const outside = document.querySelector('.outside');
      const parent = document.querySelector('.parent');

      expect(eventSpy).not.toHaveBeenCalled();

      outside.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(1);

      parent.dispatchEvent(clickEvent);
      expect(eventSpy).toHaveBeenCalledTimes(2);

      outside.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(3);

      parent.dispatchEvent(customEvent);
      expect(eventSpy).toHaveBeenCalledTimes(4);
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.body-events', {
        init() {
          component = this;
        },

        'click, custom-event on body': eventSpy,
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
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
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
