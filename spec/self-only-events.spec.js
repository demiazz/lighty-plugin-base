import application from 'lighty';

import { fixture, clear } from './fixtures';

import plugin from '../src/index';


describe('lighty-plugin-base', () => {
  beforeAll(() => {
    application.use(plugin).run();
  });

  afterEach(clear);

  describe('self only events', () => {
    it('adds support for `<event> on self only` pattern', () => {
      fixture('<div class="self-only-events"></div>');

      const eventSpy = sinon.spy();

      application.component('.self-only-events', {
        'click on self only': eventSpy,
        'custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.self-only-events');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it('adds support for `<event>[, <event>] on self only` pattern', () => {
      fixture('<div class="multiple-self-only-events"></div>');

      const eventSpy = sinon.spy();

      application.component('.multiple-self-only-events', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.multiple-self-only-events');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it("calls handler when a node is event's target", () => {
      fixture('<div class="self-only-events-on-component"></div>');

      const eventSpy = sinon.spy();

      application.component('.self-only-events-on-component', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.self-only-events-on-component');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
    });

    it("doesn't call handler when a node's children is event's target", () => {
      fixture(`
        <div class="self-only-events-on-children">
          <div class="inside"></div>
        </div>
      `);

      const eventSpy = sinon.spy();

      application.component('.self-only-events-on-children', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.self-only-events-on-children .inside');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(0);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(0);
    });

    it('calls handler on a component instance', () => {
      fixture('<div class="self-only-events-context"></div>');

      const eventSpy = sinon.spy();

      let component;

      application.component('.self-only-events-context', {
        init() {
          component = this;
        },

        'click, custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.self-only-events-context');

      expect(eventSpy.callCount).toEqual(0);
      expect(component).toBeTruthy();

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).calledOn(component)).toBe(true);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).calledOn(component)).toBe(true);
    });

    it('passes an event to a handler', () => {
      fixture('<div class="self-only-events-event"></div>');

      const eventSpy = sinon.spy();

      application.component('.self-only-events-event', {
        'click, custom-event on self only': eventSpy,
      }).vitalize();

      const node = document.querySelector('.self-only-events-event');

      expect(eventSpy.callCount).toEqual(0);

      const clickEvent = document.createEvent('HTMLEvents');

      clickEvent.initEvent('click', true, true);

      node.dispatchEvent(clickEvent);

      expect(eventSpy.callCount).toEqual(1);
      expect(eventSpy.getCall(0).args[0] instanceof Event).toBe(true);

      const customEvent = new Event('CustomEvent');

      customEvent.initEvent('custom-event', true, true);

      node.dispatchEvent(customEvent);

      expect(eventSpy.callCount).toEqual(2);
      expect(eventSpy.getCall(1).args[0] instanceof Event).toBe(true);
    });
  });
});
