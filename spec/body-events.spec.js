import application from 'lighty';

import { fixture, clear } from './helpers';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
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

      eventSpy = sinon.spy();

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

      expect(eventSpy.callCount).toEqual(0);

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it('adds support for `<event>[, <event>] on body` pattern', () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a body is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      document.body.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      document.body.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a component nodes is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      const children = node.querySelector('.children');

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      children.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(2);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(3);

      children.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(4);
    });

    it("calls handler when a not component nodes is event's target", () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      const outside = document.querySelector('.outside');
      const parent = document.querySelector('.parent');

      expect(eventSpy.callCount).toEqual(0);

      outside.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      parent.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(2);

      outside.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(3);

      parent.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(4);
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.body-events', {
        init() {
          component = this;
        },

        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);
      expect(component).toBeTruthy();

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).calledOn(component)).toBe(true);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).calledOn(component)).toBe(true);
    });

    it('passes an event to a handler', () => {
      application.component('.body-events', {
        'click, custom-event on body': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).args[0] instanceof Event).toBe(true);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).args[0] instanceof Event).toBe(true);
    });
  });
});
