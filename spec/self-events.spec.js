import application from 'lighty';

import { fixture, clear } from './fixtures';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
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

      eventSpy = sinon.spy();

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

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it('adds support for `<event>[, <event>] on self` pattern', () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a node is event's target", () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a node's children is event's target", () => {
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
      }).vitalize();

      node = node.querySelector('.children');

      expect(eventSpy.callCount).toEqual(0);

      node.dispatchEvent(clickEvent);
      expect(eventSpy.callCount).toEqual(1);

      node.dispatchEvent(customEvent);
      expect(eventSpy.callCount).toEqual(2);
    });

    it('calls handler on a component instance', () => {
      let component;

      application.component('.self-events', {
        init() {
          component = this;
        },

        'click, custom-event on self': eventSpy,
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
      application.component('.self-events', {
        'click, custom-event on self': eventSpy,
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
